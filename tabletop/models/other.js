/**
 * Created by Mark Sarukhanov on 21.11.2016.
 */

module.exports = function(app, knex){
    return {
        regRoutes: function () {
            var _this = this;

            BetOfficeRoute(app, 'financeInput', function(req,res,currentUser) {
                _this.financeIO(req, currentUser, 1, function (callback) {
                    res.send(callback).end();
                });
            });

            BetOfficeRoute(app, 'financeOutput', function(req,res,currentUser) {
                _this.financeIO(req, currentUser, 100, function (callback) {
                    res.send(callback).end();
                });
            });

            BetOfficeRoute(app, 'getDownloads', function(req,res,currentUser) {
                _this.getDownloads(req, currentUser.user_type == 'ADMIN', currentUser.user_country, function (callback) {
                    res.send(callback).end();
                });
            });
            
        },

        financeIO: function (req, user, type, callback) {

            var response = {
                success: true,
                amount: req.body.amount,
                description: req.body.description
            };
            if (!req.body.amount) {
                callback({error: true, message: 'Amount not provided', data: []});
            }
            else {
                var tempAmount = req.body.type < 100 ? req.body.amount : (-1) * req.body.amount;
                var userID = user.user_id;
                if (user.user_type == 'COUNTRY_MANAGER' && req.body.shop_id) userID = req.body.shop_id;
                knex.raw('CALL `betoffice`.FinanceIO(' + userID + ',' + req.body.type + ',' + tempAmount + ',\'' + req.body.description + '\')')
                    .then(function (result) {
                        if (result)
                            callback(response, result);
                    }, function (error) {
                        console.error(error);
                        callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                    });
            }

        },

        getDownloads: function (req, isAdmin, country, callback) {
            if (isAdmin) {
                knex('z_downloads').select('*')
                    .then(function (rows) {
                        if (_.isEmpty(rows)) {
                            callback({error: false, message: 'Success', type: 'all', data: {}});
                        }
                        else {
                            _.each(rows, function (item, k) {
                                if(item.country != "DR CONGO II" && item.country != "NIGERIA" ) {
                                    rows[k].url = 'http://prod.betunit.com/deploy/sportpdf' + item.url;
                                }
                            });
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
            }
            else {
                if(country == "DR CONGO II" || country == "NIGERIA") {
                    knex('z_downloads_pdf')
                        .select('*')
                        .where({country: country})
                        .then(function (rows) {
                            if (_.isEmpty(rows)) {
                                callback({error: false, message: 'Success', type: 'all', data: {}});
                            }
                            else {
                                _.each(rows, function (item, k) {
                                    rows[k].url = item.url;
                                });
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
                }
                else {
                    knex('z_downloads')
                        .select('*')
                        .where({country: country})
                        .then(function (rows) {
                            if (_.isEmpty(rows)) {
                                callback({error: false, message: 'Success', type: 'all', data: {}});
                            }
                            else {
                                _.each(rows, function (item, k) {
                                    rows[k].url = 'http://prod.betunit.com/deploy/sportpdf' + item.url;
                                });
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
                }

            }
        }

    }
};