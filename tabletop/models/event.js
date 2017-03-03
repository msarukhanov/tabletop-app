/**
 * Created by Mark Sarukhanov on 22.11.2016.
 */

module.exports = function(app, knex, wait, moment, redisRequests, Prematch){

    return {
        regRoutes: function () {
            var _this = this;

            BetOfficeRoute(app, 'prematch', function(req,res,currentUser) {
                var ropts = {time:60,key:'pos.'+currentUser.user_country+'.prematch'};
                redisRequests.Getter(ropts.key,function(red){
                    if(red.error || !red.data) { // From DB
                        _this.preMatch(req, currentUser, function (response) {
                            res.send(response).end();
                            redisRequests.SetterEx(ropts.key,ropts.time,response, function(){});
                        });
                    } else { // From cache
                        res.send(red.data).end();
                    }
                });
            });

            BetOfficeRoute(app, 'live', function(req,res,currentUser) {
                _this.liveGames(req, currentUser, function (response) {
                    res.send(response).end();
                });
            });

            BetOfficeRoute(app, 'liveEvent', function(req,res,currentUser) {
                var ropts = {time:5,key:'pos.'+currentUser.user_country+'.'+req.body.event_id+'.'+req.body.short_code+'.liveEvent'};
                redisRequests.Getter(ropts.key,function(red){
                    if(red.error || !red.data) { // From DB
                        _this.liveEvent(req, currentUser, function (response) {
                            res.send(response).end();
                            redisRequests.SetterEx(ropts.key,ropts.time,response, function(){});
                        });
                    } else { // From cache
                        res.send(red.data).end();
                    }
                });
            });

            BetOfficeRoute(app, 'searchEvent', function(req,res,currentUser) {
                var ropts = {time:60,key:'pos.'+currentUser.user_country+'.'+req.body.join(',')+'.searchEvent'};
                redisRequests.Getter(ropts.key,function(red){
                    if(red.error || !red.data) { // From DB
                        _this.searchPreMatchMarket(req.body, currentUser, function (response) {
                            res.send(response).end();
                            redisRequests.SetterEx(ropts.key,ropts.time,response, function(){});
                        });
                    } else { // From cache
                        res.send(red.data).end();
                    }
                });
            });

            BetOfficeRoute(app, 'event/:id', function(req,res,currentUser) {
                var ropts = {time:60,key:'pos.'+currentUser.user_country+'.'+req.params.id+'.'+req.body.marketId+'.event'};
                redisRequests.Getter(ropts.key,function(red){
                    if(red.error || !red.data) { // From DB
                        _this.preMatchMarket(req.params.id, req.body.marketId, currentUser, function (response) {
                            res.send(response).end();
                            redisRequests.SetterEx(ropts.key,ropts.time,response, function(){});
                        });
                    } else { // From cache
                        res.send(red.data).end();
                    }
                });
            });

            BetOfficeRoute(app, 'searchEventNew', function(req,res,currentUser) {
                var ropts = {time:60,key:'pos.'+currentUser.user_country+'.'+req.body.type+'.'+req.body.val+'.searchEventNew'};
                redisRequests.Getter(ropts.key,function(red){
                    if(red.error || !red.data) { // From DB
                        _this.searchEventNew(req, currentUser, function (response) {
                            res.send(response).end();
                            redisRequests.SetterEx(ropts.key,ropts.time,response, function(){});
                        });
                    } else { // From cache
                        res.send(red.data).end();
                    }
                });
            });

        },

        preMatch: function (req, userInfo, callback) {
            var now = moment.utc();
            var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
            var current_offset = moment.tz.zone(userInfo.agent_timezone).offset(now);
            var timezoneDifference = (tz_offset - current_offset) / 60;
            wait.launchFiber(function () {
                var prematchService = Prematch.start(userInfo);
                prematchService.getAll(req, function (response) {
                    _.each(response, function (sport, key1) {
                        //response[key1] = _.omit(sport,['sport_id']);

                        _.each(sport.competitions, function (competition, key2) {

                            response[key1].competitions[key2] = _.omit(competition, ['sport_id']);

                            _.each(competition.events, function (event, key3) {
                                if (event['event_start_time'] != null)
                                    (response[key1].competitions[key2].events[key3]['event_start_time'] =
                                        moment(response[key1].competitions[key2].events[key3]['event_start_time']).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss'));

                                response[key1].competitions[key2].events[key3] = _.omit(event, ['create_date', 'event_key', 'event_reference_id', 'event_state_id', 'update_date', 'teams', 'cnt', 'is_prematch']);
                            });
                        });
                    });
                    callback(response);
                });
            });
        },

        liveGames: function (req, userInfo, callback) {
            wait.launchFiber(function () {
                var prematchService = Prematch.start(userInfo);
                prematchService.getLive(req, function (response) {
                    callback(response);
                });
            });

        },

        liveEvent: function (req, userInfo, callback) {
            wait.launchFiber(function () {
                var prematchService = Prematch.start(userInfo);
                prematchService.getLiveEvent(req, function (response) {
                    callback(response);
                });
            });

        },

        preMatchMarket: function (eventId, marketId, userInfo, callback) {
            wait.launchFiber(function () {
                var prematchService = Prematch.start(userInfo);
                prematchService.getMarketAndPriceByEventId(eventId, marketId, function (response) {
                    callback(response);
                });
            });

        },

        searchPreMatchMarket: function (shortCodeArr, userInfo, callback) {
            wait.launchFiber(function () {
                var prematchService = Prematch.start(userInfo);
                prematchService.getMarketAndPriceByShortCode(shortCodeArr, function (response) {
                    callback(response);
                });
            });

        },

        searchEventNew: function (req, userInfo, callback) {
            var now = moment.utc();
            var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
            var current_offset = moment.tz.zone(userInfo.agent_timezone).offset(now);
            var timezoneDifference = (tz_offset - current_offset) / 60;
            var _now = new Date();
            if (req.body.type != 'string') {
                knex('obs.pre_event').select('*')
                    .where(req.body.type, req.body.val)
                    .where('event_start_time', '>', _now)
                    .leftJoin('obs.pre_competition', 'obs.pre_competition.competition_id', 'obs.pre_event.competition_id')
                    .leftJoin('obs.pre_sport', 'obs.pre_sport.sport_id', 'obs.pre_event.sport_id')
                    .orderBy('event_start_time', 'desc')
                    .limit(1)
                    .then(function (rows) {
                        if (_.isEmpty(rows)) {
                            callback({error: false, message: 'Success', type: 'all', data: {}});
                        }
                        else {
                            rows[0].event_start_time = moment(rows[0].event_start_time).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss');
                            rows[0].evnt_src = 0;
                            rows[0].is_prematch = 1;
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
            else {
                knex('obs.pre_event').select('*')
                    .where('event_name', 'like', '%' + req.body.val + '%')
                    .where('event_start_time', '>', _now)
                    .leftJoin('obs.pre_competition', 'obs.pre_competition.competition_id', 'obs.pre_event.competition_id')
                    .leftJoin('obs.pre_sport', 'obs.pre_sport.sport_id', 'obs.pre_event.sport_id')
                    .orderBy('event_start_time', 'desc')
                    // .limit(1)
                    .then(function (rows) {
                        if (_.isEmpty(rows)) {
                            callback({error: false, message: 'Success', type: 'all', data: {}});
                        }
                        else {
                            _.each(rows, function (item, k) {
                                rows[k].event_start_time = moment(rows[k].event_start_time).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss');
                                rows[k].evnt_src = 0;
                                rows[k].is_prematch = 1;
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
};