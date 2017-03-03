/**
 * Created by Mark Sarukhanov on 22.11.2016.
 */

module.exports = function (app, knex, wait, moment) {

    var currHour = moment().hour();
    var today = moment().subtract(currHour < 6 ? 1 : 0, 'days').format("YYYY-MM-DD");
    var tomorrow = moment().add(currHour < 6 ? 0 : 1, 'days').format("YYYY-MM-DD");
    var collector = require('../handler')(knex);

    return {
        regRoutes: function () {
            var _this = this;

            BetOfficeRoute(app, 'finance', function (req, res, currentUser) {
                _this.user.finance(req, res, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            BetOfficeRoute(app, 'games', function (req, res, currentUser) {
                _this.user.games(req, res, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            BetOfficeRoute(app, 'other', function (req, res, currentUser) {
                _this.user.other(req, res, currentUser, function (callback) {
                    res.send(callback).end();
                });
            });

            BetOfficeRoute(app, 'kassas', function (req, res, currentUser) {
                var fr_id;
                _this.user.kassas(req, res, currentUser.user_id, function (callback) {
                    res.send(callback).end();
                });
            });

        },

        user: {

            finance: function (req, res, user_info, callback) {

                var allow_date_filter = true;

                var dt_select = allow_date_filter == true ? req.body.dt_from + ' 06:00:00' : today + ' 06:00:00';

                var sort_type = req.body.sort_type != undefined ? req.body.sort_type : 'ASC';
                var sort_by = req.body.sort_by != undefined ? req.body.sort_by : 's_users.kassa_id';

                var query = knex('s_acc_days');
                query.select('s_acc_days.user_id', 's_acc_days.s_summa', 's_acc_days.e_summa', 's_acc_days.dt', 's_users.username', 's_users.terminal_limit', 's_users.kassa_id', 's_users.user_type');
                query.where('s_acc_days.user_id', user_info.user_id);
                query.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id');
                query.where('s_acc_days.dt', dt_select).orderBy(sort_by, sort_type)
                    .then(function (rows) {
                        if (_.isEmpty(rows))
                            callback({error: false, message: 'Success', type: req.body.list, data: []});
                        else {
                            collector.init(req.body, rows, allow_date_filter, user_info, function (response) {
                                var endofeach = response.data.length;
                                if (endofeach == 0) {
                                    callback({
                                        error: false,
                                        message: 'Success',
                                        type: req.body.list,
                                        allow_date_filter: allow_date_filter,
                                        data: response
                                    });
                                    return;
                                }
                                var balance = 0;
                                _.each(response.data, function (d, i) {
                                    if (i + 1 == endofeach) {
                                        balance += d.e_summa;
                                        response.total.total_balance = balance;
                                        callback({
                                            error: false,
                                            message: 'Success',
                                            type: req.body.list,
                                            allow_date_filter: allow_date_filter,
                                            data: response
                                        });
                                    } else {
                                        balance += d.e_summa;
                                        response.total.total_balance = balance;
                                    }
                                });
                            });
                        }
                    }, function (error) {
                        cbError(error, callback)
                    });
            },

            games: function (req, res, user_info, callback) {

                var now = moment.utc();
                var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
                var current_offset = moment.tz.zone(user_info.agent_timezone).offset(now);
                var timezoneDifference = (tz_offset - current_offset) / 60;

                var tbl_name;
                var limit = 15;
                var offset = req.body.offset != undefined ? parseInt(req.body.offset) : 0;
                var sort_type = req.body.sort_type != undefined ? req.body.sort_type : 'desc';
                var sort_by = req.body.sort_by != undefined ? req.body.sort_by : 'dt';

                var transformedTill = moment(req.body.dt_till).add(1, 'days').format("YYYY-MM-DD");

                var allow_date_filter = true;
                var tempDTfrom = req.body.dt_from;

                var dt_select = [tempDTfrom + ' 06:00:00', transformedTill + ' 05:59:59'];

                function startGetBet(type) {
                    var dateSelector = 'dt';
                    var userSelector = type == 'payout' ? 'paid_user_id' : 'user_id';

                    switch (req.body.type) {
                        case 'dogs':
                            tbl_name = 's_stakes_d';
                            break;
                        case 'horses':
                            tbl_name = 's_stakes_h';
                            break;
                        case 'keno':
                            tbl_name = 's_stakes_k';
                            break;
                        case 'kaboom':
                            tbl_name = 's_stakes_kb';
                            break;
                        case 'sports':
                            tbl_name = 's_prestakes';
                            break;
                        case 'five':
                            tbl_name = 's_stakes_fv';
                            break;
                        case 'wof':
                            tbl_name = 's_stakes_wof';
                            break;
                    }
                    var qry = knex(tbl_name).orderBy(sort_by, sort_type).where('is_header', 1).limit(limit).offset(offset);
                    if (req.body.user_id && req.body.user_id != '') qry.where(userSelector, req.body.user_id);
                    qry.where(userSelector, user_info.user_id);
                    if (type == 'payout') dateSelector = 'vdt';
                    if (type == 'debt') {
                        var tempDTfrom = moment().subtract(3, "days").format("YYYY-MM-DD");
                        var transformedTill = moment().add(1, "days").format("YYYY-MM-DD");
                        qry.where({user_id: req.body.user_id, vyd: 0}).whereIn('ststatus', [1, 2]);
                        qry.whereBetween(dateSelector, dt_select);
                    }
                    else {
                        qry.whereBetween(dateSelector, dt_select);
                    }
                    qry.then(function (row) {
                        if (_.isEmpty(row)) {
                            callback({error: false, message: 'Success', type: 'all', data: []});
                        }
                        else {
                            var plucked = _.pluck(row, type == 'payout' ? 'paid_sum' : 'package_sum');
                            var sum = _.reduce(plucked, function (memo, num) {
                                return memo + num;
                            }, 0);
                            var data = {
                                result: row,
                                count: {total: row.length, sum: sum}
                            };
                            _.each(data.result, function (item, key) {
                                var dates = ['dt', 'vdt', 'pdt', 'event_start_date_time', 'expiration_date'];
                                _.each(dates, function (value, key1) {
                                    if (data.result[key][value] != null) (data.result[key][value] = moment(data.result[key][value]).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss'));
                                });
                            });
                            callback({
                                error: false,
                                message: 'success',
                                allow_date_filter: allow_date_filter,
                                data: data
                            });
                        }
                    }, function (error) { cbError(error, callback) })
                }

                switch (req.body.what) {
                    case 'bet':
                        startGetBet('bet');
                        break;
                    case 'payout':
                        startGetBet('payout');
                        break;
                    case 'debt':
                        startGetBet('debt');
                        break;
                    case 'results':
                        switch (req.body.type) {
                            case 'sports':
                                tbl_name = 's_event_scores';
                                break;
                            case 'dogs':
                                tbl_name = 's_races_dogs';
                                break;
                            case 'horses':
                                tbl_name = 's_races_horse';
                                break;
                            case 'keno':
                                tbl_name = 's_draws_keno';
                                break;
                            case 'kaboom':
                                tbl_name = 's_draws_kaboom';
                                break;
                            case 'five':
                                tbl_name = 's_draws_five';
                                break;
                            case 'wof':
                                tbl_name = 's_draws_wof';
                                break;
                        }
                        if (req.body.type != 'sports') {
                            transformedTill = moment(req.body.dt_from).add(1, 'days').format("YYYY-MM-DD");
                            knex(tbl_name)
                                .select('*')
                                .whereNot({rdt: '0000-00-00 00:00:00'})
                                .whereBetween('dt', dt_select)
                                .orderBy(sort_by, sort_type)
                                .then(function (rows) {
                                    if (_.isEmpty(rows)) {
                                        callback({
                                            error: false,
                                            message: 'Success',
                                            type: 'all',
                                            allow_date_filter: allow_date_filter,
                                            data: []
                                        });
                                    }
                                    else {
                                        if (req.body.type == "dogs" || req.body.type == "horses") {
                                            _.each(rows, function (row) {
                                                row.r = [row.r1, row.r2, row.r3].join();
                                            })
                                        }
                                        _.each(rows, function (item, key) {
                                            var dates = ['dt', 'vdt', 'pdt', 'event_start_date_time', 'expiration_date', 'event_start_time'];
                                            _.each(dates, function (value, key1) {
                                                if (rows[key][value] != null) (rows[key][value] = moment(rows[key][value]).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss'));
                                            });
                                            var temp = {
                                                info: JSON.parse(JSON.stringify(item))
                                            };
                                            temp.info.r = item.r.replace(/,/g, ", ");
                                            rows[key] = {
                                                info: temp.info
                                            };
                                        });

                                        callback({
                                            error: false,
                                            message: 'success',
                                            allow_date_filter: allow_date_filter,
                                            data: rows
                                        });
                                    }
                                }, function (error) {
                                    cbError(error, callback)
                                });
                        }
                        else {
                            sort_type = 'asc';
                            var sort_by1 = 'sport_name';
                            var sort_by2 = 'competition_name';
                            var sort_by3 = 'event_start_time';
                            knex('obs.pre_event')
                                .select('*')
                                .leftJoin('obs.pre_competition', 'obs.pre_competition.competition_id', 'obs.pre_event.competition_id')
                                .leftJoin('obs.pre_sport', 'obs.pre_sport.sport_id', 'obs.pre_event.sport_id')
                                .whereBetween('event_start_time', dt_select)
                                .orderBy(sort_by1, sort_type).orderBy(sort_by2, sort_type).orderBy(sort_by3, sort_type)
                                .then(function (rows) {
                                    var events = rows;
                                    if (_.isEmpty(rows)) {
                                        callback({
                                            error: false,
                                            message: 'Success',
                                            type: 'all',
                                            allow_date_filter: allow_date_filter,
                                            data: []
                                        });
                                    }
                                    else {
                                        var eventIds = _.map(events, function (item) {
                                            return item.event_id;
                                        });
                                        knex('s_event_scores')
                                            .whereIn('event_id', eventIds)
                                            .then(function (scores) {
                                                var eventsWithResults = [];
                                                _.each(events, function (preStake) {
                                                    var eventScore = _.find(scores, function (item) {
                                                        return (item.event_id == preStake.event_id);
                                                    });
                                                    if (eventScore != null) {
                                                        preStake.eventScore = eventScore.score;
                                                        eventsWithResults.push(preStake);
                                                    }
                                                });
                                                var temp_timezone;
                                                switch (user_info.user_country) {
                                                    case 'TANZANIA':
                                                        temp_timezone = "Africa/Dar_es_Salaam";
                                                        break;
                                                    case 'DR CONGO':
                                                    case 'DR CONGO II':
                                                    case 'NIGERIA':
                                                        temp_timezone = "Africa/Kinshasa";
                                                        break;
                                                }
                                                var now = moment.utc();
                                                var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
                                                var current_offset = moment.tz.zone(temp_timezone).offset(now);
                                                var timezoneDifference = (tz_offset - current_offset) / 60;
                                                _.each(eventsWithResults, function (item, key) {
                                                    var dates = ['event_start_time'];
                                                    _.each(dates, function (value, key1) {
                                                        if (eventsWithResults[key][value] != null) (eventsWithResults[key][value] = moment(eventsWithResults[key][value]).add(timezoneDifference, 'hours').format('MM-DD HH:mm'));
                                                    });
                                                });
                                                callback({
                                                    error: false,
                                                    message: 'success',
                                                    allow_date_filter: allow_date_filter,
                                                    data: eventsWithResults
                                                });
                                            });

                                    }
                                }, function (error) {
                                    cbError(error, callback)
                                });
                        }
                        break;
                }
            },

            other: function (req, res, user_info, callback) {
                var now = moment.utc();
                var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
                var current_offset = moment.tz.zone(user_info.agent_timezone).offset(now);
                var timezoneDifference = (tz_offset - current_offset) / 60;

                var tbl_name;
                var limit = req.body.limit != undefined ? parseInt(req.body.limit) : 10;
                var offset = req.body.offset != undefined ? parseInt(req.body.offset) : 0;
                var sort_type = req.body.sort_type != undefined ? req.body.sort_type : 'desc';
                var sort_by = req.body.sort_by != undefined ? req.body.sort_by : 'dt';

                var transformedTill = moment(req.body.dt_till).add(1, 'days').format("YYYY-MM-DD");

                var allow_date_filter = false;
                var tempDTfrom = req.body.dt_from;

                var dt_select = [tempDTfrom + ' 06:00:00', transformedTill + ' 05:59:59'];

                function startGetBet(type) {
                    var dateSelector = 's_acc_transactions.dt';

                    function proceedBet(qry) {
                        qry.select(['s_acc_transactions.*', 's_users.username']);
                        qry.leftJoin('s_users', 's_users.user_id', 's_acc_transactions.user_id');
                        qry.whereBetween(dateSelector, dt_select);
                        qry.then(function (row) {
                            if (_.isEmpty(row)) {
                                callback({error: false, message: 'Success', type: 'all', data: []});
                            }
                            else {
                                var plucked = _.pluck(row, 'package_sum');
                                var sum = _.reduce(plucked, function (memo, num) {
                                    return memo + num;
                                }, 0);
                                var data = {
                                    result: row,
                                    count: {total: row.length, sum: sum}
                                };
                                _.each(data.result, function (item, key) {
                                    data.result[key]['descr'] = getDescriptionPrefix(data.result[key].type) + ': ' + data.result[key]['descr'];
                                    var dates = ['dt', 'vdt', 'pdt', 'event_start_date_time', 'expiration_date'];
                                    _.each(dates, function (value, key1) {
                                        if (data.result[key][value] != null) (data.result[key][value] = moment(data.result[key][value]).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss'));
                                    });
                                });
                                callback({
                                    error: false,
                                    message: 'success',
                                    allow_date_filter: allow_date_filter,
                                    data: data
                                });
                            }
                        }, function (error) {
                            cbError(error, callback)
                        })
                    }

                    var qry = knex('s_acc_transactions').orderBy(sort_by, sort_type).limit(limit).offset(offset);

                    if (req.body.user_id && req.body.user_id != '' && 'string' == (typeof req.body.user_id) && req.body.user_id.indexOf("ALL:") == -1) qry.where('s_acc_transactions.user_id', req.body.user_id);
                    if (req.body.user_id) {
                        if (req.body.user_id && req.body.user_id != '' && 'string' == (typeof req.body.user_id) && req.body.user_id.indexOf("ALL:") > -1) {
                            var arrr = req.body.user_id.replace("ALL:", "").split(",");
                            qry.whereIn('s_acc_transactions.user_id', arrr);
                        }
                        else {
                            qry.where('s_acc_transactions.user_id', req.body.user_id);
                        }
                    }
                    qry.where('s_acc_transactions.user_id', user_info.user_id);
                    proceedBet(qry);
                }

                startGetBet('bet');
            },

            kassas: function (req, res, user_id, callback) {
                var query = knex('s_users');
                query.select('user_id', 'username', 'kassa_id', 'kassa_title')
                    .where({user_id: user_id})
                    .then(function (rows) {
                        var grouped = _.groupBy(rows, function (elems) {
                            return elems.kassa_id;
                        });
                        callback({error: false, message: 'success', data: grouped});
                    }, function (error) {
                        cbError(error, callback)
                    });
            }

        }

    }
};