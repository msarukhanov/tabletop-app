/**
 * Created by Arthur on 11/13/2015.
 * Refactored by Gaz on 11/21/2016.
 */
var moment = require('moment');

module.exports = function (mdb, wait) {

	function asString(input) {
		return "'" + input + "'";
	}

	return {
		start: function () {
			return {
				//clean
				getBlocks: function () {
					function w(callback) {
						mdb.query("SELECT module_name,blocked FROM betoffice.s_blocks WHERE cash_box_id IS NULL AND module_name=IN('Live','Sport')",
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
						});
					}
					return wait.for(w);
				},

				//clean
				getFranchisesByUserId: function (userId) {
					function getFranchisesUserIdAsync(callback) {
						mdb.query('SELECT u.user_id, c.amount_limit FROM betoffice.s_users u ' +
							' INNER JOIN betoffice.s_cashbox c ON u.kassa_id=c.id ' +
							' INNER JOIN betoffice.s_franchises f ON c.franchise_id = f.id ' +
							' WHERE u.user_id = '+userId,
							function (err,results) {
								if(err){callback(null,null);return;}
								callback(null, results);
							});
					}
					return wait.for(getFranchisesUserIdAsync);
				},

				//clean
				getLiveLimits: function () {
					function w(callback) {
						mdb.query("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE evnt_src=2 AND creaated<DATE_SUB(NOW(),INTERVAL 2 HOUR)",
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
						});
					}
					return wait.for(w);
				},

				//clean
				getPreMatchLimits: function () {
					function w(callback) {
						mdb.query("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit FROM betoffice.s_limits WHERE evnt_src=0 AND creaated<DATE_SUB(NOW(),INTERVAL 72 HOUR)",
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getLimitsStorage: function (priceId, eventSource) {
					function w(callback) {
						mdb.query("SELECT stake_sum,price_id,evnt_src FROM betoffice.s_limits_storage WHERE evnt_src="+eventSource + " AND price_id="+priceId,
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getLiveDefaultLimit: function () {
					function w(callback) {
						mdb.query("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit WHERE evnt_src=2 AND is_default=1",
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getPreDefaultLimit: function () {
					function w(callback) {
						mdb.query("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit WHERE evnt_src=0 AND is_default=1",
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getPreLimitByPriceRefId: function (priceRefId) {
					function w(callback) {
						mdb.query("SELECT sport_id,event_id,market_id,price_id,active,is_default,evnt_src,max_bet_limit,per_bet_limit WHERE price_id="+priceRefId+" AND active=0",
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getPrePrices: function (rfIds) {
					function w(callback) {
						mdb.query("SELECT * FROM obs.pre_price WHERE price_reference_id IN ('" + rfIds.join("','") + "')",
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getLivePrices: function (priceId, eventSource, marketId, eventId) {
					function w(callback) {
						mdb.query('CALL GetLivePrices(' + priceId + ', ' + eventSource + ', ' + marketId + ', ' + eventId + ')',
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result[0]);
							});
					}
					return wait.for(w);
				},

				//clean
				getPreInfoByPrice: function (priceId) {
					function fnAsync(callback) {
						mdb.query('select * from `obs`.pre_price WHERE price_reference_id = "' + priceId + '"',
							function (err, result) {
								if(err || !result[0]){callback(null,null);return;}
								callback(null, result[0].market_id);
							});
					}

					return wait.for(fnAsync);
				},

				//clean
				getLiveInfoByPrice: function (priceId) {
					function fnAsync(callback) {
						mdb.query('select * from `obs.paddypower`.price WHERE price_id = "' + priceId + '"',
							function (err, result) {
								if(err || !result[0]){callback(null,null);return;}
								callback(null, result[0].market_id);
							});
					}

					return wait.for(fnAsync);
				},

				//clean
				getLivePricesNew: function (priceId, marketId, eventId) {
					function fnAsync(callback) {
						mdb.query('select * from `obs.paddypower`.price WHERE event_id = "' + eventId + '" and price_id = "' + priceId + '" and market_id = "' + marketId +  '";',
							function (err, result) {
								if(err || !result[0]){callback(null,null);return;}
								callback(null, result[0]);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				liveEventCheck: function (priceId, marketId, eventId) {
					function fnAsync(callback) {
						mdb.query('select monitor_status from `obs.paddypower`.event WHERE event_id = ' + eventId +  ';',
						function (err, result) {
							if(err){callback(null,null);return;}
							callback(null, result);
						});
					}

					return wait.for(fnAsync);
				},

				//clean
				liveMarketCheck: function (priceId, marketId, eventId) {
					function fnAsync(callback) {
						mdb.query('select market_status_id from `obs.paddypower`.market WHERE event_id = "' + eventId + '" and market_id = "' + marketId +  '";',
						function (err, result) {
							if(err){callback(null,null);return;}
							callback(null, result);
						});
					}

					return wait.for(fnAsync);
				},

				//clean
				getStakeDetails: function (packageId) {
					function w(callback) {
						mdb.query('CALL betoffice.PreStakesSearch_New(\'' + packageId + '\')',
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result[0]);
							});
					}
					return wait.for(w);
				},

				//clean
				getEventScores: function (eventIds) {
					function w(callback) {
						mdb.query("SELECT * FROM betoffice.s_event_scores WHERE event_id IN ('" + eventIds.join("','") + "')",
							function (err, result) {
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getGameSearchResult: function (packageId,table1,table2,drawtypename) {
					function fnAsync(callback) {
						mdb.query('SELECT s.* FROM betoffice.' + table1 + ' s, betoffice.' + table2 + ' d WHERE s.packageId=:packageId AND s.' + drawtypename + '=d.id ORDER BY s.id', {packageId: packageId},
							function (err, stakes) {
								if (err) {
									callback(null, null);
									return;
								}

								mdb.query('SELECT d.* FROM betoffice.' + table1 + ' s, betoffice.' + table2 + ' d WHERE s.packageId=:packageId AND s.' + drawtypename + '=d.id ORDER BY s.id', {packageId: packageId},
									function (err, draws) {
										if (err) {
											callback(null, null);
											return;
										}

										var result = [];
										for (var i = 0; i < stakes.length; i++) {
											result.push({stake: stakes[i], race: draws[i]});
										}

										callback(null, result);
									});

							});
					}
					return wait.for(fnAsync);
				},

				//clean
				getSportStakesByPackageId: function(packageId){
					function w(callback){
						mdb.query('SELECT * FROM betoffice.s_prestakes WHERE package_id ='+packageId,
							function(err, result){
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getGameStakesByPackageId: function(tbl_name, packageId){
					function w(callback){
						mdb.query('SELECT * FROM betoffice.'+tbl_name+' WHERE package_id ='+packageId,
							function(err, result){
								if(err){callback(null,null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				//clean
				getTerminalUserLimit: function(user_id) {
					function fnAsync(callback){
						mdb.query('SELECT terminal_limit FROM betoffice.s_users WHERE user_id=:user_id',{user_id:user_id},
							function (err,rows){
								if (err) {callback(null, null);return;}
								var limit =0;
								if(rows[0]) limit = Number(rows[0].terminal_limit);
								callback(null, limit);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				getFRUserLimit: function(cassa_id) {
					function fnAsync(callback){

						mdb.query('SELECT amount_limit FROM betoffice.s_cashbox WHERE id=:id',{id:cassa_id},
							function (err,rows){
								if (err) {callback(null, null);return;}
								var limit =0;
								if(rows[0]) limit = Number(rows[0].amount_limit);
								callback(null, limit);
							});

					}
					return wait.for(fnAsync);
				},

				//clean
				updateTerminalUserLimit: function(user_id, limit, bet_amount) {
					function fnAsync(callback){
						mdb.query('UPDATE s_users SET terminal_limit=terminal_limit-'+bet_amount+' where user_id=:user_id LIMIT 1',{user_id: user_id},
							function (err,rows){
								if (err) {callback(null, null);return;}
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				updateFRUserLimit: function(cassa_id, limit, bet_amount) {
					function fnAsync(callback){
						mdb.query('UPDATE s_cashbox SET amount_limit=amount_limit-'+bet_amount+' where id=:id LIMIT 1',{id: cassa_id},
							function (err,rows){
								if (err) {callback(null, null);return;}
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				getTerminalRevenue: function(user_id) {
					function fnAsync(callback){
						mdb.query('SELECT terminal_revenue,terminal_percent FROM betoffice.s_users WHERE user_id=:user_id',{user_id:user_id},
							function (err,rows){
								if (err) {callback(null, null);return;}
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
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
						mdb.query('SELECT '+fieldName+' FROM betoffice.s_users WHERE user_id=:user_id',{user_id:user_id},
							function (err,rows){
								if (err) {callback(null, null);return;}
								callback(null, Number(rows[0][fieldName]));
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				updateTerminalIncome: function(user_id, amount, type) {
					var update = '';
					switch (type) {
						case 'game':
							update = 'terminal_income_game = '+ amount;
							break;
						case 'sport':
						default :
							update = 'terminal_income = '+amount;
							break;
					}
					function fnAsync(callback){
						mdb.query('UPDATE betoffice.s_users SET '+update+' WHERE user_id=:user_id',{user_id:user_id},
							function (err, rows){
								if (err) {callback(null, null);return;}
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
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
						mdb.query('UPDATE betoffice.s_users SET terminal_revenue='+new_revenue+' WHERE user_id=:user_id',{user_id:user_id},
							function (err, rows){
								if (err) {callback(null, null);return;}
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				getUserBalance: function(user_id) {
					function w(callback){
						mdb.query('SELECT e_summa FROM betoffice.s_acc_days WHERE user_id=:user_id ORDER BY dt DESC LIMIT 1',{user_id: user_id},
							function (err, result){
								if (err) {callback(null, null);return;}
								callback(null, Number(result[0].e_summa));
							});
					}
					return wait.for(w);
				},

				//clean
				getFranchisesOfOwner: function(franchise_owner) {
					function fnAsync(callback){
						mdb.query('SELECT * FROM betoffice.s_users WHERE user_type=:user_type AND franchise_id=:franchise_id',{user_type: 'FRANCHISE', franchise_id : franchise_owner},
							function (err, result){
								if (err) {callback(null, null);return;}
								callback(null, Number(result[0].e_summa));
							});
					}
					return wait.for(fnAsync);
				},

				//clean
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
						mdb.query("CALL `betoffice`.PayOut('" + tbl_name + "',"+ user_id +","+ paid_sum + ",'"+ package_id +"');",
							function (err, rows){
								if (err) {callback(null, null);return;}
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				financeInput: function(user_id, amount, description) {
					function fnAsync(callback){
						mdb.query("INSERT INTO betoffice.s_acc_transactions (dt,user_id,amount,`type`,descr) VALUES (NOW(),'"+ user_id +"','"+ amount +"',1,'"+ description +"';",
							function (err, rows){
								if (err) {callback(null, null);return;}
								callback(null);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				financeOutput: function(user_id, amount, description) {
					function fnAsync(callback){
						mdb.query("INSERT INTO betoffice.s_acc_transactions (dt,user_id,amount,`type`,descr) VALUES (NOW(),'"+ user_id +"','"+ amount +"',100,'"+ description +"';",
							function (err, rows){
								if (err) {callback(null, null);return;}
								callback(null);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				updatePendingsBeforeCashOut: function (ids, update, userId) {
					var data = [];
					_.each(update,function(p,k){
						data.push(k+'=:'+k);
					});

					function fnAsync(callback) {
						mdb.query('UPDATE betoffice.s_prestakes SET '+data.join(',')+ ' WHERE id IN ('+ids.join(',')+')',update,
							function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				updateAllBeforeCashOut: function (ids, update, userId) {
					var data = [];
					_.each(update,function(p,k){
						data.push(k+'=:'+k);
					});

					function fnAsync(callback) {
						mdb.query('UPDATE betoffice.s_prestakes SET '+data.join(',')+ ' WHERE id IN ('+ids.join(',')+')',update,
							function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result);
							});
					}

					return wait.for(fnAsync);

				},

				//clean
				getCashOutValidateData: function (events) {
					function fnAsync(callback) {
						mdb.query('SELECT event_start_time,event_id FROM obs.pre_event WHERE event_id IN ('+events.join(',')+') ',
							function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				getHasEuroCup: function (packageId) {
					function fnAsync(callback) {
						mdb.query('CALL betoffice.HasEuroCup("' + packageId + '")',
							function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

				//clean
				getHasMotoCup: function (packageId) {
					function fnAsync(callback) {
						mdb.query('CALL betoffice.HasMotoCupBoth("' + packageId + '")')
							.then(function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

				//clean
				addEuroCup: function (packageId,balls) {
					function fnAsync(callback) {
						mdb.query('CALL betoffice.AddEuroCup("' + packageId + '","'+balls+'")',
							function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

				//clean
				addMotoCup: function (packageId,balls,nextgame) {
					function fnAsync(callback) {
						mdb.query('CALL betoffice.AddMotoCup("' + packageId + '","'+balls+'","'+nextgame+'")',
							function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result[0]);
							});
					}

					return wait.for(fnAsync);
				},

				//clean
				addEmployeeActivity: function(user_info, type, param) {
					if(!user_info.employee_info)
						return;

					var points = 0;
					switch (type) {
						case 'live':
							points = param * Number(configs.employeePoints[user_info.user_country].live);
							break;
						case 'prematch':
							points = param * Number(configs.employeePoints[user_info.user_country].prematch);
							break;
						case 'game':
							points = param * Number(configs.employeePoints[user_info.user_country].game);
							break;
						case 'package':
							points = Math.ceil(param / Number(configs.employeePoints[user_info.user_country].package.amount)) * Number(configs.employeePoints[user_info.user_country].package.points);
							break;
						case 'gamebet':
							points = Number(configs.employeePoints[user_info.user_country].gamebet);
							break;
						default:
							break;
					}
					if(points > 0) {
						function fnAsync(callback) {
							mdb.query("INSERT INTO betoffice.s_employee_activities " +
								"(dt,user_id,activity_type,employee_id,points,param) " +
								"VALUES (NOW(),'" + user_info.user_id + "','" + type + "','" +
								user_info.employee_info.id + "','" + points +"','" + param +"');",
								function (err, rows){
									if (err) {callback(null, null);return;}
									mdb.query("UPDATE betoffice.s_employees SET points = (points + " + points + ") WHERE id = '" + user_info.employee_info.id + "';",
										function (err, rows){
											if (err) {callback(null, null);return;}
											callback(null, rows);
										});
								});
						}
						return wait.for(fnAsync);
					}
				},

				//clean
				cashOutFreeBet: function(package_id, paid_sum, base_paid_sum, user_id){
					function fnAsync(callback){
						mdb.query("UPDATE s_prestakes SET paid_user_id="+ user_id +", vyd=1, vdt = NOW(), ststatus = 1, " +
							"paid_sum="+ paid_sum + ", base_paid_sum="+ base_paid_sum + " WHERE package_id='"+ package_id +"';",
							function (err, rows){
								if (err) {callback(null, null);return;}
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				getPCode: function(pcode){
					function fnAsync(callback){
						mdb.query("SELECT * FROM betoffice.z_pcodes WHERE pcode='"+ pcode +"';",
							function (err, rows){
								if (err) {callback(null, null);return;}
								callback(null, rows[0]);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				cashOutPCode: function(pcode, package_id, user_id){
					function fnAsync(callback){
						mdb.query("UPDATE betoffice.z_pcodes SET user_id="+ user_id +", used=1, udt = NOW() WHERE pcode='"+ pcode +"';",
							function (err, rows){
								if (err) {callback(null, null);return;}
								callback(null, rows);
							});
					}
					return wait.for(fnAsync);
				},

				//clean
				generateVCode: function generateVCode(){
					var alpha=['Q','W','E','R','T','Y','U','P','A','S','D','F','G','H','J','K','Z','X','C','V','B','N','M'];
					var a = _.toArray(_.shuffle(alpha)).slice(0,5);
					a.push(moment().day());
					return _.shuffle(a).join('');
				},

				//clean
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
						mdb.query('SELECT * FROM betoffice.'+tbl_name +' WHERE id=:id',{id: draw_id},
							function (err, rows) {
								if (err) {callback(null, null);return;}
								rows[0].dt = new Date(rows[0].dt);
								rows[0].currentTime = Date.now();
								rows[0].timeDelta = rows[0].dt - rows[0].currentTime;
								callback(null, rows[0]);
							});
					}
					return wait.for(fnAsync);
				},

				getValidateData: function(list) {
					var listString = list.join("\',\'");
					function w(callback) {
						mdb.query('SELECT p.price_reference_id,e.event_start_time,p.rate FROM obs.pre_price p ' +
							'LEFT JOIN obs.pre_event e on p.event_id=e.event_id WHERE p.price_reference_id IN(\'' + listString + '\')',
							function (err, result) {
								if (err) {callback(null, null);return;}
								var mapped = {};
								_.each(result,function(r){
									mapped[r.price_reference_id] = {t:r.event_start_time,r:r.rate};
								});
								callback(null, mapped);
							});
					}
					return wait.for(w);
				},

				getValidateMaxLimits: function(list) {
					var listString = list.join("','");
					function fnAsync(callback) {
						mdb.query("select max_bet_limit,price_id from betoffice.s_limits WHERE price_id IN('" + listString + "')",
							function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result);
							});
					}
					return wait.for(fnAsync);
				},

				getValidateStakeSum: function(list) {
					var listString = list.join("','");
					function w(callback) {
						mdb.query("select sum(stake_sum) as sum,price_id from betoffice.s_limits_storage WHERE price_id IN('" + listString + "') GROUP BY price_id",
							function (err, result) {
								if (err) {callback(null, null);return;}
								callback(null, result);
							});
					}
					return wait.for(w);
				},

				getPerBetLimits: function(event) {
					function w(callback) {
						mdb.query('select min(per_bet_limit) as `limit`,min(active) as active from betoffice.s_limits WHERE per_bet_limit > 0 AND (' +
							' price_id = "' + event.price_ref + '"' +
							' OR market_id = ' + (event.market_id || 0) +
							' OR event_id = ' + (event.event_id || 0) +
							' OR competition_id = ' + (event.competition_id || 0) + ')',
							function (err, result) {
								if(err) {callback(null, null); return}
								callback(null, result[0]);
							});
						}
					return wait.for(w);
				},

				getLivePricesNew: function (priceId, marketId, eventId) {
					function w(callback) {
						mdb.query('select * from `obs.paddypower`.price WHERE event_id = ' + eventId + ' and price_id = ' + priceId + ' and market_id = ' + marketId,
							function (err, response) {
								if (err) {callback(null, null);return;}
								callback(null, response);
							})
					}
					return wait.for(w);
				},

				liveEventCheck: function (priceId, marketId, eventId) {
					function w(callback) {
						mdb.query('select monitor_status from `obs.paddypower`.event WHERE event_id = ' + eventId,
							function (err, response) {
								if (err) {callback(null, null);return;}
								callback(null, response);
							})
					}
					return wait.for(w);
				},

				liveMarketCheck: function (priceId, marketId, eventId) {
					function w(callback) {
						mdb.query('select market_status_id from `obs.paddypower`.market WHERE event_id = ' + eventId + ' and market_id = ' + marketId,
							function (err, response) {
								if (err) {callback(null, null);return;}
								callback(null, response);
							})
					}
					return wait.for(w);
				},
				
				//clean
				safeBetSave: function(query) {
					function w(callback){
						mdb.query(query,
							function(err, rows){
								if (err) {callback(null, null);return;}
								if(rows && rows[0]) {
									callback(null, rows);
								}
								else {
									callback(null, null);
								}
							});
					}
					return wait.for(w);
				}

			};

		}
	};
};