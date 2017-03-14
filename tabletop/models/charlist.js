/**
 * Created by Mark Sarukhanov on 22.11.2016.
 */

module.exports = function(app, knex, wait, moment, redisRequests, Prematch){

    return {
        regRoutes: function () {
            var _this = this;

            appRoute(app, 'getCharacterList', function(req,res,currentUser) {
                _this.getCharacterList(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            appRoute(app, 'getCharactersList', function(req,res,currentUser) {
                _this.getCharactersList(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            appRoute(app, 'saveCharacterList', function(req, res, currentUser) {
                _this.saveCharacterList(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        getCharacterList: function (req, currentUser, callback) {
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
                                        callback({error: false, data: {
                                            schema : charlist_name,
                                            char : currentUser.char_info.charlist
                                        }});
                                    }, function(error) {
                                        callback({error: true, message: 'db error schemas'});
                                    });
                            }
                            else {
                                userToRedis(currentUser, 30000, function(data) {});
                                callback({error: false, data: rows[0]});
                            }
                        }, function(error) {
                            callback({error: true, message: 'db error charlists'});
                        });
                }
                else {
                    callback({error: true, message: 'No active server.'});
                }
            }
            else {
                callback({error: true, message: 'Authorization token required', error_code: 'auth_1'});
            }
        },

        getCharactersList: function (req, currentUser, callback) {
            if(currentUser) {
                if(currentUser.server_id) {
                    knex('chars').select(["chars.id","chars.charlist_id","charlists.list"])
                        .leftJoin('charlists', 'chars.charlist_id', 'charlists.id')
                        .whereIn('user_id', req.body.users)
                        .then(function(rows) {
                            var chars = rows;
                            if(!currentUser.server_info.charlist_name) {
                                knex('schemas').select(["charlist_name"])
                                    .where({
                                        schema_id: currentUser.server_info.schema_id
                                    })
                                    .then(function(rows) {
                                        var charlist_name = rows[0].charlist_name;
                                        currentUser.server_info.charlist_name = charlist_name;
                                        userToRedis(currentUser, 30000, function(data, err) {});
                                        callback({error: false, data: {schema : charlist_name, chars : chars}});
                                    }, function(error) {
                                        callback({error: true, message: 'db error schemas'});
                                    });
                            }
                            else {
                                userToRedis(currentUser, 30000, function(data) {});
                                callback({error: false, data: rows});
                            }
                        }, function(error) {
                            console.log(error);
                            callback({error: true, message: 'db error charlists'});
                        });
                }
                else {
                    callback({error: true, message: 'No active server.'});
                }
            }
            else {
                callback({error: true, message: 'Authorization token required', error_code: 'auth_1'});
            }
        },

        saveCharacterList: function (req, currentUser, callback) {
            if(currentUser) {
                if(currentUser.server_id) {
                    knex('charlists').returning('id').insert({
                        list: JSON.stringify(req.body.newChar),
                        schema_id: currentUser.server_info.schema_id,
                        updated_at: new Date(),
                        created_at: new Date()
                    }).then(function (rows) {
                        var charlist_id = rows[0];
                        knex('chars').returning('id').insert({
                            char_name: req.body.newChar.main.Name,
                            user_id: currentUser.user_id,
                            charlist_id: charlist_id,
                            server_id: currentUser.server_info.server_id,
                            created_at: new Date()
                        }).then(function (rows) {
                            var char_id = rows[0];
                            knex('charlists').update({
                                char_id: char_id
                            }).where({
                                id: charlist_id
                            }).then(function (rows) {
                                currentUser.char_info = {
                                    charlist: {
                                        id: charlist_id,
                                        list: req.body.newChar,
                                        schema_id: currentUser.server_info.schema_id
                                    },
                                    char_name: req.body.newChar.main.Name
                                };
                                userToRedis(currentUser, 30000, function (data) {});
                                callback({error:false, message: "Success"})
                            }, function (error) {
                                console.error(error);
                                callback({error: true, message: 'db error chars'});
                            });
                        }, function (error) {
                            console.error(error);
                            callback({error: true, message: 'db error chars'});
                        });
                    }, function (error) {
                        console.error(error);
                        callback({error: true, message: 'db error charlists'});
                    });
                }
                else {
                    callback({error: true, message: 'No active server.'});
                }
            }
            else {
                callback({error: true, message: 'Authorization token required', error_code: 'auth_1'});
            }
        }
    }
};