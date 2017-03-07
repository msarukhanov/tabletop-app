/**
 * Created by xgharibyan on 4/3/15.
 */
var md5 = require('MD5');
var latestData = require('moment-timezone/data/packed/latest.json');
var moment   = require('moment');
var moment_timezone = require('moment-timezone');
moment_timezone.tz.load(latestData);

var http = require('http');
//var wait = require('wait.for');
var knex = require('knex')({
    client: 'pg',
    connection: 'postgres://gxlwcegldechzz:073cc0afaa097f77f818c89d3d3e9d1a2309ba743977e63a78c86bb5662b9afc@ec2-54-225-230-243.compute-1.amazonaws.com:5432/d12ief33mdff9t?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
});

var redisRequests = require('./redisRequests');

var charJson = {
    main : {
        Name : "",
        Player : "",
        Chronicle : "",
        Nature : "",
        Demeanor : "",
        Concept : "",
        Clan : "",
        Generation : "",
        Sire : ""
    },
    attr : {
        Alertness : "",
        Athletics : "",
        Brawl : "",
        Dodge : "",
        Empathy : "",
        Expression : "",
        Intimidation : "",
        Leadership : "",
        Streetwise : "",
        Subterfuge : "",
        AnimalKen : "",
        Crafts : "",
        Drive : "",
        Etiquette : "",
        Firearms : "",
        Performance : "",
        Melee : "",
        Security : "",
        Stealth : "",
        Survival : "",
        Academics : "",
        Computer : "",
        Finance : "",
        Investigation : "",
        Law : "",
        Linguistics : "",
        Medicine : "",
        Occult : "",
        Politics : "",
        Science : ""
    },
    disciplines : {

    },
    advantages : {

    },
    virtues : {

    }
};

//knex('charlists')
//    .update({list: JSON.stringify(charJson)})
//    .where({id : 1})
//    .then(function(rows) {
//        //console.log(rows[0]);
//    }, function(error) {
//        //console.log(error);
//    });

global.appRoute = function(app, route, callback, permissions) {
    return app.post('/api/'+route, function (req, res) {
        if (req.headers.authorization == undefined) {
            res.send({error: true, message: 'Authorization token required', error_code: 'auth_1'}).end();
        }
        else {
            redisRequests.Getter(req.headers.authorization, function (result) {
                if (result.error != true && result.data != null) {
                    if(permissions) {
                        if(permissions.indexOf(result.data.user_type) > -1) {
                            try {
                                callback(req, res, result.data);
                            } catch (ex) {
                                console.error(ex);
                                res.send({success: false, err: ex.message}).end();
                            }
                        }
                        else {
                            res.send({error: true, message: 'Access denied.'}).end();
                        }
                    }
                    else {
                        callback(req, res, result.data);
                    }
                }
                else {
                    res.send({error: true, message: 'Session Expired or User does not exist', error_code: 'err_5'}).end();
                }
            })
        }
    });
};
global.userToRedis = function(user, cookieExpireTime, callback) {
    redisRequests.SetterEx(user.user_token, cookieExpireTime, user, function (result) {
        if (result.error != true) {
            callback({error: false, message: 'Success', data: user});
        }
        else {
            callback({error: true, message: 'Error', error_code: 'Red_1'});
        }
    });
};

function getServer(currentUser, cb_success, cb_error) {
    var select = currentUser.type == 'player' ? ['server_id', 'schema_id', 'name'] : ['server_id', 'schema_id', 'users', 'name'] ;
    knex('servers').select(select)
        .where({
            server_id: currentUser.server_id
        })
        .then(function(rows) {
            cb_success(rows[0]);
        }, function(error) {
            cb_error(error);
        })
}
function getCharacter(currentUser, cb_success, cb_error) {
    if(currentUser.type == 'player') {
        knex('chars').select(['char_name', 'charlist_id', 'bio_id', 'id as char_id'])
            .where({
                id: currentUser.char_id
            })
            .then(function(rows) {
                cb_success(rows[0]);
            }, function(error) {
                cb_error(error);

            })
    }
    else {
        knex('chars').select(['char_name', 'charlist_id', 'bio_id'])
            .where({
                server_id: currentUser.server_id
            })
            .then(function(rows) {
                cb_success(rows);
            }, function(error) {
                cb_error(error);

            })
    }
}

