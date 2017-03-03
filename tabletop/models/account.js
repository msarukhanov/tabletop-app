/**
 * Created by Mark Sarukhanov on 21.11.2016.
 */

module.exports = function(app, knex, md5, crypto, generators){
    return {
        regRoutes: function () {
            var _this = this;
            
            app.post('/office/signin', function (req, res) {
                if (req.headers.authorization == undefined) {
                    try {
                        _this.signIn(req, res, function (callback) {
                            res.send(callback).end();
                        });
                    } catch (ex) {
                        console.error(ex);
                        res.send({success: false, err: ex.message}).end();
                    }
                }
                else {
                    res.send({error:true, message:'Already logged in.', error_code:'auth_1'}).end();
                }
            });

            app.post('/office/getUserCountry', function(req, res) {
                res.send({country : 'Tanzania'}).end();
            });

            BetOfficeRoute(app, 'getConfig', function(req,res,currentUser) {
                _this.getConfig(req, res, {country : currentUser.user_country, currency : currentUser.user_currency}, function (callback) {
                    res.send(callback).end();
                });
            });
            
            BetOfficeRoute(app, 'accountinfo', function(req,res,currentUser) {
                currentUser.read_only = currentUser.user_type == 'ADMIN_RDNLY' || currentUser.user_type == 'FRANCHISE_OWNER' ||
                    currentUser.user_type == 'REGION_MANAGER' || currentUser.user_type == 'FRANCHISE_MANAGER' ||
                    currentUser.user_type == 'COUNTRY_MANAGER' || currentUser.user_type ==  "TERMINAL_MANAGER" ||
                    currentUser.user_type ==  "FIELD-TERMINAL-MANAGER" || currentUser.user_type ==  "SLOT_MANAGER";
                if(currentUser.user_type == 'REGION_MANAGER') currentUser.region_manager = true;
                currentUser.allow_use_settings = currentUser.user_level == 1;
                res.send(_.pick(currentUser, 'user_token', 'username', 'agent_timezone', 'allow_use_settings',
                    'user_level', 'user_type', 'read_only', 'region_manager', 'user_country', 'user_language', 'employee_info'));
                res.end();
            });

            BetOfficeRoute(app, 'getBalanceLimit', function(req,res,currentUser) {
                _this.getBalanceLimit(req, res, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });
            
        },

        signIn: function (req, res, callback) {
            knex('s_users').select('*')
                .where({
                    username: req.body.username,
                    user_password: md5(req.body.password)
                })
                .then(function (rows) {
                    if (_.isEmpty(rows)) {
                        callback({error: true, message: 'Email or Password is Wrong', data: null})
                    }
                    else {
                        rows[0].user_token = generators.tokenGenerator(rows[0].user_id);
                        var cookieExpireTime = 30000; // seconds
                        if (rows[0].kassa_id > 0) {
                            var siblingQuery = "SELECT user_id FROM `betoffice`.s_users WHERE kassa_id=" + rows[0].kassa_id + " OR (kassa_id BETWEEN " + (rows[0].kassa_id*1000) + " AND " + ((rows[0].kassa_id +1)*1000 -1) + " )";
                            siblingQuery += (rows[0].area_id > 0 ? " OR area_id=" + rows[0].area_id : "");
                            knex.raw(siblingQuery)
                                .then(function (siblings) {
                                    rows[0].siblings = (siblings && !_.isEmpty(siblings[0])) ? siblings[0] : [];
                                    userToRedis(rows[0], cookieExpireTime, callback);
                                }, function (error) {
                                    console.error(error);
                                    callback({
                                        error: true,
                                        message: 'Database error' + error.toString().split("at")[0],
                                        data: null
                                    })
                                });
                        }
                        else {
                            userToRedis(rows[0], cookieExpireTime, callback)
                        }
                    }
                }, function (error) {
                    console.error(error);
                    callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });
        },

        getBalanceLimit: function (req, res, user_info, callback) {
            knex('s_acc_days').select('e_summa').where({user_id: user_info.user_id}).orderBy('dt', 'desc').limit(1)
                .then(function (rows) {
                    var data = {
                        balance: rows[0] && rows[0].e_summa ? rows[0].e_summa : 0,
                        limit: '∞'
                    };
                    switch (user_info.user_type) {
                        case 'TERMINAL_MANAGER' :
                        case 'FIELD-TERMINAL-MANAGER' :
                            knex('s_users').select('terminal_limit')
                                .where({user_id: user_info.user_id})
                                .then(function (rows) {
                                    if (rows[0]) {
                                        data.limit = rows[0].terminal_limit;
                                    }
                                    else data.limit = 0;
                                    callback({error: false, message: 'Success', data: data});
                                }, function (error) {
                                    console.error(error);
                                    callback({
                                        error: true,
                                        message: 'Database error' + error.toString().split("at")[0],
                                        data: null
                                    })
                                });
                            break;
                        case 'TERMINAL' :
                            knex('s_users').select('terminal_limit', 'terminal_revenue')
                                .where({user_id: user_info.user_id})
                                .then(function (rows) {
                                    if (rows[0]) {
                                        data.limit = rows[0].terminal_limit;
                                        data.revenue = rows[0].terminal_revenue;
                                    }
                                    else data.limit = 0;
                                    callback({error: false, message: 'Success', data: data});
                                }, function (error) {
                                    console.error(error);
                                    callback({
                                        error: true,
                                        message: 'Database error' + error.toString().split("at")[0],
                                        data: null
                                    })
                                });
                            break;
                        case 'SHOP' :
                        case 'FRANCHISE' :
                        default:
                            knex('s_cashbox').select('amount_limit')
                                .where({id: user_info.kassa_id}).limit(1)
                                .then(function (rows) {
                                    if (rows[0]) data.limit = rows[0].amount_limit;
                                    else data.limit = 0;
                                    if (user_info.employee_info) {
                                        knex('s_employees').select('points')
                                            .where({id: user_info.employee_info.id}).limit(1)
                                            .then(function (rows) {
                                                data.points = rows[0].points;
                                                callback({error: false, message: 'Success', data: data});
                                            }, function (error) {
                                                console.error(error);
                                                callback({
                                                    error: true,
                                                    message: 'Database error' + error.toString().split("at")[0],
                                                    data: null
                                                })
                                            });
                                    }
                                    else {
                                        callback({error: false, message: 'Success', data: data});
                                    }
                                }, function (error) {
                                    console.error(error);
                                    callback({
                                        error: true,
                                        message: 'Database error' + error.toString().split("at")[0],
                                        data: null
                                    })
                                });
                            break;
                    }
                }, function (error) {
                    console.error(error);
                    callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                })
        },

        getConfig: function (req, res, formData, callback) {
            knex('global_settings')
                .select('*')
                .then(function (rows) {
                    if (_.isEmpty(rows)) {
                        callback({error: true, message: 'Database error', data: null})
                    }
                    else {
                        var globalSettings = _.groupBy(rows, function (setting) {
                            return setting.setting_name
                        });
                        globalSettings = _.each(globalSettings, function (setting, key) {
                            globalSettings[key] = setting[0].setting_value;
                        });
                        var response = {
                            error: false,
                            settings: {
                                ExchangeRate: Number(globalSettings['ExchangeRate.' + formData.currency]),
                                Tax: Number(globalSettings['Tax.' + formData.country]),
                                BonusType: Number(globalSettings['BonusType.' + formData.country]),
                                GameBonusType: Number(globalSettings['GameBonusType.' + formData.country]),
                                MinAmount: Number(globalSettings['MinStakeAmount.' + formData.country]),
                                MaxAmount: Number(globalSettings['MaxStakeAmount.' + formData.country]),
                                MaxWinSum: Number(globalSettings['MaxWinSum.' + formData.country]),
                                AllowOrdinars: Number(globalSettings['AllowOrdinars.' + formData.country])
                            }
                        };
                        callback({error: false, message: 'Database error', data: response});
                    }
                }, function (error) {
                    console.error(error);
                    callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });
        }

    }
};