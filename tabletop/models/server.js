module.exports = function(app, knex) {

    return {
        regRoutes: function () {
            var _this = this;

            appRoute(app, 'getServerInfo', function (req, res, currentUser) {
                _this.getServerInfo(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        getServerInfo: function (req, currentUser, callback) {
            knex('servers').select(["users"])
                .where({server_id: req.body.server_id})
                .then(function(rows) {
                    var userIDs = rows[0].users.split(",");
                    knex('users').select(["user_id","username", "type"]).whereIn("user_id", userIDs)
                        .then(function(rows) {
                            var users = rows;
                            callback({
                                master : _.filter(users, function(user) {return user.type != 'player'})[0],
                                users : _.filter(users, function(user) {return user.type == 'player'})
                            });
                        }, function(error) {
                            callback({error: true, message: 'db error server'});
                        });
                }, function(error) {
                    callback({error: true, message: 'db error server'});
                })
        }
    }
};