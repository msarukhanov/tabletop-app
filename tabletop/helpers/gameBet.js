/**
 * Created by mmalkav on 01.03.2016.
 */

module.exports = function (knex, wait, moment, BS) {
    return {
        start: function () {
            var bettingService = BS.start();

            //GLOBAL VARIABLES
            var betType;

            //MESSAGES

            var globalSettings = bettingService.getGlobalSettings();
            globalSettings = _.groupBy(globalSettings, function(setting) {return setting.setting_name});
            globalSettings = _.each(globalSettings, function(setting, key) {
                globalSettings[key] = setting[0].setting_value
            });

            var configs = {
                MinStakeAmount: 500,
                MaxStakeAmount: 100000
            };

            var validMessages = {
                multiStakeVM: "Minimum amount is " + configs.MinStakeAmount,
                singleStakeVM: "Minimum amount is " + configs.MinStakeAmount,
                thisPriceIsNotActiveVM: "This price is not active",
                priceIsNotAvailable: "Price is not available",
                notEnoughLimit: "Out of limit for this terminal"
            };
            function addMessageToValidatable(bet, message) {
                var temp = {};
                temp['error'] = message;
                if(!bet.validation) bet.validation = {
                    errors: [],
                    hasErrors: false
                };
                bet.validation.errors.push(temp);
                bet.validation.hasErrors = true;
            }
            function validateLimitItems(bet, user_type) {
                var isValid = true;
                if(user_type == 'TERMINAL') {
                    if (bet.betTotalSum > bettingService.getTerminalUserLimit(bet.user_id)) {
                        addMessageToValidatable(bet, 'Out of limit for this terminal');
                        isValid = false;
                    }
                }
                else if(user_type == 'FRANCHISE') {
                    if (bet.betTotalSum > bettingService.getFRUserLimit(bet.cassa_id)) {
                        addMessageToValidatable(bet, 'Out of limit for this franchise');
                        isValid = false;
                    }
                }
                else {}
                return isValid;
            }
            function validatePriceMin(bet, tempMinAmount) {
                var isValid = true;
                if (bet.betTotalSum < tempMinAmount) {
                    addMessageToValidatable(bet, 'Minimum amount is ' + tempMinAmount);
                    isValid = false;
                }
                return isValid;
            }
            function validatePriceMax(bet, tempMaxAmount) {
                var isValid = true;
                if (bet.betTotalSum > tempMaxAmount) {
                    addMessageToValidatable(bet, 'Maximum amount is ' + tempMaxAmount);
                    isValid = false;
                }
                return isValid;
            }
            return {

                validateBet: function (req, bet, user_type, user_info) {

                    bet.validation = {
                        errors: [],
                        hasErrors: false
                    };
                    var isValid = true;
                    if(bet.betLines.length < 1)
                    {
                        bet.validation.hasErrors = true;
                        return false;
                        return false;
                        return false;
                        return false}

                    var tempMinAmount = Number(globalSettings['MinStakeAmount.' + user_info.user_country]);
                    var tempMaxAmount = Number(globalSettings['MaxStakeAmount.' + user_info.user_country]);
                    var tempRealAmount = betType == 1 ? bet.multiStake : bet.totalAmount;
                    var tempBaseAmount = tempRealAmount / Number(globalSettings['ExchangeRate.' + user_info.user_currency]);
                    var taxPercent = Number(globalSettings['Tax.' + user_info.user_country]);
                    var exchangeRate = Number(globalSettings['ExchangeRate.' + user_info.user_currency]);

                    var min_draw_id = _.min(_.pluck(bet.betLines, 'draw_id'));
                    var min_draw_date = bettingService.getMinDrawDate(min_draw_id, bet.betLines[0].line_type);

                    if(moment() > moment(min_draw_date.dt)) {
                        isValid = false;
                        addMessageToValidatable(bet, 'Bet is out of time');
                    }

                    if(isValid) {
                        if(validateLimitItems(bet, user_type) == false) {
                            isValid = false;
                        }
                        else {
                            if (validatePriceMin(bet, tempMinAmount) == false) {
                                isValid = false;
                            }
                            if (validatePriceMax(bet, tempMaxAmount) == false) {
                                isValid = false;
                            }
                        }
                    }

                    bet.validation.hasErrors = !isValid;

                    return isValid;
                },

                placeBet: function(req, bet, user_info) {
                    var dateOfAdmission = new Date();
                    var expirationDate = new Date(dateOfAdmission);
                    if(user_info.user_country == "NIGERIA") {
                        expirationDate = moment(expirationDate).add(7, 'days').format("YYYY-MM-DD hh:mm");
                    }
                    else {
                        expirationDate = moment(expirationDate).add(30, 'days').format("YYYY-MM-DD hh:mm");
                    }
                    //var ticks = ((new Date().getTime()) + 62135596800000).toString();
                    var preName;
                    switch (bet.gameType) {
                        case 'keno':
                            preName = 'K';
                            break;
                        case 'kaboom':
                            preName = 'KB';
                            break;
                        case 'five':
                            preName = 'F';
                            break;
                        case 'dogs':
                            preName = 'D';
                            break;
                        case 'horses':
                            preName = 'H';
                            break;
                        case 'wof':
                            preName = 'W';
                            break;
                    }
                    function genPackId (){
                        var t=Math.ceil(new Date().getTime() /(1000)).toString(); var d = Math.ceil(new Date().getTime() /(1000*86400)-17000).toString(); var t5 = d+t.substring(t.length-5,t.length); var pad = "000000000";var tpad = pad.substring(0, pad.length - t5.length) + t5; return tpad;
                    }
                    var packageId = bet.user_id + "-" + preName + genPackId();/*ticks.substring(ticks.length - 10, ticks.length);*/

                    if('TANZANIA' == user_info.user_country && bet.betTotalSum >= 1000) {
                        var vcode = bettingService.generateVCode();
                    }
                    else{
                        var vcode = '';
                    }

                    var tbl_name;
                    switch (bet.gameType) {
                        case 'keno':
                            tbl_name = 's_stakes_k';
                            break;
                        case 'kaboom':
                            tbl_name = 's_stakes_kb';
                            break;
                        case 'five':
                            tbl_name = 's_stakes_fv';
                            break;
                        case 'dogs':
                            tbl_name = 's_stakes_d';
                            break;
                        case 'horses':
                            tbl_name = 's_stakes_h';
                            break;
                        case 'wof':
                            tbl_name = 's_stakes_wof';
                            break;
                    }

                    var bonusType = 0;
                    if(user_info.user_country == "TANZANIA" && (user_info.user_type == "SHOP" || user_info.user_type == "FRANCHISE")) {
                        bonusType = 2;
                    }
                    var taxPercent = Number(globalSettings['Tax.' + user_info.user_country]);
                    var exchangeRate = Number(globalSettings['ExchangeRate.' + user_info.user_currency]);

                    /*
                    *  Raw approach
                    */
                    //var raw_prefix = "INSERT INTO `betoffice`."+tbl_name+" (user_id,sum,package_id,dt,rdt,bonus,bonus_type,bonus_percent_expiration_date,is_header,base_sum,base_package_sum,package_sum,tax_percent,currency,country,employee_id) VALUES ";
                    var raw_betlines = [];
                    var raw_prefix;
                    var raw_fields = [];
                    var raw_balancelimit = "";
                    function raw_sqlify(row){
                        if(_.isEmpty(raw_fields)) {
                            raw_fields = _.keys(row);
                            raw_prefix = "INSERT INTO `betoffice`."+tbl_name+" ("+raw_fields.join(',')+") VALUES ";
                        }
                        var values = [];
                        _.each(raw_fields,function(field){
                            if('dt' == field)
                                values.push("NOW()");
                            else if('rdt' == field)
                                values.push("'"+moment(row[field]).format("YYYY-MM-DD hh:mm:ss")+"'");
                            else if('is_header' == field)
                                values.push((row[field]===true?1:0));
                            else
                                values.push("'"+row[field]+"'");
                        });
                        return "("+values.join(',')+")";
                    }


                    _.each(bet.betLines, function (betLine, key) {
                        var preStake = {
                            
                            sum : betLine.line_sum,
                            rdt: req.headers['arrived'],
                            bonus : 0,
                            bonus_percent : 0,
                            base_sum : bet.betTotalSum,
                            base_package_sum : bet.betTotalSum,
                            package_sum : bet.betTotalSum,
                            bonus_type : bonusType,
                            package_id : packageId,
                            dt : new Date(),
                            user_id : bet.user_id,
                            is_header : key==0,
                            expiration_date : expirationDate,
                            tax_percent : taxPercent,
                            currency: user_info.user_currency,
                            country: user_info.user_country,
                            employee_id: user_info.employee_info ? user_info.employee_info.id : 0,
                            vcode: vcode
                        };
                        switch (bet.gameType) {
                            case 'keno':
                                preStake.b1 = betLine.line_array.split(',')[0];
                                preStake.b2 = betLine.line_array.split(',')[1] ? betLine.line_array.split(',')[1] : 0;
                                preStake.b3 = betLine.line_array.split(',')[2] ? betLine.line_array.split(',')[2] : 0;
                                preStake.b4 = betLine.line_array.split(',')[3] ? betLine.line_array.split(',')[3] : 0;
                                preStake.b5 = betLine.line_array.split(',')[4] ? betLine.line_array.split(',')[4] : 0;
                                preStake.b6 = betLine.line_array.split(',')[5] ? betLine.line_array.split(',')[5] : 0;
                                preStake.b7 = betLine.line_array.split(',')[6] ? betLine.line_array.split(',')[6] : 0;
                                preStake.b8 = betLine.line_array.split(',')[7] ? betLine.line_array.split(',')[7] : 0;
                                preStake.b9 = betLine.line_array.split(',')[8] ? betLine.line_array.split(',')[8] : 0;
                                preStake.b10 = betLine.line_array.split(',')[9] ? betLine.line_array.split(',')[9] : 0;
                                preStake.draw = betLine.draw_id;
                                break;
                            case 'kaboom':
                                preStake.b1 = betLine.line_array.split(',')[0];
                                preStake.b2 = betLine.line_array.split(',')[1];
                                preStake.b3 = betLine.line_array.split(',')[2];
                                preStake.b4 = betLine.line_array.split(',')[3];
                                preStake.b5 = betLine.line_array.split(',')[4];
                                preStake.b6 = betLine.line_array.split(',')[5];
                                preStake.draw = betLine.draw_id;
                                break;
                            case 'five':
                                preStake.b1 = betLine.line_array.split(',')[0];
                                preStake.b2 = betLine.line_array.split(',')[1];
                                preStake.b3 = betLine.line_array.split(',')[2];
                                preStake.b4 = betLine.line_array.split(',')[3];
                                preStake.b5 = betLine.line_array.split(',')[4];
                                preStake.draw = betLine.draw_id;
                                break;
                            case 'dogs':
                                preStake.bet = betLine.line_name;
                                preStake.race = betLine.draw_id;
                                preStake.val = betLine.line_value;
                                break;
                            case 'horses':
                                preStake.bet = betLine.line_name;
                                preStake.race = betLine.draw_id;
                                preStake.val = betLine.line_value;
                                break;
                            case 'wof':
                                preStake.bet = betLine.line_array;
                                preStake.draw = betLine.draw_id;
                                preStake.val = betLine.line_sum;
                                preStake.kind = betLine.line_kind;
                                break;
                        }
                        preStake.base_package_sum = preStake.package_sum / exchangeRate;
                        preStake.base_sum = preStake.sum / exchangeRate;
                        //bettingService.saveGameBet(tbl_name, preStake);
                        raw_betlines.push(raw_sqlify(preStake));
                    });

                    if(bet.validation.hasErrors == false) {
                        var query = "call `betoffice`.SaveBetSafeVcode(\""+raw_prefix + raw_betlines.join(',') +";\","+bet.user_id+","+bet.betTotalSum+","+(user_info.user_type == "FRANCHISE"?user_info.kassa_id:null) +
                            ","+(vcode?"'"+vcode+"'":null)+
                            ","+(vcode?"'"+packageId+"'":null)+");";
                        var saferes = bettingService.safeBetSave(query);

                        if(saferes){
                            bet.betLines = bettingService.getGameStakesByPackageId(tbl_name, packageId);
                            this.postBetAction(user_info,packageId,bet);
                        }
                        else {
                            console.log('Safe bet - failed:',query);
                            return null;
                        }
                    }
                    return(bet);

                },

                postBetAction: function(user_info, packageId, bet){
                    // calculating bonus points employee
                    if('TANZANIA' == user_info.user_country || 'DR CONGO' == user_info.user_country || 'DR CONGO II' == user_info.user_country) {

                        var gameLines = 0, package_sum = bet.betTotalSum;
                        _.each(bet.betLines, function(betLine, key){
                            gameLines++;
                        });
                        bettingService.addEmployeeActivity(user_info, 'game', gameLines);
                        bettingService.addEmployeeActivity(user_info, 'gamebet', 0);
                        bettingService.addEmployeeActivity(user_info, 'package', package_sum);
                    }
                },

                updateLimit: function(user_id, amount) {
                    bettingService.updateTerminalUserLimit(user_id, bettingService.getTerminalUserLimit(user_id), amount);
                },

                updateFRLimit: function(user_id, amount) {
                    bettingService.updateFRUserLimit(user_id, bettingService.getFRUserLimit(user_id), amount);
                },

                updateUserBalance: function(user_id, amount) {
                    bettingService.updateUserBalance(user_id, bettingService.getUserBalance(user_id) + amount);
                },

                updateTerminalIncome: function(user_id, amount) {
                    bettingService.updateTerminalIncome(user_id, bettingService.getTerminalIncome(user_id, 'game') + amount, 'game');
                },

                updateTerminalRevenue: function(user_id) {
                    bettingService.updateTerminalRevenue(user_id);
                }

            }
        }
    }
};