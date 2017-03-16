/**
 * Created by xgharibyan on 4/3/15.
 */
var md5 = require('MD5');
var latestData = require('moment-timezone/data/packed/latest.json');
var moment   = require('moment');
var moment_timezone = require('moment-timezone');
moment_timezone.tz.load(latestData);

var http = require('http');
var knex = require('knex')({
    client: 'pg',
    connection: 'postgres://gxlwcegldechzz:073cc0afaa097f77f818c89d3d3e9d1a2309ba743977e63a78c86bb5662b9afc@ec2-54-225-230-243.compute-1.amazonaws.com:5432/d12ief33mdff9t?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
});

var redisRequests = require('./redisRequests');

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

global.getServer = function(currentUser, cb_success, cb_error) {
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
};
global.getCharacter = function(currentUser, cb_success, cb_error) {
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
};

module.exports = function (app) {

    var Account = require('./models/account')(app, knex, moment);
    Account.regRoutes();

    var CharList = require('./models/charlist')(app, knex);
    CharList.regRoutes();

    var Bio = require('./models/bio')(app, knex);
    Bio.regRoutes();

    var Server = require('./models/server')(app, knex);
    Server.regRoutes();

	app.get('/', function (req, res) {
        process.env.PORT ? res.render('./index', {title: 'TableTapp'}) : res.render('./index_dev', {title: 'TableTapp'});
	});

	app.get('/files/*', function (req, res) {
		res.sendFile(req.params[0], {root: __dirname + "/view"});
	});

	return app;
};


