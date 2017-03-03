/**
 * Created by Arthur on 10/16/2015.
 */


module.exports = function (knex, wait, BS) {
    return {
        start : function (user_info) {
            var bettingService = BS.start();
            var globalSettings = bettingService.getGlobalSettings();
            globalSettings = _.groupBy(globalSettings, function(setting) {return setting.setting_name});
            globalSettings = _.each(globalSettings, function(setting, key) {
                globalSettings[key] = setting[0].setting_value
            });
            var priceRate = globalSettings['RateChange.' + user_info.user_country] * 1;
            var marketShortCodeMap = {
                "1":["1x2"], //	Match RESULT
                "2":["DC"], //	double chance
                "3":["OU"], //	over under
                "4":["IOU_T1"], //	home over under
                "5":["IOU_T2"], //	away  over under
                "6":["1x2_H1"], //	match result half time
                "7":["DC_H1"], //	double chance first half
                "8":["OU_H1"], //	over under first half
                "9":["IOU_T1_H1"], //	home over under first half
                "10":["IOU_T2_H1"], //	away over under first half
                "11":["TSG_T1"], //	home will  score
                "12":["TSG_T2"], //	away  will score
                "13":["BTS"], //	both team will  score
                "14":["TSG_T1_H1"], //	home team will  score first half
                "15":["TSG_T2_H1"], //	away team will  score first half
                "16":["BTS_H1"], //	both team will  score first half
                "17":["CS"], //	Correct Score
                "18":["CS_H1"], //	first half correct score
                "19":["CCS_101120","CCS_102021","CCS_102030","CCS_203031","CCS_000110","CCS_001020","CCS_000102","CCS_010211","CCS_010212","CCS_010203","CCS_020313"], //	Combinated Scores( 1:0 , 2:0 , 1:1 ...),
                "20":["HTFT"], //	HALF TIME / FULL TIME
                "21":["HTFT_OU250"], //	HALF TIME / FULL TIME & OVER/UNDER 1.5 , 2.5
                "22":["HTFT_BTS"], //	Half Time/Full Time/Both Teams To Score
                "23":["RTG"], //	RESULT/TOTAL GOALS
                "24":["RTGWO_T1","RTGWU_T1","RTGNLO_T1","RTGNLU_T1"], //	Home Win/Over , Home Win/Under , Home Not lose/Over, Home Not lose/Under
                "25":["RTGWO_T2","RTGWU_T2","RTGNLO_T2","RTGNLU_T2"], //	Away Win/Over , Away Win/Under , Away Not lose/Over, Away Not lose/Under
                "26":["DC_BTS"], //	Double Chance/Both Teams To Score
                "27":["1x2_10M","1x2_35M","1x2_40M","1x2_60M","1x2_75M"], //	1x2 (10 , 60, 75) minutes
                "28":["DC_10M","DC_30M","DC_50M","DC_70M","DC_60M","DC_75M","DC_40M","DC_35M"], //	Double Chance - (10, 30, 50, 60, 70, 75)  minutes
                "29":["1x2_0_15","1x2_16_30", "1x2_31_45", "1x2_46_60", "1x2_60_75", "1x2_75_90"], //	1x2 between 00:00 m and 15:00 m - 75:01 m and 90:00 m
                "30":["DC_0_15","DC_16_30", "DC_31_45", "DC_46_60", "DC_60_75", "DC_75_90"], //	Double Chance between 00:00 m and 15:00 m - 75:01 m and 90:00 m
                "31":["WMS1_T1", "WMS2_T1", "WMS3_T1", "WMOR1_T1", "WMOR2_T1", "WMGE1_T1", "WMGE2_T1", "WMSD1_T1", "WMSD2_T1"], //	Home Winning Margins ALL
                "32":["WMS1_T2", "WMS2_T2", "WMS3_T2", "WMOR1_T2", "WMOR2_T2", "WMGE1_T2", "WMGE2_T2", "WMSD1_T2", "WMSD2_T2"], //	Away Winning Margins ALL
                "33":["TNG01", "TNG12", "TNG23", "TNG34", "TNG45", "TG01_H1", "TG12_H1", "TG23_H1", "TG01_H2", "TG12_H2", "TG23_H2", "TG34_H2", "TG34_H1", "TG45_H2", "TG45_H1", "TNG26", "TNG13", "TNG24", "TNG25", "TNG35", "TNG46"], //	0 or 1 Goals - 4 or 5 Goals  , 0 or 1 Goals - 4 or 5 Goals(1st Half)
                "34":["TNG01_T1", "TNG12_T1", "TNG23_T1", "TNG34_T1", "TNG45_T1", "TNG01_T1_H1", "TNG12_T1_H1", "TNG23_T1_H1", "TNG01_T1_H2", "TNG12_T1_H2", "TNG23_T1_H2","TNG34_T1_H1", "TNG34_T1_H2", "TNG45_T1_H2"], //	Home 0 or 1 Goals - Home 3 or 4 Goals , Home 0 or 1 Goals - Home 3 or 4 Goals( 1st Half)
                "35":["TNG01_T2", "TNG12_T2", "TNG23_T2", "TNG12_T2_H1", "TNG12_T2_H2", "TNG34_T2", "TNG45_T2", "TNG01_T2_H1", "TNG23_T2_H1", "TNG01_T2_H2", "TNG23_T2_H2", "TNG34_T2_H2"], //	Away 0 or 1 Goals - Away 3 or 4 Goals  , Away 0 or 1 Goals - Home 3 or 4 Goals( 1st Half)
                "36":["TNG","TNG_H1","TNG_H2"], //	Total Goals Number, Total Goals Number(1st Half)
                "37":["TNG_T1","TNG_T1_H1","TNG_T1_H2"], //	Home Total Goals Number, Home Total Goals Number(1st Half)
                "38":["TNG_T2","TNG_T2_H1","TNG_T2_H2"], //	Away Goals Number, Away Goals Number(1st Half)
                "39":["S1G","S2G","S3G","S4G","S5G"], //	Which team will score the 1st , 2nd , 3rd , 4th, 5th goal?,
                "40":["SFM_W_T1","SFM_NW_T1","SFM_W_T2","SFM_NW_T2"], //	Home Score First/Win Match, Home Score First/Not Win Match , Away Score First/Win Match, Away Score First/Not Win Match
                "41":["HSH","HSH_T1","HSH_T2"], //	Highest Scoring Half, Home Highest Scoring Half , Away Highest Scoring Half
                "42":["AH","AH_H1","AH_H2"], //	Asian Handicap, Asian Handicap(1st Half) , Asian Handicap (2nd Half)
                "43":["OE","OE_H1","OE_H2"], //	ODD / EVEN , ODD/EVEN(1st half) ,  ODD/EVEN(2nd half) ,
                "44":["DNB","DNB_H1","DNB_H2"], //	Draw No Bet, Draw No Bet (1st Half) , Draw No Bet (2nd Half)
                "45":["RBTS","TGBTS"], //	Results/Both Teams To Score  ,   Total Goals/Both Teams To Score
                "46":["HTOFT"], // 1st Half or Match   -
                "47":["WBH_T1"], // Home Win Both Halves -
                "48":["WBH_T2"], // Away Win Both Halves -
                "49":["WTN_T1"], // Home Win To Nill -
                "50":["WTN_T2"], // Away Win To Nill -
                "51":["TSG_M"]  // Goal In Interval
            };
            var marketNamesForSort =[
                "Match Result", "Double Chance", "Over/Under", "Home Team Total Goals",
                "Away Team Total Goals","Both Teams To Score", "Home Team Score a Goal",
                "Away Team Score a Goal",  "Asian Handicap", "Correct Score"
            ];
            return {
                getAll: function (req, callback) {
                    var  responseArr = {};
                    var _this = this;
                    var tempCondition = "";
                    knex.raw('SELECT e.event_id FROM `betoffice`.s_limits t,`obs`.pre_event e WHERE e.event_start_time>NOW() ' +
                        'AND t.event_id=e.event_id AND t.event_id<>0 AND t.active=0')
                        .then(function (resp) {
                            if(resp[0]) {
                                if(resp[0].length>0) {
                                    tempCondition = " AND pre_event.event_id NOT IN(" + _.pluck(resp[0], 'event_id').join(",") + ")";
                                }
                                knex.raw('select pre_event.*,count(*) as cnt from `obs`.pre_price,`obs`.pre_event WHERE pre_event.event_id=pre_price.event_id ' + tempCondition +
                                    ' and pre_event.event_start_time > NOW() GROUP BY pre_price.event_id HAVING cnt > 0;')
                                    .then(function (response) {
                                        response[0] = _.omit(response[0], 'cnt');
                                        responseArr['events'] = response[0];
                                        _.each(response[0], function (ev) {
                                            ev.is_prematch = 1;
                                        });

                                        _this.getAllSports(response[0], function (sportsResponse) {
                                            if (!sportsResponse.error) responseArr['sports'] = sportsResponse.data;

                                            _this.getAllCompetitions(response[0], function (competitionsResponse) {
                                                if (!competitionsResponse.error) responseArr['competitions'] = competitionsResponse.data;

                                                _this.mapAllPrematch(responseArr, function (response) {
                                                    callback(response);
                                                })
                                            });
                                        });
                                    }, function(error) {
                                        console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                                    });
                            }
                            else {
                                callback({error: true, message: error, error_code: 'err_5'});
                            }
                        }, function(error) {
                            console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                        });


                    if (!_.isEmpty(this.responseArr)) this.responseArr = {};
                },

                getLive: function (req, callback) {
                    var _this = this;
                    knex.raw('select `obs.paddypower`.event.*,count(*) as cnt from `obs.paddypower`.price,`obs.paddypower`.event ' +
                        'WHERE `obs.paddypower`.event.monitor_status=1 and `obs.paddypower`.event.event_id=`obs.paddypower`.price.event_id ' +
                        'GROUP BY `obs.paddypower`.price.event_id HAVING cnt > 0;')
                        .then(function (response) {
                            callback(response[0]);
                        }, function(error) {
                            console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                        });

                    if (!_.isEmpty(this.responseArr)) this.responseArr = {};
                },

                getLiveEvent : function(req, callback) {

                    if(!req.body || (!req.body.event_id && !req.body.short_code) ) {
                        callback({error: true, message: 'Wrong search string', error_code: 'err_0'});
                        return;
                    }



                    var market_id = req.body.short_code;
                    var market_short_code;

                    if(req.body.short_code && req.body.short_code.split(".")[1]) {
                        market_id = req.body.short_code.split(".")[0].replace(/\D+/g, '');
                        market_short_code = parseInt(req.body.short_code.split(".")[1].replace(/\D+/g, ''));
                    }

                    if(market_id)
                        market_id = parseInt(market_id.replace(/\D+/g, ''));
                    //if(market_short_code)
                    //    market_short_code = parseInt(market_short_code.replace(/\D+/g, ''));

                    market_id = (NaN == market_id || !market_id)?0:market_id;


                    var searchQuery = req.body.short_code ? 'short_code = ' + market_id : 'event_id = ' + req.body.event_id;
                    //console.log('searchQuery',searchQuery);
                    var _this = this;

                    knex.raw('select * from `obs.paddypower`.event WHERE ' + searchQuery + ' and monitor_status = 1;')
                        .then(function (response) {
                            if(!response || !response[0] || !response[0][0]) {
                                //console.log('Bad sq 1:',searchQuery,req.body);
                                callback({error: true, message: 'query error', error_code: 'ff'});
                                return;
                            }
                            else {
                                var liveEvent = response[0][0];

                                var marketSearchQuery = 'select m.*,mt.market_code from `obs.paddypower`.market m, `obs.paddypower`.market_type mt ' +
                                    ' WHERE m.event_id = ' + liveEvent.event_id + ' and m.market_status_id = 1 AND m.market_type_id=mt.market_type_id';
                                if(market_short_code && marketShortCodeMap['' + market_short_code]) {
                                    var market_codes = marketShortCodeMap['' + market_short_code].join("','");
                                    marketSearchQuery = "SELECT m.*,mt.market_code FROM `obs.paddypower`.market m, `obs.paddypower`.market_type mt" +
                                        " WHERE m.market_type_id=mt.market_type_id AND mt.market_code IN(\'" + market_codes + "\') AND m.market_status_id = 1 AND m.event_id='" + liveEvent.event_id + "'";
                                }

                                knex.raw(marketSearchQuery)
                                    .then(function (response) {
                                        if(!response || !response[0]) {
                                            callback({error: true, message: 'query error', error_code: 'ff'});
                                            return;
                                        }
                                        else {
                                            var eventMarkets = response[0];
                                            knex.raw('select * from `obs.paddypower`.price WHERE event_id = ' + liveEvent.event_id + ' and price_status_id = 1;')
                                                .then(function (response) {
                                                    if(!response[0]) {
                                                        callback({error: true, message: 'query error', error_code: 'ff'});
                                                        return;
                                                    }
                                                    else {
                                                        var eventPrices = response[0];
                                                        _.each(eventMarkets, function(market, key){
                                                            eventMarkets[key].prices = _.where(eventPrices, {market_id: market.market_id});
                                                            if (market.market_name.indexOf("Asian Handicap") !== 0) {
                                                                _.each(eventMarkets[key].prices, function (item) {
                                                                    if (!item.handicap_value) {
                                                                        delete item.handicap_value;
                                                                    }
                                                                })
                                                            }
                                                            if (marketNamesForSort.indexOf(eventMarkets[key].market_name) > -1) {
                                                                eventMarkets[key].sortIndex = marketNamesForSort.indexOf(market.market_name);
                                                            }
                                                        });
                                                        _.each(eventMarkets, function(market, keyMarket){
                                                            eventMarkets[keyMarket].prices = _.filter(market.prices, function(price, keyPrice){
                                                                return price.rate > 1;
                                                            });
                                                        });
                                                        eventMarkets = _.filter(eventMarkets, function(market){
                                                            return market.prices.length > 0;
                                                        });
                                                        liveEvent.markets = eventMarkets;
                                                        callback({error: false, message: 'success', data: liveEvent});
                                                    }
                                                }, function(error) {
                                                    console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                                                });
                                        }
                                    }, function(error) {
                                        console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                                    });
                            }
                        }, function(error) {
                            console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                        });

                    if (!_.isEmpty(this.responseArr)) this.responseArr = {};
                },

                getAllSports: function (data, callback) {
                    var _this = this;
                    var sportIDs = [];
                    _.each(data, function (val, key) {
                        if (sportIDs.indexOf(val.sport_id) === -1) sportIDs.push(val.sport_id);
                    });
                    sportIDs = sportIDs.join(",");
                    knex.raw('SELECT * FROM `obs`.pre_sport WHERE sport_id IN ( ' + sportIDs + ')')
                        .then(function (result) {
                            callback({error: false, data: result[0]});
                        }, function(error) {
                            console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                        })
                },

                getAllCompetitions: function (data, callback) {
                    var _this = this;
                    var competitionIDs = [];
                    _.each(data, function (val, key) {
                        if (competitionIDs.indexOf(val.competition_id) === -1) competitionIDs.push(val.competition_id);
                    });
                    competitionIDs = competitionIDs.join(",");
                    knex.raw('SELECT * FROM `obs`.pre_competition WHERE competition_id IN ( ' + competitionIDs + ')')
                        .then(function (result) {
                            callback({error: false, data: result[0]});
                        }, function(error) {
                            console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                        })
                },

                mapAllPrematch: function (responseArr, callback) {
                    var _this = this;
                    var mappingArray = responseArr;

                    mappingArray['events'] = _.map(mappingArray['events'], function (e) {
                        e.teams = e.event_name.split(' V ');
                        return e;
                    });

                    _.each(mappingArray['sports'], function (sportVal, sportKey) {
                        var events = _.filter(mappingArray['events'], function (elems) {
                            var tmpSport = mappingArray['sports'][sportKey];
                            return elems.sport_id == tmpSport.sport_id;
                        });

                        _.each(events, function (ev) {
                            ev.sport_name = mappingArray['sports'][sportKey].sport_name;
                            ev.evnt_src = 0;
                        });

                        mappingArray['sports'][sportKey]['competitions'] = [];
                        _.each(events, function (eventVal, eventKey) {

                            var competitionsOfThisEvent = _.filter(mappingArray['competitions'], function (competitionElems) {
                                return competitionElems.competition_id == events[eventKey].competition_id;
                            });

                            _.each(competitionsOfThisEvent, function (c) {
                                events[eventKey].competition_name = c.competition_name;
                            });

                            if (competitionsOfThisEvent)
                                mappingArray['sports'][sportKey]['competitions'].push(competitionsOfThisEvent[0]);

                        });

                        mappingArray['sports'][sportKey]['competitions'] = _.uniq(mappingArray['sports'][sportKey]['competitions']);

                        _.each(mappingArray['sports'][sportKey]['competitions'], function (compVal, compKey) {
                            mappingArray['sports'][sportKey]['competitions'][compKey]['events'] = _.filter(mappingArray['events'], function (eventsElems) {
                                return mappingArray['sports'][sportKey]['competitions'][compKey].competition_id == eventsElems.competition_id;
                            });
                        });
                    });
                    callback(mappingArray['sports']);
                },

                getMarketAndPriceByEventId: function (eventId, marketId, callback) {

                    var searchObject = {event_id: eventId};
                    //var market_code = marketShortCodeMap[''+marketId];
                    var market_codes = (marketShortCodeMap['' + marketId] || []).join("','");

                    if(!market_codes) market_codes = '';
                    var excludedMarketsArray = [];
                    var excludedMarkets = '';
                    if(marketId=='99') {
                        _.each(marketShortCodeMap, function(market) {
                            excludedMarketsArray.push(market);
                        });
                        excludedMarkets = _.flatten(excludedMarketsArray).join("','");
                    }

                    knex.raw('SELECT e.event_id FROM betoffice.s_limits t,obs.pre_event e WHERE t.event_id=' + eventId +
                        ' AND t.event_id=e.event_id AND t.event_id<>0 AND t.active=0')
                        .then(function (rows) {
                            if(!rows || (rows[0] && rows[0].length > 0)) {
                                callback({error: false, message: 'event blocked', data : {}});
                            }
                            else {
                                knex.raw('CALL betoffice.GetPrematchMarketsByEventAndCodeX(' + eventId + ',\"'+ market_codes + '\",\"' + excludedMarkets + '\")')
                                    .then(function (markets) {
                                        if(markets.length>0) {
                                            knex('obs.pre_price').where({event_id: eventId})
                                                .then(function (prices) {
                                                    var market = markets[0][0];
                                                    var data = _.each(markets[0][0], function (market) {
                                                        if(market.market_name) {
                                                            market.prices = _.where(prices, {market_id: market.market_id});
                                                            _.each(market.prices, function (item, key) {
                                                                market.prices[key].rate = Number((priceRate * Number(market.prices[key].rate)).toFixed(2).toString());
                                                                market.prices[key].initial_rate = Number((priceRate * Number(market.prices[key].initial_rate)).toFixed(2).toString());
                                                            });
                                                            if(market.market_name.indexOf("Asian Handicap") !== 0){
                                                                _.each(market.prices, function (item) {
                                                                    if(!item.handicap_value){
                                                                        delete item.handicap_value;
                                                                    }
                                                                })
                                                            }
                                                            if (marketNamesForSort.indexOf(market.market_name) > -1) {
                                                                market.sortIndex = marketNamesForSort.indexOf(market.market_name);
                                                            }
                                                        }
                                                    });
                                                    callback({error: false, data: data});
                                                }, function(error) {
                                                    console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                                                });
                                        }
                                    }, function(error) {
                                        console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                                    });
                            }
                        }, function(error) {
                            console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                        });
                },

                getMarketAndPriceByShortCode: function (shortCodeArr, callback) {

                    var eventIds = [];
                    knex('obs.pre_event').whereIn('short_code', shortCodeArr)
                        .where('event_start_time', '>=', new Date())
                        .then(function (events) {
                            if(events.length){
                                _.each(events, function (value,key) {
                                    eventIds.push(value.event_id);
                                    events[key]['markets'] = [];
                                });
                                knex('obs.pre_market').whereIn('event_id', eventIds)
                                    .then(function (markets) {
                                        events = _.each(events, function (value, key) {
                                            value['markets'] = _.where(markets, {event_id: value.event_id});
                                        });
                                        knex('obs.pre_price').whereIn('event_id', eventIds)
                                            .then(function (prices) {
                                                markets = _.each(markets, function (market) {
                                                    market.prices = _.where(prices, {market_id: market.market_id});
                                                    _.each(market.prices, function (item, key) {
                                                        market.prices[key].rate = Number((priceRate * Number(market.prices[key].rate)).toFixed(2).toString());
                                                        market.prices[key].initial_rate = Number((priceRate * Number(market.prices[key].initial_rate)).toFixed(2).toString());
                                                    });
                                                    if (market.market_name.indexOf("Asian Handicap") !== 0) {
                                                        _.each(market.prices, function (item) {
                                                            if (!item.handicap_value) {
                                                                delete item.handicap_value;
                                                            }
                                                        })
                                                    }
                                                    if (marketNamesForSort.indexOf(market.market_name) > -1) {
                                                        market.sortIndex = marketNamesForSort.indexOf(market.market_name);
                                                    }
                                                });
                                                callback({error: false, events: events});
                                            }, function(error) {
                                                console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                                            })
                                    }, function(error) {
                                        console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                                    });
                            }else{
                                callback({error: false, events: []});
                            }

                        }, function(error) {
                            console.error(error);callback({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                        });

                }


            };
        }
    }
};
