/**
 * Created by Mark Sarukhanov on 22.11.2016.
 */

module.exports = function(app, knex, wait, moment, redisRequests, PayBet){
    
    return {
        regRoutes: function () {
            var _this = this;

            BetOfficeRoute(app, 'setBetSession', function(req,res,currentUser) {
                redisRequests.SetterEx(currentUser.user_id + '_' + 'bet_sport', 30000, req.body.bet, function (betInfo) {
                    if (betInfo.error != true) {
                        res.send(betInfo.data).end();
                    }
                })
            });

            BetOfficeRoute(app, 'getBetSession', function(req,res,currentUser) {
                redisRequests.Getter(currentUser.user_id + '_' + 'bet_sport', function (betInfo) {
                    if (betInfo.error != true) {
                        if(betInfo.data == null) {
                            betInfo.data = {
                                betSlips: [],
                                betType: 'multi',
                                totalBets: 0,
                                multiStake: null,
                                totalMultiStake: null,
                                totalStake: 0,
                                checkRateChanges: true,
                                validation : {
                                    errors: [],
                                    hasErrors: false
                                }
                            };
                        }
                        res.send(betInfo.data).end();
                    }
                })
            });

            BetOfficeRoute(app, 'checkFreeBet', function(req,res,currentUser) {
                _this.checkFreeBet(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            BetOfficeRoute(app, 'checkPayoutCode', function(req,res,currentUser) {
                _this.checkPayoutCode(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            BetOfficeRoute(app, 'getBetPrintInfo', function(req,res,currentUser) {
                var formData = {
                    country : currentUser.user_country,
                    currency : currentUser.user_currency,
                    address: currentUser.user_address
                };
                if(currentUser.employee_info) {
                    formData.employee_name = currentUser.employee_info.first_name + ' ' + currentUser.employee_info.last_name;
                }
                _this.getConfig(req, res, formData, function (globalSettings) {
                    var configs = globalSettings.data.settings;
                    var amount = 0, maxWinningBonus;
                    function calculatePossibles(package_info, amount) {
                        package_info.total_winning = amount > configs.MaxWinSum ? configs.MaxWinSum : amount;
                        package_info.possible_bonus = 0;
                        if(package_info.bonus_type == 1 || package_info.bonus_type == 4) {
                            package_info.possible_bonus = package_info.total_winning*package_info.bonus_percent/100;
                        }
                        else if(package_info.bonus_type == 2) {
                            package_info.possible_bonus =
                                ((100 * package_info.total_winning - package_info.tax_percent * package_info.package_sum) /
                                (100 - package_info.tax_percent)) - package_info.total_winning;
                        }
                        var revenue = package_info.total_winning + package_info.possible_bonus - package_info.package_sum;
                        package_info.possible_tax = revenue * package_info.tax_percent / 100;
                        package_info.possible_wining = package_info.total_winning + package_info.possible_bonus - package_info.possible_tax;
                        package_info.possible_wining = package_info.possible_wining < configs.MaxWinSum ? package_info.possible_wining : configs.MaxWinSum;
                        //if('NIGERIA' == formData.country)
                        //{
                        package_info.user_address = formData.address || '';
                        package_info.employee_name = formData.employee_name || '';
                        //}
                        return package_info;
                    }
                    function addMotoCup(package_info){

                    }
                    function itContains(text, peace) {
                        return (text.toLowerCase().indexOf(peace) > -1);
                    }
                    function getBetTypeFromPackageId(packageId) {
                        var playType;
                        if (itContains(packageId, 'kb')) {
                            playType = 'kaboom';
                        } else if (itContains(packageId, 'f')) {
                            playType = 'five';
                        } else if (itContains(packageId, 'k')) {
                            playType = 'keno';
                        } else if (itContains(packageId, 'd')) {
                            playType = 'dogs';
                        } else if (itContains(packageId, 'h')) {
                            playType = 'horses';
                        } else if (itContains(packageId, 's')) {
                            playType = 'sport';
                        } else if (itContains(packageId, 'w')) {
                            playType = 'wof';
                        }
                        return playType;
                    }
                    _this.getBetByPackageId(req, currentUser, function (callback) {
                        if(callback.betDetails) {
                            if(callback.betDetails[0]) {
                                callback.package_info = _.pick(callback.betDetails[0], [
                                    'bonus', 'bonus_type', 'bonus_percent', 'dt', 'expiration_date', 'package_id', 'package_sum', 'dtUTC', 'expiration_dateUTC',
                                    'paid_sum', 'payout_sum', 'ststatus', 'super_bonus', 'tax_percent', 'type', 'user_id', 'wsum', 'country', 'currency', 'vcode', 'vcode_untill'
                                ]);
                                if (!callback.package_info.tax_percent) callback.package_info.tax_percent = 0;
                                if (!callback.package_info.bonus) callback.package_info.bonus = 0;
                                callback.package_info.paid = callback.betDetails[0].vyd;
                                callback.package_info.paid_date = callback.betDetails[0].vdt;
                            }
                            switch (getBetTypeFromPackageId(callback.package_info.package_id)) {
                                case 'sport':
                                    if(callback.betDetails[0]) {
                                        callback.package_info = _.pick(callback.betDetails[0],[
                                            'bonus','bonus_type','bonus_percent','dt','expiration_date','package_id', 'package_sum',
                                            'paid_sum', 'payout_sum', 'ststatus', 'super_bonus', 'tax_percent', 'type', 'user_id', 'wsum',
                                            'country', 'currency', 'dtUTC', 'total_rate','expiration_dateUTC', 'vcode', 'vcode_untill'
                                        ]);
                                        var total_rate = 1;
                                        callback.package_info.sprm = "";
                                        //Euro Bonus Balls
                                        // _.each(callback.betDetails, function(line) {
                                        // 	if(null != line.sprm) {
                                        // 		callback.package_info.sprm = line.sprm;
                                        // 	}
                                        // });

                                        if(callback.betDetails[0].type == 0) {
                                            _.each(callback.betDetails, function(line) {
                                                amount += line.val*line.sum;   //- line.sum;
                                            })
                                        }
                                        else {
                                            _.each(callback.betDetails, function(line) {
                                                total_rate *= line.val;
                                            });
                                            amount = callback.betDetails[0].package_sum*total_rate;
                                        }
                                        callback.package_info = calculatePossibles(callback.package_info, amount);
                                    }
                                    break;
                                case 'keno':
                                    if(callback.betDetails[0]) {
                                        maxWinningBonus = [0,3,10,45,80,150,500,1000,2000,5000,10000];
                                        _.each(callback.betDetails, function(betLine){
                                            if(!betLine.bet)
                                                console.log('Empty bet:',callback.package_info.package_id);
                                            amount += betLine.sum * maxWinningBonus[betLine.bet.split(',').length];
                                        });
                                        callback.package_info.possible_bonus = 0;
                                        callback.package_info = calculatePossibles(callback.package_info, amount);
                                    }
                                    break;
                                case 'kaboom':
                                    if(callback.betDetails[0]) {
                                        maxWinningBonus = 15000;
                                        _.each(callback.betDetails, function(betLine){
                                            amount += betLine.sum * maxWinningBonus;
                                        });
                                        callback.package_info = calculatePossibles(callback.package_info, amount);
                                    }
                                    break;
                                case 'five':
                                    if(callback.betDetails[0]) {
                                        maxWinningBonus = [1, 3, 10, 200, 200];
                                        _.each(callback.betDetails, function(betLine){
                                            if(!betLine.bet)
                                                console.log('Empty bet:',callback.package_info.package_id);
                                            amount += betLine.sum * maxWinningBonus[betLine.bet.split(',').length];
                                        });
                                        callback.package_info = calculatePossibles(callback.package_info, amount);
                                    }
                                    break;
                                case 'dogs':
                                case 'horses':
                                    if(callback.betDetails[0]) {
                                        _.each(callback.betDetails, function(line) {
                                            amount += line.val*line.sum;
                                        });
                                        callback.package_info = calculatePossibles(callback.package_info, amount);
                                    }
                                    break;
                                case 'wof':
                                    if(callback.betDetails[0]) {
                                        _.each(callback.betDetails, function(line) {
                                            amount += (36 / (line.bet.split(",")).length) * line.sum;
                                        });
                                        callback.package_info = calculatePossibles(callback.package_info, amount);
                                    }
                                    break;
                            }
                            if (!callback.package_info.tax_percent) callback.package_info.tax_percent = 0;
                            if (!callback.package_info.bonus) callback.package_info.bonus = 0;
                        }

                        if('sport' == getBetTypeFromPackageId(callback.package_info.package_id)) {
                            callback.package_info.motos = [];
                            var moto = _.filter(callback.betDetails, function (line) {
                                return (1 == line.moto_cup);
                            });
                            if (!_.isEmpty(moto)) {
                                _this.getMotoByPackageId(callback.package_info.package_id,currentUser,function (motos) {
                                    callback.package_info.motos = motos;
                                    res.send(callback).end();
                                });
                            }
                            else {
                                res.send(callback).end();
                            }
                        }
                        else
                        {
                            res.send(callback).end();
                        }


                    });
                });
            });

            BetOfficeRoute(app, 'searchBet', function(req,res,currentUser) {
                _this.getBetByPackageId(req, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        checkFreeBet: function (req, userInfo, callback) {

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
                    callback({error: true, message: 'Cash out not available for this user', data: []});
                }
                else {
                    wait.launchFiber(function () {
                        var payBetService = PayBet.start();

                        var cashOutResult = payBetService.checkFreeBet(response, type, userInfo.user_country);

                        callback({error: cashOutResult.validation.hasErrors, message: 'success', data: response});

                    });
                }
            }
        },

        checkPayoutCode: function (req, userInfo, callback) {
            knex('z_pcodes')
                .select('*')
                .where({pcode : req.body.payoutCode})
                .then(function (rows) {
                    if (_.isEmpty(rows) || !rows[0]) {
                        callback({error: true, message: 'Code is invalid', errors: ["Code is invalid."]});
                    }
                    else {
                        if(rows[0].used) {
                            callback({error: true, message: 'Code is invalid', errors: ["Code is used."]});
                        }
                        else {
                            callback({error: false, message: 'success', data: rows[0], available : true});
                        }

                    }
                }, function (error) {
                    console.error(error);
                    callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });

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
        },

        getMotoByPackageId: function(package_id,userInfo,callback){
            var now = moment.utc();
            var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
            var current_offset = moment.tz.zone(userInfo.agent_timezone).offset(now);
            var timezoneDifference = (tz_offset - current_offset) / 60;

            var query = knex('z_moto_tickets');
            query.select('bet', 'dt').where({package_id: package_id})
                .then(function (rows) {

                    _.each(rows, function (row) {
                        if (row.dt != null) {
                            row.dtUTC = moment(row.dt).add(tz_offset / 60, 'hours').format('YYYY-MM-DD HH:mm');
                            row.dt = moment(row.dt).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm');
                            row.bet = row.bet.split(',');
                        }
                    });

                    //console.log(rows);
                    callback(rows);
                }, function (error) {
                    console.error(error);
                    callback([]);
                });
        },

        getBetByPackageId: function (req, userInfo, callback) {
            var now = moment.utc();
            var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
            var current_offset = moment.tz.zone(userInfo.agent_timezone).offset(now);
            var timezoneDifference = (tz_offset - current_offset) / 60;

            var dateFormats = {
                'DEFAULT':{short:'MM-DD HH:mm',medium:'YYYY-MM-DD HH:mm',long:'YYYY-MM-DD HH:mm:ss'},
                'TANZANIA':{short:'MM-DD HH:mm',medium:'YYYY-MM-DD HH:mm',long:'YYYY-MM-DD HH:mm:ss'},
                'DR CONGO':{short:'MM-DD HH:mm',medium:'YYYY-MM-DD HH:mm',long:'YYYY-MM-DD HH:mm:ss'},
                'DR CONGO II':{short:'MM-DD HH:mm',medium:'YYYY-MM-DD HH:mm',long:'YYYY-MM-DD HH:mm:ss'},
                'NIGERIA':{short:'DD/MM HH:mm',medium:'DD/MM/YYYY HH:mm',long:'DD/MM/YYYY HH:mm:ss'}
            };

            //var df = dateFormats[userInfo.user_country]?dateFormats[userInfo.user_country]:dateFormats['DEFAULT'];
            var df = dateFormats['DEFAULT'];

            //console.log(req.body);

            //console.log(userInfo.user_country,df);
            var response = {
                success: true,
                betDetails: null,
                packageId: req.body.packageId,
                userId: userInfo.user_id,
                searchTerm: req.body.searchTerm,
                game_type: 'sport'
            };
            switch (req.body.game_type) {
                case 'sport':
                    response.game_type = 'sport';
                    break;
                case 'keno':
                    response.game_type = 'keno';
                    break;
                case 'kaboom':
                    response.game_type = 'kaboom';
                    break;
                case 'five':
                    response.game_type = 'five';
                    break;
                case 'horses':
                    response.game_type = 'horses';
                    break;
                case 'dogs':
                    response.game_type = 'dogs';
                    break;
                case 'wof':
                    response.game_type = 'wof';
                    break;
            }
            var re = /\d+-(\w+?)(\d+)/i, m;
            if ((m = re.exec(req.body.packageId)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
            }
            if (!req.body.packageId) {
                callback({error: true, message: 'input data error', data: []});
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

                if (splited.length > 1 && !isValid && userInfo.user_type != "FRANCHISE_OWNER" && userInfo.user_type != "COUNTRY_MANAGER" && userInfo.user_type != "FRANCHISE_MANAGER" && userInfo.user_type != "ADMIN") {
                    callback({error: true, message: 'Package not found', data: []});
                }
                else {
                    response.searchTerm = response.searchTerm ? response.searchTerm : '';
                    response.packageId = splited.length < 2 ? userInfo.user_id + "-" + response.searchTerm + req.body.packageId : req.body.packageId;
                    response.searchTerm = response.searchTerm ? response.searchTerm : req.body.packageId[0];
                    wait.launchFiber(function () {
                        var payBetService = PayBet.start();
                        payBetService.getBetDetails(response);
                        _.each(response.betDetails, function (item, key) {
                            var dates = ['dt', 'vdt', 'pdt', 'event_start_date_time', 'expiration_date', 'calculateionDate'];
                            _.each(dates, function (value, key1) {
                                if (response.betDetails[key][value] != null) {
                                    response.betDetails[key][value + 'UTC'] = moment(response.betDetails[key][value]).add(tz_offset / 60, 'hours').format(dateFormats.DEFAULT.long);
                                    response.betDetails[key][value] = moment(response.betDetails[key][value]).add(timezoneDifference, 'hours').format(dateFormats.DEFAULT.long);
                                }
                            });
                            //response.betDetails[key]["vcode_untill"] = moment(response.betDetails[key]['pdt']).add(7, 'days').add(timezoneDifference, 'hours').format(dateFormats.DEFAULT.medium);
                        });
                        if (response.betDetails) {
                            switch (response.game_type) {
                                case 'sport':
                                    _.each(response.betDetails, function (item) {
                                        //item.dtUTC = moment(item.dt).format();
                                        //item.expiration_dateUTC = moment(item.expiration_date).format();

                                        item.dt = moment(item.dt).format(df.medium);
                                        item.event_start_date = item.event_start_date_time;
                                        item.event_start_date_time = moment(item.event_start_date_time).format(df.short);
                                        item.expiration_date = moment(item.expiration_date).format(df.medium);
                                        if(item.vcode)
                                            item.vcode_untill = moment(item.dt).add(7,'d').format(df.medium);
                                    });
                                    break;
                                case 'keno':
                                case 'kaboom':
                                case 'five':
                                case 'horses':
                                case 'dogs':
                                case 'wof':
                                    _.each(response.betDetails, function (item) {
                                        //item.dtUTC = new Date(item.dt).toISOString();
                                        //item.expiration_dateUTC = new Date(item.expiration_date).toISOString();;

                                        item.dt = moment(item.dt).format(df.medium);
                                        item.expiration_date = moment(item.expiration_date).format(df.medium);
                                        if(item.vcode)
                                            item.vcode_untill = moment(item.dt).add(7,'d').format(df.medium);
                                    });
                                    break;
                            }
                        }
                        if (response.betDetails && response.betDetails.length > 0) {
                            callback(response);
                        }
                        else callback({error: true, message: 'Package not found', data: []});
                    });
                }
            }
        }

    }
};