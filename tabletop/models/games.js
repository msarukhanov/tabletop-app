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

            BetOfficeRoute(app, 'getPickFiveJackpot', function(req,res,currentUser) {
                _this.getPickFiveJackpot(req, function (callback) {
                    res.send(callback).end();
                });
            });

            BetOfficeRoute(app, 'getGameCurrentDraw', function(req,res,currentUser) {
                _this.getGameCurrentDraw(req, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        getGameDraw: function (req, callback) {
            var tbl_name;
            var limit = req.body.limit != undefined ? parseInt(req.body.limit) : 5;
            var offset = req.body.offset != undefined ? parseInt(req.body.offset) : 0;
            var sort_type = req.body.sort_type != undefined ? req.body.sort_type : 'desc';
            var sort_by = req.body.sort_by != undefined ? req.body.sort_by : 'dt';
            switch (req.body.bet_type) {
                case 'keno':
                    tbl_name = 's_draws_keno';
                    break;
                case 'kaboom':
                    tbl_name = 's_draws_kaboom';
                    break;
                case 'five':
                    tbl_name = 's_draws_five';
                    break;
                case 'horses':
                    tbl_name = 's_races_horse';
                    break;
                case 'dogs':
                    tbl_name = 's_races_dogs';
                    break;
                case 'wof':
                    tbl_name = 's_draws_wof';
                    break;
            }
            knex(tbl_name).select('*')
                .whereNot({rdt: '0000-00-00 00:00:00'}).limit(limit).offset(offset).orderBy(sort_by, sort_type)
                .then(function (rows) {
                    if (_.isEmpty(rows)) {
                        callback({
                            error: false,
                            message: 'Success',
                            type: 'all',
                            data: []
                        });
                    }
                    else {
                        callback({
                            error: false,
                            message: 'success',
                            data: rows
                        });
                    }
                }, function (error) {
                    console.error(error);
                    callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });
        },

        getPickFiveJackpot: function (req, callback) {
            var tbl_name;
            var limit = req.body.limit != undefined ? parseInt(req.body.limit) : 1;
            var offset = req.body.offset != undefined ? parseInt(req.body.offset) : 0;
            var con_name = 'five_jp_amount';
            switch (req.body.bet_type) {
                case 'five':
                    tbl_name = 's_config';
                    break;
            }
            knex(tbl_name).select('*').where({config_name: con_name}).limit(limit).offset(offset)
                .then(function (rows) {
                    if (_.isEmpty(rows)) {
                        callback({
                            error: false,
                            message: 'Success',
                            type: 'all',
                            data: {}
                        });
                    }
                    else {
                        callback({
                            error: false,
                            message: 'success',
                            data: rows[0]
                        });
                    }
                }, function (error) {
                    console.error(error);
                    callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });
        },

        getGameCurrentDraw: function (req, callback) {
            var tbl_name;
            var limit = req.body.limit != undefined ? parseInt(req.body.limit) : 1;
            var offset = req.body.offset != undefined ? parseInt(req.body.offset) : 0;
            var sort_type = req.body.sort_type != undefined ? req.body.sort_type : 'asc';
            var sort_by = req.body.sort_by != undefined ? req.body.sort_by : 'dt';
            switch (req.body.bet_type) {
                case 'keno':
                    tbl_name = 's_draws_keno';
                    break;
                case 'kaboom':
                    tbl_name = 's_draws_kaboom';
                    break;
                case 'five':
                    tbl_name = 's_draws_five';
                    break;
                case 'horses':
                    tbl_name = 's_races_horse';
                    break;
                case 'dogs':
                    tbl_name = 's_races_dogs';
                    break;
                case 'wof':
                    tbl_name = 's_draws_wof';
                    break;
            }
            knex(tbl_name).select('*')
                .where({rdt: '0000-00-00 00:00:00'}).limit(limit).offset(offset).orderBy(sort_by, sort_type)
                .then(function (rows) {
                    if (_.isEmpty(rows)) {
                        callback({
                            error: false,
                            message: 'Success',
                            type: 'all',
                            data: {}
                        });
                    }
                    else {
                        rows[0].currentTime = Date.now();
                        rows[0].timeDelta = rows[0].dt.getTime() - rows[0].currentTime;
                        callback({
                            error: false,
                            message: 'success',
                            data: rows[0]
                        });
                    }
                }, function (error) {
                    console.error(error);
                    callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });
        }

    }
};