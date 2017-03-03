/**
 * Created by xgharibyan on 4/3/15.
 */
var md5 = require('MD5');
var redisRequests = require('./redisRequests');
var generators = require('./generators');
var moment = require('moment-timezone');
var knex = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.NODE_ENV ? 'localhost' : 'db.betunit.com',
		user: 'dev',//root
		password: '7up4tune',//
		database: 'betoffice',
		debug: false,
		typeCast: function (field, next) {
			// handle only BIT(1)
			if (field.type == "BIT" && field.length == 1) {
				var bit = field.string();

				var b = (bit === null) ? null : bit.charCodeAt(0);
				return !!b;
			}

			// handle everything else as default
			return next();
		},
		pool: {
			min: 0,
			max: 10
		}
	}
});
var momentTZ = require('moment-timezone');

var knexLocal = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.NODE_ENV ? 'localhost' : 'db.betunit.com',
		user: 'dev',//root
		password: '7up4tune',//
		database: 'betoffice',
		debug: false,
		pool: {
			min: 0,
			max: 10
		}
	}
});

var knexWebsite = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.NODE_ENV ? 'localhost' : 'db.betunit.com',
		user: 'dev',
		password: '7up4tune',
		database: 'gambling',
		debug: false
	}
});

var knexOBS = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.NODE_ENV ? 'localhost' : 'db.betunit.com',
		user: 'dev',//root
		password: '7up4tune',//
		database: 'obs',
		debug: false,
		pool: {
			min: 0,
			max: 10
		}
	}
});

var knexLIVE = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.NODE_ENV ? 'localhost' : 'db.betunit.com',
		user: 'dev',//root
		password: '7up4tune',//
		database: 'obs.paddypower',
		debug: false,
		pool: {
			min: 0,
			max: 10
		}
	}
});


var wait = require('wait.for');
var Prematch = require('./helpers/prematch')(knex, knexOBS, knexLocal, knexLIVE, wait, moment);
var PlaceBet = require('./helpers/placeBet')(knex, knexOBS, knexLocal, knexLIVE, wait, moment);
var GameBet = require('./helpers/gameBet')(knex, knexOBS, knexLocal, knexLIVE, wait, moment);
var PayBet = require('./helpers/payBet')(knex, knexOBS, knexLocal, knexLIVE, wait, moment);
var BS = require('./helpers/bettingService')(knex, knexOBS, knexLocal, knexLIVE, wait, moment);

var Promise = require('bluebird');
var currHour = moment().hour();

var today = moment().add(currHour < 6 ? 0 : 1).format("YYYY-MM-DD");
var tomorrow = moment().add(currHour < 6 ? 0 : 1, 'days').format("YYYY-MM-DD");
var collector = require('./handler')(knex);

function userToRedis(user, cookieExpireTime, callback) {
	redisRequests.SetterEx(user.user_token, cookieExpireTime, user, function (result) {
		if (result.error != true) {
			var allow_use_settings = user.user_level == 1;
			callback({
				error: false,
				message: 'Success',
				allow_use_settings: allow_use_settings,
				data: _.pick(user, 'user_token', 'username', 'agent_timezone', 'user_country', 'user_language')
			});
		}
		else {
			callback({error: true, message: 'Error', error_code: 'Red_1'});
		}
	});
}

