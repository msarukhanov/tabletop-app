/**
 * Created by Mark Sarukhanov on 22.11.2016.
 */

module.exports = function(app, knex, wait, moment, redisRequests, PayBet){
    
    return {
        regRoutes: function () {
            var _this = this;

            appRoute(app, 'getCharacterBio', function(req,res,currentUser) {
                _this.getCharacterBio(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            appRoute(app, 'updateCharacterBio', function(req,res,currentUser) {
                _this.updateCharacterBio(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            appRoute(app, 'saveCharacterBio', function(req,res,currentUser) {
                _this.saveCharacterBio(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        getCharacterBio: function (req, currentUser, callback) {
            if(currentUser) {
                if(currentUser.server_id) {
                    knex('bios').select(["bio"])
                        .where({
                            char_id : req.body.char_id
                        })
                        .then(function(rows) {
                            var bio = rows[0].bio;
                            callback({error: false, data: bio});
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

        updateCharacterBio: function (req, currentUser, callback) {
            if(currentUser) {
                if(currentUser.server_id) {
                    knex('bios')
                        .update({
                            bio : JSON.stringify(req.body.bio),
                            updated_at : new Date()
                        })
                        .where({
                            char_id : req.body.char_id
                        })
                        .then(function(rows) {
                            callback({error: false, message: 'ok'});
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

        saveCharacterBio: function (req, currentUser, callback) {
            if(currentUser) {
                if(currentUser.server_id) {
                    knex('bios').returning("id")
                        .insert({
                            char_id : req.body.char_id,
                            bio : JSON.stringify(req.body.bio),
                            created_at : new Date(),
                            updated_at : new Date()
                        })
                        .then(function(rows) {
                            callback({error: false, message: 'ok'});
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
        }

    }
};