/**
 * Created by Mark Sarukhanov on 22.11.2016.
 */

module.exports = function(app, knex){
    return {
        regRoutes: function () {
            var _this = this;

            BetOfficeRoute(app, 'getGameDraw', function(req,res,currentUser) {
                _this.getGameDraw(req, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        getGameDraw: function (req, callback) {

        }

    }
};