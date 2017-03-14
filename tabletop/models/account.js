/**
 * Created by Mark Sarukhanov on 21.11.2016.
 */

module.exports = function(app, knex, moment){
    return {
        regRoutes: function () {
            var _this = this;

            app.post('/api/signIn', function (req, res) {
                if (req.headers.authorization == undefined) {
                    _this.signIn(req, function (callback) {
                        res.send(callback).end();
                    });
                }
                else {
                    res.send({error: true, message: 'Already logged in.', error_code: 'auth_1'}).end();
                }
            });

            appRoute(app, 'accountInfo', function(req,res,currentUser) {
                _this.accountInfo(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        signIn: function (req, callback) {
            knex('users').select('*')
                .where({
                    username: req.body.username,
                    password: req.body.password
                })
                .then(function (rows) {
                    if (_.isEmpty(rows)) {
                        callback({error: true, message: 'Email or Password is Wrong', data: null})
                    }
                    else {
                        var timestamp = (moment().unix()*1000+moment().millisecond());
                        var uniqueID = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 6; i++) uniqueID += possible.charAt(Math.floor(Math.random() * possible.length));
                        rows[0].user_token = uniqueID+'T'+rows[0].user_id+'T'+timestamp;
                        userToRedis(rows[0], 30000, function(data) { callback(data) });
                        knex('users').update({login_at : new Date()}).where({username: req.body.username}).then(function(a){}, function(e){})
                    }
                }, function (error) {
                    callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });
        },

        accountInfo: function (req, currentUser, callback) {
            if(currentUser) {
                currentUser = _.omit(currentUser, ["password","joined_at","login_at"]);
                if(currentUser.server_id && !currentUser.server_info) {
                    getServer(currentUser, function(server) {
                        currentUser.server_info = server;
                        if(currentUser.type == 'player') {
                            if(!currentUser.char_info) {
                                getCharacter(currentUser, function(player_char) {
                                    currentUser.char_info = player_char;
                                    userToRedis(currentUser, 30000, function(data) {
                                        callback({error: false, data: currentUser});
                                    });
                                }, function(error) {
                                    callback({error: true, message: 'db error chars'});
                                });
                            }
                            else {
                                callback({error: false, data: currentUser});
                            }
                        }
                        else {
                            currentUser.server_info.users = currentUser.server_info.users.split(",");
                            userToRedis(currentUser, 30000, function(data) {});
                            callback({error: false, data: currentUser});
                        }
                    }, function(error) {
                        callback({error: true, message: 'db error servers'});
                    });
                }
                else {
                    callback({error: false, data: currentUser});
                }
            }
            else {
                callback({error: true, message: 'Authorization token required', error_code: 'auth_1'});
            }
        }

    }
};