module.exports = {

	signIn: function (req, res, callback) {
		knex('s_users').select('*')
			.where({
				username: req.body.username,
				user_password: md5(req.body.password)
			})
			.catch(function (error) {
				console.error(error)
			})
			.then(function (rows) {
				if (_.isEmpty(rows)) {
					callback({error: true, message: 'Email or Password is Wrong', data: null})
				}
				else {
					rows[0].user_token = generators.tokenGenerator(rows[0].user_id);
					var cookieExpireTime = 30000; // seconds
					if(rows[0].kassa_id > 0) {
						knex('s_users').select('user_id')
							.where({
								kassa_id : rows[0].kassa_id
							})
							.catch(function (error) {
								console.error(error)
							})
							.then(function (siblings) {
								if (_.isEmpty(siblings)) {
									callback({error: true, message: 'Email or Password is Wrong', data: null})
								}
								else {
									rows[0].siblings = siblings;
									userToRedis(rows[0], cookieExpireTime, callback)
								}
							});
					}
					else {
						userToRedis(rows[0], cookieExpireTime, callback)
					}
				}
			});
	},

	getConfig: function (req, res, formData, callback) {
		knex('global_settings').select('*')
			.catch(function (error) {
				console.error(error)
			})
			.then(function (rows) {
				if (_.isEmpty(rows)) {
					callback({error: true, message: 'Database error', data: null})
				}
				else {
					var globalSettings = _.groupBy(rows, function(setting) {return setting.setting_name});
					globalSettings = _.each(globalSettings, function(setting, key) {
						globalSettings[key] = setting[0].setting_value;
					});

					var response = {
						error: false,
						settings: {
							ExchangeRate: Number(globalSettings['ExchangeRate.'+formData.currency]),
							Tax: Number(globalSettings['Tax.'+formData.country]),
							BonusType: Number(globalSettings['BonusType.'+formData.country]),
							GameBonusType: Number(globalSettings['GameBonusType.'+formData.country]),
							MinAmount: Number(globalSettings['MinStakeAmount.'+formData.country]),
							MaxAmount: Number(globalSettings['MaxStakeAmount.'+formData.country]),
							MaxWinSum: Number(globalSettings['MaxWinSum.'+formData.country]),
							TermAllowOrdinars: globalSettings['TermAllowOrdinars.'+formData.country] != '0'
						}
					};
					callback({error: false, message: 'Database error', data: response});
				}
			});
	},

	getBalanceLimit: function(req, res, user_id, cassa_id, type, callback) {
		knex.select('e_summa').from('s_acc_days').where({user_id: user_id}).orderBy('dt', 'desc').limit(1)
			.catch(function (error) {
				console.error(error)
			})
			.then(function (rows){
				var data = {
					balance : rows[0].e_summa,
					limit : '∞'
				};
				switch (type) {
					case 'kassa' :
					case 'SHOP' :
						callback({
							error: false,
							message: 'Success',
							data: data
						});
						break;
					case 'franchise' : // .orderBy('date', 'desc').limit(1)
						knex.select('amount_limit')
							.from('s_cashbox')
							.where({id: cassa_id}).limit(1)
							.catch(function (error) {
								console.error(error)
							})
							.then(function (rows){
								if(rows[0]) data.limit = rows[0].amount_limit;
								else data.limit = 0;
								callback({
									error: false,
									message: 'Success',
									data: data
								});
							});
						break;
					case 'terminal' :
						knex.select('terminal_limit', 'terminal_revenue').from('s_users')
							.where({user_id: user_id})
							.catch(function (error) {
								console.error(error)
							})
							.then(function (rows){
								if(rows[0]) {
									data.limit = rows[0].terminal_limit;
									data.revenue = rows[0].terminal_revenue;
								}
								else data.limit = 0;
								callback({
									error: false,
									message: 'Success',
									data: data
								});
							});
						break;
				}
			})
	},

	games: function (req, res, user_info, callback) {

		var now = moment.utc();
		var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
		var current_offset = moment.tz.zone(user_info.timezone).offset(now);
		var timezoneDifference = (tz_offset - current_offset)/60;

		var tbl_name;
		var limit = req.body.limit != undefined ? parseInt(req.body.limit) : 10;
		var offset = req.body.offset != undefined ? parseInt(req.body.offset) : 0;
		var sort_type = req.body.sort_type != undefined ? req.body.sort_type : 'desc';
		var sort_by = req.body.sort_by != undefined ? req.body.sort_by : 'dt';

		var transformedTill = moment(req.body.dt_till).add(1, 'days').format("YYYY-MM-DD");

		var allow_date_filter = user_info.user_level == 1 || user_info.user_type == 'FRANCHISE_OWNER' || user_info.user_type == 'REGION_MANAGER' || user_info.user_type == 'COUNTRY_MANAGER' ? true : false;
		var tempDTfrom = req.body.dt_from;
		if(user_info.user_type == 'FRANCHISE_OWNER') {
			var newTime = new Date(), oldTime = new Date(req.body.dt_from);
			var franchiseTime = (2 * 24 * 60 * 60 * 1000); // 7 days
			if(newTime.getTime() - oldTime.getTime() > franchiseTime) {
				var tempTime = new Date(newTime.setTime(newTime.getTime() - franchiseTime));
				tempDTfrom = tempTime.toISOString().slice(0,10);
			}
		}
		var dt_select = allow_date_filter == true ? [tempDTfrom + ' 06:00:00', transformedTill + ' 05:59:59'] : [today + ' 06:00:00', tomorrow + ' 05:59:59'];
		function startGetBet(type) {
			var dateSelector = 'dt';
			var userSelector = type == 'bet' ? 'user_id': 'paid_user_id';
			function proceedBet(qry, isOther) {
				if(user_info.user_type == 'REGION_MANAGER') {
					isOther = true;
				}
				if(type == 'payout' && !isOther)  dateSelector = 'vdt';
				if(user_info.user_type == 'FRANCHISE_OWNER' && isOther) {
					var newTime = new Date(), oldTime = new Date(req.body.dt_from);
					tempDTfrom = req.body.dt_from;
					var franchiseTime = (60 * 24 * 60 * 60 * 1000); // 60 days
					if(newTime.getTime() - oldTime.getTime() > franchiseTime) {
						var tempTime = new Date(newTime.setTime(newTime.getTime() - franchiseTime));
						tempDTfrom = tempTime.toISOString().slice(0,10);
					}
					dt_select = allow_date_filter == true ? [tempDTfrom + ' 06:00:00', transformedTill + ' 05:59:59'] : [today + ' 06:00:00', tomorrow + ' 05:59:59']
				}
				qry.whereBetween(dateSelector, dt_select);
				qry
					.catch(function (error) {
						console.error(error);
						callback({
							error: true,
							message: 'Query Error',
							data: error,
							error_code: 'err_' + error.code
						});
					})
					.then(function (row) {
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
							_.each(data.result, function(item, key) {
								var dates = ['dt', 'vdt', 'pdt', 'event_start_date_time', 'expiration_date'];
								_.each(dates, function(value, key1){
									if(data.result[key][value] != null) (data.result[key][value] = moment(data.result[key][value] ).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss'));
								});
							});
							callback({
								error: false,
								message: 'success',
								allow_date_filter: allow_date_filter,
								data: data
							});
						}
					})
			}
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
				case 'other':
					tbl_name = 's_acc_transactions';
					break;
			}
			if(user_info.user_type == "REGION_MANAGER") {
				tbl_name = 's_acc_transactions';
				req.body.type = 'other';
			}
			if(req.body.type != 'other') {
				var qry = knex(tbl_name).orderBy(sort_by, sort_type).groupBy('package_id').limit(limit);
				if (user_info.user_type == "FRANCHISE_OWNER") {
					knex('s_users').select('*').where({user_type: 'FRANCHISE', franchise_id : user_info.franchise_id})
						.then(function (franchises){
							if (req.body.user_id && req.body.user_id != '') qry.where(userSelector, req.body.user_id);
							else qry.whereIn(userSelector, _.pluck(franchises, 'user_id'));
							proceedBet(qry, false);
						});

				}
				else if (user_info.user_type == "COUNTRY_MANAGER") {
					knex('s_users').select('*').where({user_country : user_info.user_country})
						.then(function (franchises){
							if (req.body.user_id && req.body.user_id != '') qry.where(userSelector, req.body.user_id);
							else qry.whereIn(userSelector, _.pluck(franchises, 'user_id'));
							proceedBet(qry, false);
						});

				}
				else {
					if (req.body.user_id && req.body.user_id != '') qry.where(userSelector, req.body.user_id);
					if (user_info.user_type == "terminal" || user_info.user_type == "SHOP" || user_info.user_type == "franchise") qry.where(userSelector, user_info.user_id);
					proceedBet(qry, false);
				}
			}
			else {
				var qry = knex(tbl_name).orderBy(sort_by, sort_type).limit(limit);
				if (req.body.user_id && req.body.user_id != '') qry.where('user_id', req.body.user_id);
				if (user_info.user_type == "FRANCHISE_OWNER") {
					knex('s_users').select('*').where({user_type: 'FRANCHISE', franchise_id : user_info.franchise_id})
						.then(function (franchises) {
							if (req.body.user_id && req.body.user_id != '') qry.where('user_id', req.body.user_id);
							else qry.whereIn('user_id', _.pluck(franchises, 'user_id'));
							proceedBet(qry, true);
						})
				}
				else if (user_info.user_type == "COUNTRY_MANAGER") {
					knex('s_users').select('*').where({user_country : user_info.user_country})
						.then(function (franchises) {
							if (req.body.user_id && req.body.user_id != '') qry.where('user_id', req.body.user_id);
							else qry.whereIn('user_id', _.pluck(franchises, 'user_id'));
							proceedBet(qry, true);
						})
				}
				else if(user_info.user_type == "REGION_MANAGER") {
					knex('s_users').select('*').where({region_id: 1}).whereNot({user_type : "REGION_MANAGER"})
						.then(function (kassas) {
							if (req.body.user_id && req.body.user_id != '') qry.where('user_id', req.body.user_id);
							else qry.whereIn('user_id', _.pluck(kassas, 'user_id'));
							proceedBet(qry, true);
						})
				}
				else {
					if(user_info.user_type == "terminal" || user_info.user_type == "SHOP" || user_info.user_type == "franchise") {
						qry.where({user_id: user_info.user_id});
					}
					proceedBet(qry, true);
				}
			}
		}
		switch (req.body.what) {
			case 'bet':
				startGetBet('bet');
				break;
			case 'payout':
				startGetBet('payout');
				break;
			case 'results':
				switch (req.body.type) {
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
				}
				if(req.body.type!='sports') {
					knex(tbl_name).select('*')
						.whereNot({rdt: '0000-00-00 00:00:00'})
						.whereBetween('dt', dt_select)
						.limit(limit)
						.offset(offset)
						.orderBy(sort_by, sort_type)
						.catch(function (error) {
							console.error(error);
							callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
						})
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
								if(req.body.type == "dogs" || req.body.type == "horses") {
									_.each(rows, function(row) {
										row.r = [row.r1,row.r2,row.r3].join();
									})
								}
								_.each(rows, function(item, key) {
									var dates = ['dt', 'vdt', 'pdt', 'event_start_date_time', 'expiration_date'];
									_.each(dates, function(value, key1){
										if(rows[key][value] != null) (rows[key][value] = moment(rows[key][value] ).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss'));
									});
								});
								callback({
									error: false,
									message: 'success',
									allow_date_filter: allow_date_filter,
									data: rows
								});
							}
						});
				}
				else {
					callback({
						error: false,
						message: 'Success',
						type: 'all',
						allow_date_filter: allow_date_filter,
						data: []
					});
				}
				break;
		}
	},

	finance: function (req, res, user_info, callback) {
		var _this = this;

		var allow_date_filter = user_info.user_level == 1 || user_info.user_type == 'FRANCHISE_OWNER' || user_info.user_type == 'REGION_MANAGER' || user_info.user_type == 'COUNTRY_MANAGER' ? true : false;

		if(user_info.user_type == 'FRANCHISE_OWNER') {
			var newTime = new Date(), oldTime = new Date(req.body.dt_from);
			var franchiseTime = (2 * 24 * 60 * 60 * 1000); // 7 days
			if(newTime.getTime() - oldTime.getTime() > franchiseTime) {
				var tempTime = new Date(newTime.setTime(newTime.getTime() - franchiseTime));
				req.body.dt_from = tempTime.toISOString().slice(0,10);
			}
		}

		var dt_select = allow_date_filter == true ? req.body.dt_from + ' 06:00:00' : today + ' 06:00:00';

		var limit = req.body.limit != undefined ? parseInt(req.body.limit) : 10;
		var offset = req.body.offset != undefined ? parseInt(req.body.offset) : 0;
		var sort_type = req.body.sort_type != undefined ? req.body.sort_type : 'desc';
		var sort_by = req.body.sort_by != undefined ? req.body.sort_by : 'dt';
		var query = knex('s_acc_days');

		query.select('s_acc_days.user_id', 's_acc_days.s_summa', 's_acc_days.e_summa', 's_acc_days.dt', 's_users.username');
		if (user_info.user_type == "FRANCHISE_OWNER") {
			knex('s_users').select('*').where({user_type: 'FRANCHISE', franchise_id : user_info.franchise_id})
				.then(function (franchises){
					query.whereIn('s_acc_days.user_id', _.pluck(franchises, 'user_id'));
					query.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id');
					query.where('s_acc_days.dt', dt_select)
						.orderBy(sort_by, sort_type)
						.catch(function (error) {
							console.error('err', error);
							callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
						})
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
									var newTime = new Date();
									req.body.dt_from = newTime.toISOString().slice(0,10);
									req.body.dt_till = req.body.dt_from;
									dt_select = today + ' 06:00:00';
									var tempQuery = knex('s_acc_days').select('s_acc_days.user_id', 's_acc_days.s_summa', 's_acc_days.e_summa', 's_acc_days.dt', 's_users.username')
													.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id').whereIn('s_acc_days.user_id', _.pluck(franchises, 'user_id'))
									tempQuery.where('s_acc_days.dt', dt_select).then(function (rows1) {
										collector.init(req.body, rows1, allow_date_filter, user_info, function (response1) {
											_.each(response1.data, function (d, i) {
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
													return;
												} else {
													balance += d.e_summa;
													response.total.total_balance = balance;
												}
											});
										});
									});
								});
							}
						});
				})
		}
		else if(user_info.user_type == "COUNTRY_MANAGER") {
			knex('s_users').select('*').where({user_country : user_info.user_country})
				.then(function (franchises){
					query.whereIn('s_acc_days.user_id', _.pluck(franchises, 'user_id'));
					query.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id');
					query.where('s_acc_days.dt', dt_select)
						.orderBy(sort_by, sort_type)
						.catch(function (error) {
							console.error('err', error);
							callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
						})
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
									var newTime = new Date();
									req.body.dt_from = newTime.toISOString().slice(0,10);
									req.body.dt_till = req.body.dt_from;
									dt_select = today + ' 06:00:00';
									var tempQuery = knex('s_acc_days').select('s_acc_days.user_id', 's_acc_days.s_summa', 's_acc_days.e_summa', 's_acc_days.dt', 's_users.username')
										.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id').whereIn('s_acc_days.user_id', _.pluck(franchises, 'user_id'))
									tempQuery.where('s_acc_days.dt', dt_select).then(function (rows1) {
										collector.init(req.body, rows1, allow_date_filter, user_info, function (response1) {
											_.each(response1.data, function (d, i) {
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
													return;
												} else {
													balance += d.e_summa;
													response.total.total_balance = balance;
												}
											});
										});
									});
								});
							}
						});
				})
		}
		else if(user_info.user_type == 'REGION_MANAGER') {
			knex('s_users').select('*').where({region_id: 1}).whereNot({user_type : "REGION_MANAGER"})
				.then(function (kassas) {
					query.whereIn('s_acc_days.user_id', _.pluck(kassas, 'user_id'));
					query.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id');
					query.where('s_acc_days.dt', dt_select)
						.orderBy(sort_by, sort_type)
						.catch(function (error) {
							console.error('err', error);
							callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
						})
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
									var newTime = new Date();
									req.body.dt_from = newTime.toISOString().slice(0,10);
									req.body.dt_till = req.body.dt_from;
									dt_select = today + ' 06:00:00';
									var tempQuery = knex('s_acc_days').select('s_acc_days.user_id', 's_acc_days.s_summa', 's_acc_days.e_summa', 's_acc_days.dt', 's_users.username')
										.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id').whereIn('s_acc_days.user_id', _.pluck(kassas, 'user_id'));
									tempQuery.where('s_acc_days.dt', dt_select).then(function (rows1) {
										collector.init(req.body, rows1, allow_date_filter, user_info, function (response1) {
											_.each(response1.data, function (d, i) {
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
													return;
												} else {
													balance += d.e_summa;
													response.total.total_balance = balance;
												}
											});
										});
									});
								});
							}
						});
				});
		}
		else if(user_info.user_type == "FRANCHISE") {
			if (user_info.user_level != 1) query.where('s_acc_days.user_id', user_info.user_id);
			query.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id');
			query.where('s_users.user_level', '=', 3);
			query.where('s_acc_days.dt', dt_select)
				//.limit(limit).offset(offset)
				.orderBy(sort_by, sort_type)
				.catch(function (error) {
					console.error('err', error);
					callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
				})
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
									return;
								} else {
									balance += d.e_summa;
									response.total.total_balance = balance;
								}
							});
						});
					}
				});
		}
		else {
			if (user_info.user_level != 1) query.where('s_acc_days.user_id', user_info.user_id);

			query.leftJoin('s_users', 's_acc_days.user_id', 's_users.user_id');
			//query.where('s_users.franchise_id', '<', 1);
			//query.where('s_users.user_level', '=', 3)
			query.where('s_acc_days.dt', dt_select)
				//.limit(limit).offset(offset)
				.orderBy(sort_by, sort_type)
				.catch(function (error) {
					console.error('err', error);
					callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
				})
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
									return;
								} else {
									balance += d.e_summa;
									response.total.total_balance = balance;
								}
							});
						});
					}
				});
		}
	},

	kassas: function (req, res, user_id, type, fr_id, callback) {
		var query = knex('s_users');

		if(type=="terminal" || type=="SHOP" || type == "franchise") {
			query.select('user_id', 'username', 'kassa_id', 'kassa_title').where({user_id: user_id})
				.catch(function (error) {
					console.error(error);
					callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
					return;
				})
				.then(function (rows) {
					var grouped = _.groupBy(rows, function (elems) {
						return elems.kassa_id;
					});
					callback({error: false, message: 'success', data: grouped});

				})
		}
		else if(type=="FRANCHISE_OWNER") {
			query.select('user_id', 'username', 'kassa_id', 'kassa_title')
				.where({user_type: 'FRANCHISE', franchise_id : fr_id})
				.catch(function (error) {
					console.error(error);
					callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
					return;
				})
				.then(function (rows) {
					rows.unshift({user_id: '', username: 'All', kassa_id: rows[0].kassa_id, kassa_title: ' '});
					var grouped = _.groupBy(rows, function (elems) {
						return elems.kassa_id;
					});
					callback({error: false, message: 'success', data: grouped, type: 'FRANCHISE_OWNER'});

				})
		}
		else if(type=="COUNTRY_MANAGER") {
			query.select('user_id', 'username', 'kassa_id', 'kassa_title')
				.where({user_country: fr_id})
				.catch(function (error) {
					console.error(error);
					callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
					return;
				})
				.then(function (rows) {
					rows.unshift({user_id: '', username: 'All', kassa_id: rows[0].kassa_id, kassa_title: ' '});
					var grouped = _.groupBy(rows, function (elems) {
						return elems.kassa_id;
					});
					callback({error: false, message: 'success', data: grouped, type: 'COUNTRY_MANAGER'});

				})
		}
		else if(type=="REGION_MANAGER") {
			query.select('user_id', 'username', 'kassa_id', 'kassa_title')
				.where({region_id: 1}).whereNot({user_type : "REGION_MANAGER"})
				.catch(function (error) {
					console.error(error);
					callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
					return;
				})
				.then(function (rows) {
					rows.unshift({user_id: '', username: 'All', kassa_id: rows[0].kassa_id, kassa_title: ' '});
					var grouped = _.groupBy(rows, function (elems) {
						return elems.kassa_id;
					});
					callback({error: false, message: 'success', data: grouped, type: 'FRANCHISE_OWNER'});

				})
		}
		else {
			query.select('user_id', 'username', 'kassa_id', 'kassa_title')
				.catch(function (error) {
					console.error(error);
					callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
					return;
				})
				.then(function (rows) {
					var grouped = _.groupBy(rows, function (elems) {
						return elems.kassa_id;
					});
					callback({error: false, message: 'success', data: grouped});

				})
		}

	},

	getBetByPackageId: function (req, userInfo, callback) {

		var now = moment.utc();
		var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
		var current_offset = moment.tz.zone(userInfo.agent_timezone).offset(now);
		var timezoneDifference = (tz_offset - current_offset)/60;

		var response = {
			success: true,
			betDetails: null,
			packageId: req.body.packageId,
			userId: userInfo.user_id,
			searchTerm: req.body.searchTerm,
			game_type: 'sport'
		};
		switch (req.body.game_type) {
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
		}
		var re = /\d+-(\w+?)(\d+)/i, m;
		if ((m = re.exec(req.body.packageId)) !== null) {
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}
		}
		if(!req.body.packageId){
			callback({error: true, message: 'input data error', data: []});
		}
		else{
			var splited = req.body.packageId.split("-"), isSibling, isValid = true;
			if(!userInfo.siblings || userInfo.siblings.length < 2) {
				if(splited[0] != userInfo.user_id) isValid = false;
			}
			else {
				isSibling = _.find(userInfo.siblings, function(sibling){
					return sibling.user_id == splited[0];
				});
				if(!isSibling) isValid = false;
			}
			if(splited.length>1 && !isValid && userInfo.user_type != "FRANCHISE_OWNER" && userInfo.user_type != "COUNTRY_MANAGER"  && userInfo.user_type != "ADMIN") {
				callback({error: true, message: 'Package not found', data: []});
			}
			else {
				response.searchTerm = response.searchTerm ? response.searchTerm : '';
				response.packageId = splited.length<2 ? userInfo.user_id + "-" + response.searchTerm + req.body.packageId : req.body.packageId;
				response.searchTerm = response.searchTerm ? response.searchTerm : req.body.packageId[0];
				wait.launchFiber(function () {
					var payBetService = PayBet.start();
					payBetService.getBetDetails(response);
					_.each(response.betDetails, function(item, key) {
						var dates = ['dt', 'vdt', 'pdt', 'event_start_date_time', 'expiration_date', 'calculateionDate'];
						_.each(dates, function(value, key1){
							if(response.betDetails[key][value] != null)
							{
								response.betDetails[key][value+'UTC'] = moment(response.betDetails[key][value] ).add(tz_offset/60, 'hours').format('YYYY-MM-DD HH:mm:ss')
								response.betDetails[key][value] = moment(response.betDetails[key][value] ).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss');
							}
						});
					});
					if(response.betDetails) {
						switch (response.game_type) {
							case 'sport':
								_.each(response.betDetails, function(item) {
									//item.dtUTC = moment(item.dt).format();
									//item.expiration_dateUTC = moment(item.expiration_date).format();
									//console.log("Sport date:",item.dt,", UTC:",item.dtUTC);

									item.dt = moment(item.dt).format("YYYY-MM-DD hh:mm");
									item.event_start_date = item.event_start_date_time;
									item.event_start_date_time = moment(item.event_start_date_time).format("MM-DD hh:mm");
									item.expiration_date = moment(item.expiration_date).format("YYYY-MM-DD hh:mm");
								});
								break;
							case 'keno':
							case 'kaboom':
							case 'five':
							case 'horses':
							case 'dogs':
								_.each(response.betDetails, function(item) {
									//item.dtUTC = new Date(item.dt).toISOString();
									//item.expiration_dateUTC = new Date(item.expiration_date).toISOString();;
									//console.log("Game date:",item.dt,", UTC:",item.dtUTC);

									item.dt = moment(item.dt).format("YYYY-MM-DD hh:mm");
									item.expiration_date = moment(item.expiration_date).format("YYYY-MM-DD hh:mm");
								});
								break;
						}

					}
					if(response.betDetails) if(response.betDetails.length>0) {
						callback(response);
					}
					else callback({error: true, message: 'Package not found', data: []});
				});
			}
		}
	},

	payOut: function (req, userId, type, userInfo, callback) {

		var response = {
			success: true,
			packageId: req.body.packageId,
			userId: userId
		};
		if(type == 'franchise') response.kassa_id = userInfo.kassa_id;
		if(!req.body.packageId){
			callback({error: false, message: 'success', data: null});
		}
		else{
			var splited = req.body.packageId.split("-"), isSibling, isValid = true;
			if(!userInfo.siblings || userInfo.siblings.length < 2) {
				if(splited[0] != userInfo.user_id) isValid = false;
			}
			else {
				isSibling = _.find(userInfo.siblings, function(sibling){
					return sibling.user_id == splited[0];
				});
				if(!isSibling) isValid = false;
			}
			if(splited.length>1 && !isValid && userInfo.user_type != "ADMIN") {
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

	cashOut: function (req, userId, type, userInfo, callback) {

		var response = {
			success: true,
			packageId: req.body.packageId,
			userId: userId
		};
		if(type == 'franchise') response.kassa_id = userInfo.kassa_id;
		if(!req.body.packageId){
			callback({error: false, message: 'success', data: null});
		}
		else{
			var splited = req.body.packageId.split("-"), isSibling, isValid = true;
			if(!userInfo.siblings || userInfo.siblings.length < 2) {
				if(splited[0] != userInfo.user_id) isValid = false;
			}
			else {
				isSibling = _.find(userInfo.siblings, function(sibling){
					return sibling.user_id == splited[0];
				});
				if(!isSibling) isValid = false;
			}
			if(splited.length>1 && !isValid && userInfo.user_type != "ADMIN") {
				callback({error: true, message: 'Cash out not available', data: []});
			}
			else {
				wait.launchFiber(function () {
					var payBetService = PayBet.start();

					var cashOutResult = payBetService.cashOut(response, type);

					callback({error: cashOutResult.validation.hasErrors, message: 'success', data: response});

				});
			}
		}
	},

	preMatch: function (req, userInfo, callback) {
		var now = moment.utc();
		var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
		var current_offset = moment.tz.zone(userInfo.agent_timezone).offset(now);
		var timezoneDifference = (tz_offset - current_offset)/60;
		wait.launchFiber(function () {
			var prematchService = Prematch.start(userInfo);
			prematchService.getAll(req, function (response) {
				_.each(response, function(sport, key1) {
					_.each(sport.competitions, function(competition, key2) {
						_.each(competition.events, function(event, key3) {
							if(event['event_start_time']!= null)
								(response[key1].competitions[key2].events[key3]['event_start_time'] =
									moment(response[key1].competitions[key2].events[key3]['event_start_time']).add(timezoneDifference, 'hours').format('YYYY-MM-DD HH:mm:ss'));
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
		}
		knex.from(tbl_name).select('*')
			.whereNot({rdt: '0000-00-00 00:00:00'})
			.limit(limit)
			.offset(offset)
			.orderBy(sort_by, sort_type)
			.catch(function (error) {
				console.error(error);
				callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
			})
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
		knex.from(tbl_name).select('*')
			.where({config_name: con_name})
			.limit(limit)
			.offset(offset)
			.catch(function (error) {
				console.log(error);
				callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
			})
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
		}
		knex.from(tbl_name).select('*')
			//.where('dt','>','now()')
			.where({rdt: '0000-00-00 00:00:00'})
			.limit(limit)
			.offset(offset)
			.orderBy(sort_by, sort_type)
			.catch(function (error) {
				console.log(error);
				callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
			})
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
			});
	},

	preMatchMarket: function (userInfo, eventId, marketId, callback) {
		wait.launchFiber(function () {
			var prematchService = Prematch.start(userInfo);
			prematchService.getMarketAndPriceByEventId(eventId, marketId, function (response) {
				callback(response);
			});
		});

	},

	searchPreMatchMarket: function (userInfo, shortCodeArr, callback) {
		wait.launchFiber(function () {
			var prematchService = Prematch.start(userInfo);
			prematchService.getMarketAndPriceByShortCode(shortCodeArr, function (response) {
				callback(response);
			});
		});

	},

	placeBet: function (bet, user_id, user_info, type, callback) {

		wait.launchFiber(function () {
			var placeBetService = PlaceBet.start();

			var response = {
				success: true,
				bet: bet
			};

			bet.user_id = user_id;

			if(user_info.user_type == "FRANCHISE") bet.cassa_id = user_info.kassa_id;

			var isValid = placeBetService.validateBet(bet, type, user_info);

			if (isValid) {
				placeBetService.placeBet(bet, user_info);
				response.bet = _.pick(response.bet, function(value, key, object) {
					return _.isObject(value);
				});
				_.each(response.bet.betSlips, function(betSlipTemp, i) {
					response.bet.betSlips[i] = _.pick(betSlipTemp, ['dt', 'expiration_date', 'market_name', 'price_name', 'package_id', 'package_sum', 'prm1', 'tax_percent', 'total_rate', 'bonus', 'bonus_percent', 'bonus_type', 'type', 'val', 'is_header']);
				});
				if(bet.validation.hasErrors == false) {
					var amount = bet.betType == 'multi' ? bet.multiStake : bet.totalAmount;
					placeBetService.updateUserBalance(bet.user_id, amount);
					if(type=='terminal') {
						placeBetService.updateLimit(bet.user_id, amount);
						placeBetService.updateTerminalIncome(bet.user_id, amount);
						placeBetService.updateTerminalRevenue(bet.user_id, user_info.user_country);
					}
					else if(type=='franchise') {
						placeBetService.updateFRLimit(user_info.kassa_id, amount);
					}
				}
			}

			callback(response);

		});
	},

	placeGameBet: function (bet, user_id, user_info, type, callback) {

		wait.launchFiber(function () {

			var gameBetService = GameBet.start();

			var response = {
				success: true,
				message: '',
				bet: bet
			};
			bet.user_id = user_id;
			if(user_info.user_type == "FRANCHISE") bet.cassa_id = user_info.kassa_id;
			var isValid = gameBetService.validateBet(bet, type, user_info);

			if (isValid) {
				gameBetService.placeBet(bet, user_info);
				response.bet = _.pick(response.bet, function(value, key, object) {
					return _.isObject(value);
				});
				if(bet.validation.hasErrors == false) {
					gameBetService.updateUserBalance(bet.user_id, bet.betTotalSum);
					if(type=='terminal') {
						gameBetService.updateLimit(bet.user_id, bet.betTotalSum);
						gameBetService.updateTerminalIncome(bet.user_id, bet.betTotalSum);
						gameBetService.updateTerminalRevenue(bet.user_id);
					}
					else if(type=='franchise') {
						gameBetService.updateFRLimit(user_info.kassa_id, bet.betTotalSum);
					}
				}
			}
			callback(response);
		});
	},

	financeIO: function (req, userId, type, callback) {

		//console.log(req.body, userId, type);

		var response = {
			success: true,
			amount: req.body.amount,
			description: req.body.description
		};
		if(!req.body.amount){
			callback({error: true, message: 'Amount not provided', data: []});
		}
		else{
			knex.raw('INSERT INTO s_acc_transactions (dt,user_id,`type`,amount,descr) VALUES (NOW(),"' + userId + '","'
				+ type+'","' + req.body.amount + '","' + req.body.description + '")')
				.catch(function (error) {
					console.log(error);
					callback({error: true, message: 'Query Error', data: error, error_code: 'err_' + error.code});
				})
				.then(function (result) {
					var tempAmount = type < 100 ? req.body.amount : (-1) * req.body.amount;
					knex('s_acc_days')
						.where({user_id: userId})
						.orderBy('dt', 'desc').limit(1)
						.then(function (rows){
							if(rows[0]) {
								knex('s_acc_days')
									.where({id: rows[0].id})
									.update({e_summa: rows[0].e_summa + tempAmount})
									.then(function (rows){
										callback(null, rows);
									});
							}
							else callback({error: true, message: 'Query Error', data: []});
						});
				});
		}

	},

	websiteUserInfo: function (req, type, userInfo, callback) {

		if(type == 'franchise' || type == 'shop') {
			knexWebsite('users').select('*')
				.where(function() {
					this.where('e_mail', req.body.user_info)
						.orWhere('username', req.body.user_info)
						.orWhere('id', req.body.user_info)
				})
				.catch(function (err) {
					console.log(err);
					callback({error: true, message: 'Query Error', error_code: 'err_' + err.code});
				})
				.then(function (rows) {
					if (_.isEmpty(rows)) {
						callback({error: false, message: 'No such user.', data: null})
					}
					else {
						if (rows[0].active == 0) {
							callback({error: true, message: 'Account is not yet activated. ' +
							'Please check you email for activation!', error_code: 'err_2'});
						}
						else {
							callback(rows[0]);
						}
					}
				});
		}
		else {
			callback({error: true, message: 'Permission denied', data: null});
		}
	},

	websiteInOut: function (req, type, userInfo, callback) {

		if(type == 'franchise' || type == 'shop') {
			knexWebsite('users').select('*')
				.where(function() {
					this.where('e_mail', req.body.user_info)
						.orWhere('username', req.body.user_info)
						.orWhere('id', req.body.user_info)
				})
				.catch(function (err) {
					console.log(err);
					callback({error: true, message: 'Query Error', error_code: 'err_' + err.code});
				})
				.then(function (rows) {
					if (_.isEmpty(rows)) {
						callback({error: false, message: 'No such user.', data: null})
					}
					else {
						if (rows[0].active == 0) {
							callback({error: true, message: 'Account is not yet activated. ' +
										'Please check you email for activation!', error_code: 'err_2'});
						}
						else {
							var tempUser = rows[0];
							var difference = req.body.type == 'in' ? req.body.amount : (-1)*req.body.amount ;
							knexWebsite.select('balance')
								.from('users').where({id: tempUser.id})
								.update({balance: tempUser.balance + Number(difference)})
								.then(function (rows){
									callback(null, rows);
								});
						}
					}
				});
		}
		else {
			callback({error: true, message: 'Permission denied', data: null});
		}
	},

	transactionInfo: function (req, type, userInfo, callback) {

		if(type == 'franchise' || type == 'shop') {
			knexWebsite('transactions').select('*')
				.where('token', req.body.transaction_token)
				.catch(function (err) {
					console.log(err);
					callback({error: true, message: 'Query Error', error_code: 'err_' + err.code});
				})
				.then(function (rows) {
					if (_.isEmpty(rows)) {
						callback({error: false, message: 'No such transaction.', data: null})
					}
					else {
						callback(rows[0]);
					}
				});
		}
		else {
			callback({error: true, message: 'Permission denied', data: null});
		}
	},

	transactionSucceed: function (req, type, userInfo, callback) {

		if(type == 'franchise' || type == 'shop') {
			knexWebsite.select('*')
				.from('transactions').where('id', req.body.transaction_id)
				.returning(['id','user_id','amount','status','op_type','currency','updated_at','created_at','reference_id','token'])
				.update({status: 'SUCCESS', updated_at: new Date()})
				.catch(function (err) {
					console.log(err);
					callback({error: true, message: 'Query Error', error_code: 'err_' + err.code});
				})
				.then(function (rows) {
					if (_.isEmpty(rows)) {
						callback({error: false, message: 'No such transaction.', data: null})
					}
					else {
						callback(rows[0]);
					}
				});
		}
		else {
			callback({error: true, message: 'Permission denied', data: null});
		}
	}

};

