/**
 * Created by Mark Sarukhanov on 22.11.2016.
 */
var healthWatcher = require('../services/healthWatcher')();

module.exports = function(app, knex, wait, moment, PlaceBet, GameBet, PayBet){

    return {
        regRoutes: function () {
            var _this = this;

            BetOfficeRoute(app, 'placeBet', function processor(req,res,currentUser) {
                var rstart = moment();
                _this.placeBet(req, req.body.bet, currentUser, function httpSender(callback) {
                    var diff = moment().diff(rstart, 'milliseconds');
                    console.log('placeBet time:', diff);
                    res.send(callback);
                    res.end();
                    setTimeout(function(){
                        healthWatcher.check(diff);
                    },2000);
                });
            });

            BetOfficeRoute(app, 'placeGameBet', function processor(req,res,currentUser) {
                req.headers['arrived'] = new Date();
                var currentHour = (new Date()).getHours();
                var currentMinute = (new Date()).getMinutes();

                var out_of_service = false;
                if( (currentHour > 2 && currentHour < 8) || (currentHour == 0 && currentMinute > 15) || (currentHour == 8 && currentMinute < 45) ) {
                    out_of_service = true;
                }

                if(1 == currentUser.user_id)
                    out_of_service = false;


                if(!out_of_service) {
                    try {
                        _this.placeGameBet(req, req.body.bet, currentUser, function httpSender(callback) {
                            res.send(callback);
                            res.end();
                        });
                    } catch (exception) {
                        //res.send({success: false, err: exception.message});
                        //res.end();
                    }
                }
                else {
                    var response = {
                        success: true,
                        message: 'Terminal is temporarily out of service.',
                        bet: {
                            betLines : [],
                            validation : {
                                errors: [{
                                    error : 'Terminal is temporarily out of service.'
                                }],
                                hasErrors: true
                            }
                        }
                    };
                    res.send(response);
                    res.end();
                }
            });

            BetOfficeRoute(app, 'payOut', function(req,res,currentUser) {
                try {
                    _this.payOut(req, currentUser, function (callback) {
                        res.send(callback).end();
                    });
                } catch (ex) {
                    res.send({success: false, err: ex.message});
                    res.end();
                }
            });

            BetOfficeRoute(app, 'cashOut', function(req,res,currentUser) {
                _this.cashOut(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        placeBet: function (req, bet, user_info, callback) {
            wait.launchFiber(function fiberProcessor() {
                var placeBetService = PlaceBet.start();

                var response = {
                    success: true,
                    bet: bet
                };

                bet.user_id = user_info.user_id;

                var isValid = placeBetService.validateBet(bet, user_info.user_type, user_info);

                if (isValid) {
                    placeBetService.placeBet(req, bet, user_info);
                    response.bet = _.pick(response.bet, function (value, key, object) {
                        return _.isObject(value);
                    });
                    var amount = bet.betType == 'multi' ? bet.multiStake : bet.totalAmount;
                    placeBetService.updateLimit(bet.user_id, amount);
                    placeBetService.updateTerminalIncome(bet.user_id, amount);
                    placeBetService.updateTerminalRevenue(bet.user_id, user_info.user_country);
                    _.each(response.bet.betSlips, function (betSlipTemp, i) {
                        response.bet.betSlips[i] = _.pick(betSlipTemp, ['dt', 'expiration_date', 'market_name', 'price_name', 'package_id', 'package_sum', 'prm1', 'tax_percent', 'total_rate', 'bonus', 'bonus_percent', 'bonus_type', 'type', 'val', 'is_header']);
                    });
                }

                callback(response);

            });
        },

        placeGameBet: function (req, bet, user_info, callback) {
            wait.launchFiber(function fiberProcessor() {

                var gameBetService = GameBet.start();

                var response = {
                    success: true,
                    message: '',
                    bet: bet
                };
                bet.user_id = user_info.user_id;

                var isValid = gameBetService.validateBet(req, bet, user_info.user_type, user_info);

                if (isValid) {
                    if (gameBetService.placeBet(req, bet, user_info)) {
                        response.bet = _.pick(response.bet, function (value, key, object) {
                            return _.isObject(value);
                        });
                        gameBetService.updateLimit(bet.user_id, bet.betTotalSum);
                        gameBetService.updateTerminalIncome(bet.user_id, bet.betTotalSum);
                        gameBetService.updateTerminalRevenue(bet.user_id);
                    }
                    else {
                        response.bet.validation.hasErrors = true;
                        response.bet.validation.errors.push({error: 'Ticket save error, please try again..'});
                    }
                }
                callback(response);
            });
        },

        payOut: function (req, userInfo, callback) {
            var userId = userInfo.user_id, type = userInfo.user_type, response = {
                success: true,
                packageId: req.body.packageId,
                userId: userId
            };
            if (type == 'FRANCHISE') response.kassa_id = userInfo.kassa_id;
            if (!req.body.packageId) {
                callback({error: false, message: 'success', data: null});
            }
            else {
                var splited = req.body.packageId.split("-"), isSibling, isValid = true;
                if (!userInfo.siblings || userInfo.siblings.length < 2) {
                    if (splited[0] != userInfo.user_id) isValid = false;

                    // Nigeria 1 hack
                    if (splited[0] == '6137' && userInfo.user_id == 2001)
                        isValid = true;
                }
                else {
                    isSibling = _.find(userInfo.siblings, function (sibling) {
                        if (splited[0] == '6137')
                            return true;
                        return sibling.user_id == splited[0];
                    });
                    if (!isSibling) isValid = false;
                }
                if (splited.length > 1 && !isValid && userInfo.user_type != "ADMIN") {
                    callback({error: true, message: 'Pay out not available', data: []});
                }
                else {
                    wait.launchFiber(function () {
                        var payBetService = PayBet.start();

                        payBetService.payOut(response, type);

                        callback({error: false, message: 'success', data: response});

                    });
                }
            }
        },

        cashOut: function (req, userInfo, callback) {
            var userId = userInfo.user_id, type = userInfo.user_type, response = {
                success: true,
                packageId: req.body.packageId,
                userId: userId
            };
            if (type == 'FRANCHISE') response.kassa_id = userInfo.kassa_id;
            if (!req.body.packageId) {
                callback({error: false, message: 'success', data: null});
            }
            else {
                var splited = req.body.packageId.split("-"), isSibling, isValid = true;
                if (!userInfo.siblings || userInfo.siblings.length < 2) {
                    if (splited[0] != userInfo.user_id) isValid = false;

                    // Nigeria 1 hack
                    if (splited[0] == '6137' && userInfo.user_id == 2001)
                        isValid = true;
                }
                else {
                    isSibling = _.find(userInfo.siblings, function (sibling) {
                        if (splited[0] == '6137')
                            return true;
                        return sibling.user_id == splited[0];
                    });
                    if (!isSibling) isValid = false;
                }
                if (splited.length > 1 && !isValid && userInfo.user_type != "ADMIN") {
                    callback({error: true, message: 'Cash out not available', data: []});
                }
                else {
                    wait.launchFiber(function () {
                        var payBetService = PayBet.start();

                        var cashOutResult = payBetService.cashOut(response, type, userInfo.user_country);

                        callback({error: cashOutResult.validation.hasErrors, message: 'success', data: response});

                    });
                }
            }
        }

    }
};