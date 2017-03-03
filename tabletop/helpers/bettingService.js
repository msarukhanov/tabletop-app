/**
 * Created by Arthur on 11/13/2015.
 */
var moment = require('moment');
var configs = require('../../configs');

module.exports = function (knex, wait) {

	function asString(input) {
		return "'" + input + "'";
	}

	return {
		start: function () {

			knex.rawFetchSyncSingle = function (query) {
				function w(callback) {
					knex.raw(query)
						.then(function (response) {
							//console.log(query)
							//console.log('Single, Time:',begin.diff(moment(), 'seconds'))
							if(!response[0] && !response[0][0]) {
								callback(null, null);
							}
							else
								callback(null, response[0][0]);
						});
				}
				var begin = moment();
				return wait.for(w);
			};

			knex.rawFetchSyncRows = function (query) {
				function w(callback) {
					knex.raw(query)
						.then(function (response) {
							//console.log(query)
							//console.log('Rowset, Time:',begin.diff(moment(), 'seconds'))
							if(!response[0]) {
								callback(null, null);
							}
							else
								callback(null, response[0]);
						});
				}
				var begin = moment();
				return wait.for(w);
			};

/*			//configure sequalize
			var SEQ = require('sequelize');
			var env = process.env.NODE_ENV || 'development';
			var seqParams = {
				host: process.env.NODE_ENV ? 'localhost' : 'db.betunit.com',
				user: 'dev',//root
				password: '7up4tune'//
			};
			var sequelize = new SEQ('betoffice',
				seqParams.user, //dev  root
				seqParams.password,  // 7up4tune
				{
					host: seqParams.host, //'db.betunit.com', //db.betunit.com localhost
					dialect: 'mysql',
					logging: false,
					pool: {
						max: 5,
						min: 0,
						idle: 10000
					}
				});

			var noTimeStamps = {
				timestamps: false,
				freezeTableName: true
			};

			//sequalize modules
			var seqModels = {
				Block: sequelize.define('s_blocks', {
					blocked: SEQ.BOOLEAN,
					module_name: SEQ.STRING
				}, noTimeStamps),

				Limit: sequelize.define('s_limits', {
					limit_id: {
						type: SEQ.INTEGER,
						primaryKey: true
					},
					sport_id: SEQ.INTEGER,
					event_id: SEQ.INTEGER,
					market_id: SEQ.INTEGER,
					price_id: SEQ.STRING,
					active: SEQ.BOOLEAN,
					is_default: SEQ.BOOLEAN,
					evnt_src: SEQ.INTEGER(2),
					max_bet_limit: SEQ.DECIMAL,
					per_bet_limit: SEQ.DECIMAL
				}, noTimeStamps),

				LimitsStorage: sequelize.define('s_limits_storage', {
					prestake_storage_id: {
						type: SEQ.INTEGER,
						primaryKey: true
					},
					stake_sum: SEQ.DECIMAL,
					price_id: SEQ.STRING,
					evnt_src: SEQ.INTEGER
				}, noTimeStamps)
			};*/


			return {

				getGlobalSettings: function() {
					function fnAsync(callback){
						knex('global_settings').select('*')
							.then(function (rows){
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				// getBlocks: function () {
				// 	function getBlocksAsync(callback) {
				// 		seqModels.Block.findAll({
				// 			where: {cash_box_id: null, module_name: 'Live'}
				// 		}).then(function (result) {
				// 			callback(null, _.pluck(result, 'dataValues'));
				// 		});
				// 	}
                //
				// 	return wait.for(getBlocksAsync);
                //
				// },

				getBlocks: function () {
					return knex.rawFetchSyncRows("SELECT module_name,blocked FROM betoffice.s_blocks WHERE cash_box_id IS NULL AND module_name IN ('Live','Sport')");
				},

				getFranchisesByUserId: function (userId) {
					function getFranchisesUserIdAsync(callback) {
						knex('s_users')
							.join('s_cashbox', 's_users.kassa_id', '=', 's_cashbox.id')
							.join('s_franchises', 's_cashbox.franchise_id', '=', 's_franchises.id')
							.where('s_users.user_id', '=', userId)
							.select('s_users.user_id', 's_cashbox.amount_limit')
							.then(function (result) {
								callback(null, result);
							});
					}

					return wait.for(getFranchisesUserIdAsync);

				},

				saveBet: function (preStake) {
					function fnAsync(callback) {
						knex('s_prestakes')
							.insert(preStake)
							.then(function (result) {
								callback(null, result);
							});
					}

					return wait.for(fnAsync);

				},

				saveGameBet: function (tbl_name, preStake) {
					function fnAsync(callback) {
						knex(tbl_name)
							.insert(preStake)
							.then(function (result) {
								callback(null, result);
							});
					}
					return wait.for(fnAsync);
				},

				// getLiveLimits: function () {
				// 	function fnAsync(callback) {
				// 		seqModels.Limit.findAll({
				// 			where: {
				// 				evnt_src: {
				// 					$ne: 0
				// 				},
				// 				created: {$gt : new Date(new Date() - 2 * 60 * 60 * 1000)}
				// 			}
				// 		}).then(function (result) {
				// 			//console.log(_.pluck(result, 'dataValues'));
				// 			callback(null, _.pluck(result, 'dataValues'));
				// 		});
				// 	}
                //
				// 	return wait.for(fnAsync);
				// },

				getLiveLimits: function () {
					return knex.rawFetchSyncRows("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE evnt_src=2 AND created>DATE_SUB(NOW(),INTERVAL 3 HOUR)");
				},

				getLiveLimitsBoosted: function (events) {
					var eventsfilter = _.isEmpty(events) ? '':' OR event_id IN ('+events.join(',')+')';
					return knex.rawFetchSyncRows("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE evnt_src=2 AND (active=0"+eventsfilter+") AND created>DATE_SUB(NOW(),INTERVAL 3 HOUR)");
				},

				// getPreMatchLimits: function () {
				// 	function fnAsync(callback) {
				// 		seqModels.Limit.findAll({
				// 			where: {
				// 				evnt_src: 0,
				// 				created: {$gt : new Date(new Date() - 72 * 60 * 60 * 1000)}
				// 			}
				// 		}).then(function (result) {
                //
				// 			callback(null, _.pluck(result, 'dataValues'));
				// 		});
				// 	}
                //
				// 	return wait.for(fnAsync);
				// },

				// the very slow request because of tons of events 65000 approx
				getPreMatchLimits: function () {
					return knex.rawFetchSyncRows("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE evnt_src=0 AND created<DATE_SUB(NOW(),INTERVAL 72 HOUR)");
				},

				getPreMatchLimitsBoosted: function (events) {
					var eventsfilter = _.isEmpty(events) ? '':' OR event_id IN ('+events.join(',')+')';
					return knex.rawFetchSyncRows("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE evnt_src=0 AND (active=0"+eventsfilter+") AND created<DATE_SUB(NOW(),INTERVAL 72 HOUR)");
				},

				// getLimitsStorage: function (priceId, eventSource) {
				// 	function fnAsync(callback) {
				// 		seqModels.LimitsStorage.findOne({
				// 			where: {
				// 				evnt_src: eventSource,
				// 				price_id: priceId
				// 			}
				// 		}).then(function (result) {
				// 			if (result == null) {
				// 				callback(null, null);
				// 			} else {
				// 				callback(null, result.dataValues);
				// 			}
				// 		});
				// 	}
                //
				// 	return wait.for(fnAsync);
				// },

				getLimitsStorage: function (priceId, eventSource) {
					return knex.rawFetchSyncSingle("SELECT stake_sum,price_id,evnt_src FROM betoffice.s_limits_storage WHERE evnt_src="+eventSource + " AND price_id="+priceId);
				},

				// getLiveDefaultLimit: function () {
				// 	function fnAsync(callback) {
				// 		seqModels.Limit.findOne({
				// 			where: {
				// 				evnt_src: {
				// 					$ne: 0
				// 				},
				// 				is_default: true
				// 			}
				// 		}).then(function (result) {
				// 			callback(null, result.dataValues);
				// 		});
				// 	}
                //
				// 	return wait.for(fnAsync);
				// },

				getLiveDefaultLimit: function () {
					return knex.rawFetchSyncSingle("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE evnt_src=2 AND is_default=1");
				},

				// getPreDefaultLimit: function () {
				// 	function fnAsync(callback) {
				// 		seqModels.Limit.findOne({
				// 			where: {
				// 				evnt_src: 0,
				// 				is_default: true
				// 			}
				// 		}).then(function (result) {
                //
				// 			callback(null, result.dataValues);
				// 		});
				// 	}
                //
				// 	return wait.for(fnAsync);
                //
				// },

				getPreDefaultLimit: function () {
					return knex.rawFetchSyncSingle("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE evnt_src=0 AND is_default=1");
				},

				// getPreLimitByPriceRefId: function (priceRefId) {
                //
				// 	function fnAsync(callback) {
				// 		seqModels.Limit.findOne({
				// 			where: {
				// 				price_id: priceRefId,
				// 				active: false
				// 			}
				// 		}).then(function (result) {
				// 			if (result == null) {
				// 				callback(null, null);
				// 			} else {
				// 				callback(null, result.dataValues);
				// 			}
				// 		});
				// 	}
                //
				// 	return wait.for(fnAsync);
				// },

				getPreLimitByPriceRefId: function (priceRefId) {
					return knex.rawFetchSyncSingle("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE price_id="+priceRefId+" AND active=0");
				},

				getPrePrices: function (rfIds) {
					function fnAsync(callback) {
						knex('obs.pre_price')
							.whereIn('price_reference_id', rfIds)
							.then(function (result) {
								callback(null, result);
							});
					}

					return wait.for(fnAsync);

				},

				getLivePrices: function (priceId, eventSource, marketId, eventId) {
					function fnAsync(callback) {
						knex.raw('CALL GetLivePrices(' + priceId + ', ' + eventSource + ', ' + marketId + ', ' + eventId + ')')
							.then(function (result) {
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

				getPreInfoByPrice: function (priceId) {
					function fnAsync(callback) {
						knex.raw('select * from `obs`.pre_price WHERE price_reference_id = "' + priceId + '";')
							.then(function (response) {
								if(!response[0][0]) {
									console.log('Bad price_reference_id', priceId);
									callback(null, null);
								}
								else
									callback(null, response[0][0].market_id);
							})
					}

					return wait.for(fnAsync);
				},

				getLiveInfoByPrice: function (priceId) {
					function fnAsync(callback) {
						knex.raw('select * from `obs.paddypower`.price WHERE price_id = "' + priceId + '";')
							.then(function (response) {
								callback(null, response[0][0].market_id);
							})
					}

					return wait.for(fnAsync);
				},

				getLivePricesNew: function (priceId, marketId, eventId) {
					function fnAsync(callback) {
						knex.raw('select * from `obs.paddypower`.price WHERE event_id = ' + eventId + ' and price_id = ' + priceId + ' and market_id = ' + marketId +  ';')
							.then(function (response) {
								callback(null, response[0]);
							})
					}

					return wait.for(fnAsync);
				},

				liveEventCheck: function (priceId, marketId, eventId) {
					function fnAsync(callback) {
						knex.raw('select monitor_status from `obs.paddypower`.event WHERE event_id = ' + eventId +  ';')
							.then(function (response) {
								callback(null, response[0]);
							})
					}

					return wait.for(fnAsync);
				},

				liveMarketCheck: function (priceId, marketId, eventId) {
					function fnAsync(callback) {
						knex.raw('select market_status_id from `obs.paddypower`.market WHERE event_id = ' + eventId + ' and market_id = ' + marketId +  ';')
							.then(function (response) {
								callback(null, response[0]);
							})
					}

					return wait.for(fnAsync);
				},

				getStakeDetails: function (packageId, isOffline) {
					var procName = "PreStakesSearch_New";
					if(isOffline) procName = "PreStakesOfflineSearch";
					function fnAsync(callback) {
						knex.raw('CALL ' + procName + '(\'' + packageId + '\')')
							.then(function (result) {
								callback(null, result[0][0]);
							});
					}

					return wait.for(fnAsync);
				},

				getEventScores: function (eventIds) {
					function fnAsync(callback) {
						knex('s_event_scores')
							.whereIn('event_id', eventIds)
							.then(function (result) {
								callback(null, result);
							});
					}
					return wait.for(fnAsync);
				},

				getHorsesSearchResult: function (packageId) {
					function fnAsync(callback) {
						knex('s_stakes_h')
							.join('s_races_horse', 's_stakes_h.race', '=', 's_races_horse.id')
							.where('s_stakes_h.package_id', '=', packageId)
							.select('s_stakes_h.*')
							.then(function (result_stakes) {
								knex('s_stakes_h')
									.join('s_races_horse', 's_stakes_h.race', '=', 's_races_horse.id')
									.where('s_stakes_h.package_id', '=', packageId)
									.select('s_races_horse.*')
									.then(function (result_races) {

										var result = [];
										for (var i = 0; i < result_stakes.length; i++) {
											result.push({stake: result_stakes[i], race: result_races[i]});
										}

										callback(null, result);
									});
							});
					}
					return wait.for(fnAsync);
				},

				getDogsSearchResult: function (packageId) {
					function fnAsync(callback) {
						knex('s_stakes_d')
							.join('s_races_dogs', 's_stakes_d.race', '=', 's_races_dogs.id')
							.where('s_stakes_d.package_id', '=', packageId)
							.select('s_stakes_d.*')
							.then(function (result_stakes) {
								knex('s_stakes_d')
									.join('s_races_dogs', 's_stakes_d.race', '=', 's_races_dogs.id')
									.where('s_stakes_d.package_id', '=', packageId)
									.select('s_races_dogs.*')
									.then(function (result_races) {

										var result = [];
										for (var i = 0; i < result_stakes.length; i++) {
											result.push({stake: result_stakes[i], race: result_races[i]});
										}

										callback(null, result);
									});
							});
					}
					return wait.for(fnAsync);
				},

				getKenoSearchResult: function (packageId) {
					function fnAsync(callback) {
						knex('s_stakes_k')
							.join('s_draws_keno', 's_stakes_k.draw', '=', 's_draws_keno.id')
							.where('s_stakes_k.package_id', '=', packageId)
							.select('s_stakes_k.*')
							.then(function (result_stakes) {
								knex('s_stakes_k')
									.join('s_draws_keno', 's_stakes_k.draw', '=', 's_draws_keno.id')
									.where('s_stakes_k.package_id', '=', packageId)
									.select('s_draws_keno.*')
									.then(function (result_races) {
										var result = [];
										for (var i = 0; i < result_stakes.length; i++) {
											result.push({stake: result_stakes[i], race: result_races[i]});
										}
										callback(null, result);
									});
							});
					}
					return wait.for(fnAsync);
				},

				getWofSearchResult: function (packageId) {
					function fnAsync(callback) {
						knex('s_stakes_wof')
							.join('s_draws_wof', 's_stakes_wof.draw', '=', 's_draws_wof.id')
							.where('s_stakes_wof.package_id', '=', packageId)
							.select('s_stakes_wof.*')
							.then(function (result_stakes) {
								knex('s_stakes_wof')
									.join('s_draws_wof', 's_stakes_wof.draw', '=', 's_draws_wof.id')
									.where('s_stakes_wof.package_id', '=', packageId)
									.select('s_draws_wof.*')
									.then(function (result_races) {
										var result = [];
										for (var i = 0; i < result_stakes.length; i++) {
											result.push({stake: result_stakes[i], race: result_races[i]});
										}
										callback(null, result);
									});
							});
					}
					return wait.for(fnAsync);
				},

				getKaBoomSearchResult: function (packageId) {
					function fnAsync(callback) {
						knex('s_stakes_kb')
							.join('s_draws_kaboom', 's_stakes_kb.draw', '=', 's_draws_kaboom.id')
							.where('s_stakes_kb.package_id', '=', packageId)
							.select('s_stakes_kb.*')
							.then(function (result_stakes) {
								knex('s_stakes_kb')
									.join('s_draws_kaboom', 's_stakes_kb.draw', '=', 's_draws_kaboom.id')
									.where('s_stakes_kb.package_id', '=', packageId)
									.select('s_draws_kaboom.*')
									.then(function (result_races) {
										var result = [];
										for (var i = 0; i < result_stakes.length; i++) {
											result.push({stake: result_stakes[i], race: result_races[i]});
										}
										callback(null, result);
									});
							});
					}

					return wait.for(fnAsync);
				},

				getPickFiveSearchResult: function (packageId) {
					function fnAsync(callback) {
						knex('s_stakes_fv')
							.join('s_draws_five', 's_stakes_fv.draw', '=', 's_draws_five.id')
							.where('s_stakes_fv.package_id', '=', packageId)
							.select('s_stakes_fv.*')
							.then(function (result_stakes) {
								knex('s_stakes_fv')
									.join('s_draws_five', 's_stakes_fv.draw', '=', 's_draws_five.id')
									.where('s_stakes_fv.package_id', '=', packageId)
									.select('s_draws_five.*')
									.then(function (result_races) {

										var result = [];
										for (var i = 0; i < result_stakes.length; i++) {
											result.push({stake: result_stakes[i], race: result_races[i]});
										}

										callback(null, result);
									});


							});

					}

					return wait.for(fnAsync);
				},

				getDogStakesByPackageId: function (packageId) {
					function fnAsync(callback) {

						knex('s_stakes_d')
							.where('package_id', '=', packageId)
							.then(function (result) {
								callback(null, result)
							});
					}

					return wait.for(fnAsync);
				},

				getSportStakesByPackageId: function(packageId){
					function fnAsync(callback){
						knex('s_prestakes')
							.where('package_id', '=', packageId)
							.then(function(result){
								callback(null, result);
							});
					}

					return wait.for(fnAsync);
				},

				getGameStakesByPackageId: function(tbl_name, packageId){
					function fnAsync(callback){
						knex(tbl_name)
							.where({package_id : packageId})
							.then(function(result){
								callback(null, result);
							});
					}

					return wait.for(fnAsync);
				},

				getTerminalUserLimit: function(user_id) {
					function fnAsync(callback){
						knex.select('terminal_limit').from('s_users')
							.where({user_id: user_id})
							.then(function (rows){
								var limit =0;
								if(rows[0]) limit = rows[0].terminal_limit;
								callback(null, limit);
							});
					}
					return wait.for(fnAsync);
				},

				getFRUserLimit: function(cassa_id) {
					function fnAsync(callback){
						//.orderBy('date', 'desc')
						knex.select('amount_limit')
							.from('s_cashbox')
							.where({id: cassa_id})
							.limit(1)
							.then(function (rows){
								var limit =0;
								if(rows[0]) limit = rows[0].amount_limit;
								callback(null, limit);
							});
					}
					return wait.for(fnAsync);
				},

				updateTerminalUserLimit: function(user_id, limit, bet_amount) {
					function fnAsync(callback){
						knex('s_users').where({user_id: user_id})
							.update({terminal_limit : limit - bet_amount})
							.then(function (rows){
							callback(null, rows);
						});
					}
					return wait.for(fnAsync);
				},

				updateFRUserLimit: function(cassa_id, limit, bet_amount) {
					function fnAsync(callback){
						//.orderBy('date', 'desc')
						knex('s_cashbox')
							.update({amount_limit : limit + bet_amount})
							.where({id: cassa_id})
							.limit(1)
							.then(function (rows){
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				safeBetSave: function(query) {
					function fnAsync(callback){
						//console.log(query);
						knex.raw(query).catch(function(err){
							console.log(err);
							callback(err, null);
						}).then(function(rows){
							if(rows && rows[0] && rows[0][0]) {
								callback(null, rows);
							}
							else {
								callback(null, null);
							}
						});
					}
					return wait.for(fnAsync);
				},

				getTerminalRevenue: function(user_id) {
					function fnAsync(callback){
						knex('s_users').select('terminal_revenue','terminal_percent')
							.where({user_id: user_id})
							.then(function (rows){
								callback(null, rows[0]);
							});
						}
					return wait.for(fnAsync);
				},

				getTerminalIncome: function(user_id, type) {
					var fieldName = '';
					switch (type) {
						case 'game':
							fieldName = 'terminal_income_game';
							break;
						case 'sport':
						default :
							fieldName = 'terminal_income';
							break;
					}
					function fnAsync(callback){
						knex('s_users').select(fieldName)
							.where({user_id: user_id})
							.then(function (rows){
								callback(null, rows[0][fieldName]);
							});
					}
					return wait.for(fnAsync);
				},

				updateTerminalIncome: function(user_id, amount, type) {
					var formData = {};
					switch (type) {
						case 'game':
							formData = {terminal_income_game : amount};
							break;
						case 'sport':
						default :
							formData = {terminal_income : amount};
							break;
					}
					function fnAsync(callback){
						knex('s_users').where({user_id: user_id})
							.update(formData)
							.then(function (rows){
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				updateTerminalRevenue: function (user_id) {
					var sportRevenueConfig = [
						{limit : 0, percent : 7.5},
						{limit : 100000, percent : 8},
						{limit : 100000, percent : 9}
					];
					var gameRevenueConfig = 0.05;
					var income = this.getTerminalIncome(user_id, 'sport');
					var new_revenue = 0, i=1;
					while(income > 0 && i < sportRevenueConfig.length) {
						if(income > sportRevenueConfig[i].limit) {
							new_revenue += sportRevenueConfig[i].limit*sportRevenueConfig[i-1].percent/100;
						}
						else {
							new_revenue += income*sportRevenueConfig[i-1].percent/100;
						}
						income -= sportRevenueConfig[i].limit;
						i++;
					}
					if(income > 0) new_revenue += income*sportRevenueConfig[sportRevenueConfig.length-1].percent/100;
					new_revenue += this.getTerminalIncome(user_id, 'game') * gameRevenueConfig;
					function fnAsync(callback){
						knex('s_users').where({user_id: user_id})
							.update({terminal_revenue : new_revenue})
							.then(function (rows){
								callback(null, rows);
							});
						}
					return wait.for(fnAsync);
				},

				getUserBalance: function(user_id) {
					function fnAsync(callback){
						knex.select('e_summa').from('s_acc_days').where({user_id: user_id}).orderBy('dt', 'desc').limit(1)
							.then(function (rows){
								callback(null, rows[0].e_summa);
							});
					}
					return wait.for(fnAsync);
				},

				updateUserBalance: function(user_id, new_value) {
					function fnAsync(callback){
						knex('s_acc_days').where({user_id: user_id}).orderBy('dt', 'desc').limit(1)
							.update({e_summa: new_value})
							.then(function (rows){
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				getFranchisesOfOwner: function(franchise_owner) {
					function fnAsync(callback){
						knex('s_users').select('*').where({user_type: 'FRANCHISE', franchise_id : franchise_owner})
							.then(function (rows){
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
					//select * from s_users where user_type='FRANCHISE' and franchise_id=5
				},

				cashOutStake: function(package_id, paid_sum, user_id){
					var tbl_name;
					var re = /\d+-(\w+?)(\d+)/i;
					var m;
					if ((m = re.exec(package_id)) !== null) {
						if (m.index === re.lastIndex) {
							re.lastIndex++;
						}
					}
					switch (m[1]) {
						case 's':
						case 'S':
							tbl_name = 's_prestakes';
							break;
						case 'k':
						case 'K':
							tbl_name = 's_stakes_k';
							break;
						case 'kb':
						case 'KB':
							tbl_name = 's_stakes_kb';
							break;
						case 'f':
						case 'F':
							tbl_name = 's_stakes_fv';
							break;
						case 'h':
						case 'H':
							tbl_name = 's_stakes_h';
							break;
						case 'd':
						case 'D':
							tbl_name = 's_stakes_d';
							break;
						case 'w':
						case 'W':
							tbl_name = 's_stakes_wof';
							break;
					}
					function fnAsync(callback){
						//console.log("CALL `betoffice`.PayOut('" + tbl_name + "',"+ user_id +","+ paid_sum + ",'"+ package_id +"');")
						knex.raw("CALL `betoffice`.PayOut('" + tbl_name + "',"+ user_id +","+ paid_sum + ",'"+ package_id +"');")
							.then(function (rows){
								callback(null, rows);
							});

						// knex.raw("UPDATE " + tbl_name + " SET paid_user_id="+ user_id +", vyd=1, vdt = NOW(), paid_sum="+ paid_sum + ", base_paid_sum="+ paid_sum + " WHERE package_id='"+ package_id +"';")
						// 	.then(function (rows){
						// 		callback(null, rows);
						// 	});
						//knex('s_prestakes').where({package_id: stake.package_id})
						//	.update(stake)

					}
					return wait.for(fnAsync);
				},

				financeInput: function(user_id, amount, description) {
					function fnAsync(callback){
						knex.raw("INSERT INTO s_acc_transactions (dt,user_id,amount,`type`,descr) VALUES (NOW(),'"+ user_id +"','"+ amount +"',1,'"+ description +"';")
							.then(function (rows){
								callback(null);
							});
					}
					return wait.for(fnAsync);
				},

				financeOutput: function(user_id, amount, description) {
					function fnAsync(callback){
						knex.raw("INSERT INTO s_acc_transactions (dt,user_id,amount,`type`,descr) VALUES (NOW(),'"+ user_id +"','"+ amount +"',100,'"+ description +"';")
							.then(function (rows){
								callback(null);
							});
					}
					return wait.for(fnAsync);
				},

				updatePendingsBeforeCashOut: function (pendingIDs, dataForUpdatePending, userId) {
					function fnAsync(callback) {
						knex('s_prestakes')
							.whereIn('id', pendingIDs)
							.update(dataForUpdatePending)
							.then(function (result) {
								callback(null, result);
							});
					}

					return wait.for(fnAsync);

				},

				updateAllBeforeCashOut: function (allIDs, dataForUpdateAll, userId) {
					function fnAsync(callback) {
						knex('s_prestakes')
							.whereIn('id', allIDs)
							.update(dataForUpdateAll)
							.then(function (result) {
								callback(null, result);
							});
					}

					return wait.for(fnAsync);

				},

				getCashOutValidateData: function (events) {
					function fnAsync(callback) {
						knex('obs.pre_event').select('event_start_time','event_id')
							.whereIn('event_id', events)
							.then(function (result) {
								callback(null, result);
							});
					}
					return wait.for(fnAsync);
				},

				getHasEuroCup: function (packageId) {
					function fnAsync(callback) {
						knex.raw('CALL HasEuroCup("' + packageId + '")')
							.then(function (result) {
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

				getHasMotoCup: function (packageId) {
					function fnAsync(callback) {
						knex.raw('CALL HasMotoCupBoth("' + packageId + '")')
							.then(function (result) {
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

				addEuroCup: function (packageId,balls) {
					function fnAsync(callback) {
						knex.raw('CALL AddEuroCup("' + packageId + '","'+balls+'")')
							.then(function (result) {
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

                addMotoCup: function (packageId,balls,nextgame) {
					function fnAsync(callback) {
						knex.raw('CALL AddMotoCup("' + packageId + '","'+balls+'","'+nextgame+'")')
							.then(function (result) {
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

				addEmployeeActivity: function(user_info, type, param) {
					if(!user_info.employee_info)
						return;

					var points = 0;
					switch (type) {
						case 'live':
							points = param * configs.employeePoints[user_info.user_country].live;
							break;
						case 'prematch':
							points = param * configs.employeePoints[user_info.user_country].prematch;
							break;
						case 'game':
							points = param * configs.employeePoints[user_info.user_country].game;
							break;
						case 'package':
							points = Math.ceil(param / configs.employeePoints[user_info.user_country].package.amount) * configs.employeePoints[user_info.user_country].package.points;
							break;
						case 'gamebet':
							points = configs.employeePoints[user_info.user_country].gamebet;
							break;
						default:
							break;
					}
					if(points > 0) {
						function fnAsync(callback) {
							knex.raw("INSERT INTO s_employee_activities " +
								"(dt,user_id,activity_type,employee_id,points,param) " +
								"VALUES (NOW(),'" + user_info.user_id + "','" + type + "','" +
								user_info.employee_info.id + "','" + points +"','" + param +"');")
								.then(function (rows){
									knex.raw("UPDATE s_employees SET points = (points + " + points + ") WHERE id = '" + user_info.employee_info.id + "';")
										.then(function (rows){
											callback(null);
										});
								});
						}
						return wait.for(fnAsync);
					}
				},

				cashOutFreeBet: function(package_id, paid_sum, base_paid_sum, user_id){
					function fnAsync(callback){
						knex.raw("UPDATE s_prestakes SET paid_user_id="+ user_id +", vyd=1, vdt = NOW(), ststatus = 1, " +
							"paid_sum="+ paid_sum + ", base_paid_sum="+ base_paid_sum + " WHERE package_id='"+ package_id +"';")
							.then(function (rows){
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				getPCode: function(pcode){
					function fnAsync(callback){
						knex.raw("SELECT * FROM z_pcodes WHERE pcode='"+ pcode +"';")
							.then(function (rows){
								callback(null, rows[0][0]);
							});
					}
					return wait.for(fnAsync);
				},
				
				cashOutPCode: function(pcode, package_id, user_id){
					function fnAsync(callback){
						knex.raw("UPDATE z_pcodes SET user_id="+ user_id +", used=1, udt = NOW() WHERE pcode='"+ pcode +"';")
							.then(function (rows){
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},
				
				generateVCode: function generateVCode(){
					var alpha=['Q','W','E','R','T','Y','U','P','A','S','D','F','G','H','J','K','Z','X','C','V','B','N','M'];
					var a = _.toArray(_.shuffle(alpha)).slice(0,5);
					a.push(moment().day());
					return _.shuffle(a).join('');
				},
				
				generatePCode: function generatePCode(){
					var alpha=['Q','W','E','R','T','Y','U','P','A','S','D','F','G','H','J','K','Z','X','C','V','B','N','M'];
					var a = _.toArray(_.shuffle(alpha)).slice(0,4);
					a.push(moment().day());
					return _.shuffle(a).join('');
				},

				getMinDrawDate: function getMinDrawDate(draw_id, type){
					var tbl_name;
					switch (type) {
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
					function fnAsync(callback){
						knex(tbl_name).select('*')
							.where({id: draw_id})
							.then(function (rows) {
								rows[0].currentTime = Date.now();
								rows[0].timeDelta = rows[0].dt.getTime() - rows[0].currentTime;
								callback(null, rows[0]);
							});
					}
					return wait.for(fnAsync);
				}

			};

		}
	};


};