module.exports = function (app) {

    //var Account = require('./models/account')(app, knex, md5, crypto, generators);
    //Account.regRoutes();

    app.post('/api/signIn', function (req, res) {
        if (req.headers.authorization == undefined) {
            knex('users').select('*')
                .where({
                    username: req.body.username,
                    password: req.body.password
                })
                .then(function (rows) {
                    if (_.isEmpty(rows)) {
                        res.send({error: true, message: 'Email or Password is Wrong', data: null})
                    }
                    else {
                        var timestamp = (moment().unix()*1000+moment().millisecond());
                        var uniqueID = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 6; i++) uniqueID += possible.charAt(Math.floor(Math.random() * possible.length));
                        rows[0].user_token = uniqueID+'T'+rows[0].user_id+'T'+timestamp;
                        userToRedis(rows[0], 30000, function(data) { res.send(data) });
                        knex('users').update({login_at : new Date()}).where({username: req.body.username}).then(function(a){}, function(e){})
                    }
                }, function (error) {
                    res.send({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });
        }
        else {
            res.send({error: true, message: 'Already logged in.', error_code: 'auth_1'}).end();
        }
    });

    appRoute(app, 'accountInfo', function(req,res,currentUser) {
        if(currentUser) {
            currentUser = _.omit(currentUser, ["password","joined_at","login_at"]);
            if(currentUser.server_id && !currentUser.server_info) {
                getServer(currentUser, function(server) {
                    currentUser.server_info = server;
                    if(currentUser.type = 'player') {
                        if(!currentUser.char_info) {
                            getCharacter(currentUser, function(player_char) {
                                currentUser.char_info = player_char;
                                userToRedis(currentUser, 30000, function(data) {
                                    res.send({error: false, data: currentUser}).end();
                                });
                            }, function(error) {
                                res.send({error: true, message: 'db error chars'}).end();
                            });
                        }
                        else {
                            res.send({error: false, data: currentUser}).end();
                        }
                    }
                    else {
                        currentUser.server_info.users = currentUser.server_info.users.split(",");
                        userToRedis(currentUser, 30000, function(data) {});
                        res.send({error: false, data: currentUser}).end();
                    }
                }, function(error) {
                    res.send({error: true, message: 'db error servers'}).end();
                });
            }
            else {
                res.send({error: false, data: currentUser}).end();
            }
        }
        else {
            res.send({error: true, message: 'Authorization token required', error_code: 'auth_1'}).end();
        }
    });

    appRoute(app, 'getCharacterList', function(req,res,currentUser) {
        if(currentUser) {
            if(currentUser.server_id) {
                knex('charlists').select(["id","list","schema_id"])
                    .where({
                        char_id: req.body.char_id
                    })
                    .then(function(rows) {
                        currentUser.char_info.charlist = rows[0];
                        if(!currentUser.server_info.charlist_name) {
                            knex('schemas').select(["charlist_name"])
                                .where({
                                    schema_id: currentUser.server_info.schema_id
                                })
                                .then(function(rows) {
                                    var charlist_name = rows[0].charlist_name;
                                    currentUser.server_info.charlist_name = charlist_name;
                                    userToRedis(currentUser, 30000, function(data, err) {});
                                    res.send({error: false, data: {
                                        schema : charlist_name,
                                        char : currentUser.char_info.charlist
                                    }}).end();
                                }, function(error) {
                                    res.send({error: true, message: 'db error schemas'}).end();
                                });
                        }
                        else {
                            userToRedis(currentUser, 30000, function(data) {});
                            res.send({error: false, data: rows[0]}).end();
                        }
                    }, function(error) {
                        res.send({error: true, message: 'db error charlists'}).end();
                    });
            }
            else {
                res.send({error: true, message: 'No active server.'}).end();
            }
        }
        else {
            res.send({error: true, message: 'Authorization token required', error_code: 'auth_1'}).end();
        }
    });



	app.get('/', function (req, res) {
		res.render('./index', {title: 'TableTap App'});
	});

	app.get('/files/*', function (req, res) {
		res.sendFile(req.params[0], {root: __dirname + "/view"});
	});

	return app;
};


