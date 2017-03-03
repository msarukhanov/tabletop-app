module.exports = function (knex, wait, moment, BS, AS) {
	return {
		start: function () {
			var bettingService = BS.start();

			var globalSettings = bettingService.getGlobalSettings();
			globalSettings = _.groupBy(globalSettings, function(setting) {return setting.setting_name});
			globalSettings = _.each(globalSettings, function(setting, key) {
				globalSettings[key] = setting[0].setting_value
			});

			var betTypes = { keno: 0, kaBoom: 1, pickFive: 2, horses: 3, dogs: 4, sport: 5, live: 6, terminal: 7, wof:8	};

			var stakePayoutCalculator = {
				maxPossibleWinningSum: null,
				bonusPercents: [],
				ctorFn: function (bonusPercentsOnWinSum, maxPossibleWinningSum) {
					this.maxPossibleWinningSum = maxPossibleWinningSum;
					this.bonusPercents = bonusPercentsOnWinSum;
				}
			};

			function itContains(text, peace) {
				return (text.toLowerCase().indexOf(peace) > -1);
			}

			function isNullOrEmpty(input) {
				return (input == null || input.length == 0);
			}

			function isFootball(sportName) {
				if (isNullOrEmpty(sportName)) return false;
				else return itContains(sportName, 'football');
			}

			function isExpired(startData, endDate) {
				if (startData == null || startData == undefined) return false;
				else return startData < endDate;
			}

			function getStakeObject(stake, playType, sRacesBase) {
				switch (playType) {
					case betTypes.sport:
					case betTypes.live:
					{
						break;
					}
					case betTypes.horses:
					case betTypes.dogs:
					{
						stake.expired = isExpired(stake.expiration_date, new Date());
						stake.calculateionDate = sRacesBase != null ? sRacesBase.dt : stake.pdt;
						stake.selection = stake.bet;
						stake.draw = stake.race;
						if (sRacesBase != null) {
							stake.result = sRacesBase.r1 + "," + sRacesBase.r2 + "," + sRacesBase.r3;
						} else {
							stake.result = "0,0,0"
						}
						break;
					}
					case betTypes.wof:
					{
						stake.expired = isExpired(stake.expiration_date, new Date());
						stake.calculateionDate = sRacesBase != null ? sRacesBase.dt : stake.pdt;
						stake.selection = stake.bet;
						if (sRacesBase != null) {
							stake.result = sRacesBase.r;
							//stake.result = stake.ststatus == 0 ? "" : ballsExists + "/" + choosenBallsCount;
						} else {
							stake.result = "---"
						}
						break;
					}
				}

				return stake;
			}

			function getGameStakeObject(stake, sDraws, game) {
				stake.isExpired = isExpired(stake.expiration_date, new Date());
				stake.calculateionDate = sDraws != null ? sDraws.dt : stake.pdt;
				var configs = {'keno':10, 'kaboom':6, 'pickFive':5};
				stake.bet = '';
				if (sDraws != null) {
					var choosenBallsCount = 0;
					if (stake['b1'] != 0) {
						choosenBallsCount++;
						stake.bet = stake.bet + stake['b1'];
					}
					for(var i = 2; i < configs[game] + 1; i++) {
						if (stake['b'+i] != 0) {
							choosenBallsCount++;
							stake.bet = stake.bet + ',' + stake['b'+i];
						}
					}
					var ballsExists = 0;
					var balls = sDraws.r.split(',');
					for(var i = 1; i < configs[game] + 1; i++) {
						for(var j = 0; j < balls.length; j++) {
							if (balls[j] == stake['b'+i].toString()) {
								ballsExists++;
							}
						}

					}
					stake.result = stake.ststatus == 0 ? "" : ballsExists + "/" + choosenBallsCount;
				} else {
					stake.result = "";
				}
				stake.selection = stake.bet;
				return stake;
			}

			function cashOutValidateAndProcess(stakesArray, isGame, response, type, country, isValid) {
				var nowTime = new Date();
				var pendingStake = _.filter(stakesArray, function (item) {
					return item.rstatus == 0; // 0 - pending
				});
				var singleStake = _.find(stakesArray, function (item) {
					return item.type == 0; // 0 - single
				});
				var lostStake = _.filter(stakesArray, function (item) {
					return item.rstatus == 3; // 3 - lost
				});
				var wonStake = _.filter(stakesArray, function (item) {
					return item.rstatus == 2; // 3 - lost
				});
				var retStake = _.filter(stakesArray, function (item) {
					return item.rstatus == 1; // 3 - lost
				});
				var liveStake = _.filter(stakesArray, function (item) {
					return item.evnt_src == 2; // 2 - live
				});
				var paidStake = _.find(stakesArray, function (item) {
					return item.vyd == 1; // 1 - paid
				});
				if(country == 'NIGERIA') {
					var firstItem = isGame ? stakesArray[0].stake : stakesArray[0];
					if(stakesArray.length > 8 && (wonStake.length + retStake.length) >= (stakesArray.length - 1)
						&& liveStake.length == 0 && paidStake == null && singleStake == null &&
							pendingStake.length == 0 && lostStake.length <2 && firstItem.package_sum > 999) {
						var packageId = response.packageId;
						var paidSum = 0;
						if(stakesArray[0]) {
							if(firstItem.vdt != null) {
								response.validation.errors.push({message : 'vdt error'});
								isValid = false;
							}
							else {
								if(firstItem.paid_user_id != 0) {
									response.validation.errors.push({message : 'paid user id error'});
									isValid = false;
								}
								else {
									if(firstItem.expiration_date < new Date()) {
										response.validation.errors.push({message : 'expiration date error'});
										isValid = false;
									}
									else {
										var tempOdd = 1, tempSum = 0;
										_.each(stakesArray, function(wonStakeItem, key){
											tempOdd *= wonStakeItem.val;
										});
										tempSum = Math.floor((tempOdd * wonStake[0].package_sum) / 10);
										var allIDs = _.pluck(stakesArray, 'id');
										var maxWinSum = Number(globalSettings['MaxWinSum.' + firstItem.country]);
										var exchangeRate = Number(globalSettings['ExchangeRate.' + firstItem.currency]);
										var bonus;
										bonus = tempSum < maxWinSum ? tempSum : maxWinSum;
										base_bonus = bonus / exchangeRate;
										var dataForUpdateAll = {
											bonus : 0,
											payout_sum : bonus,
											base_bonus : 0,
											base_payout_sum : base_bonus,
											ststatus : 2
										};
										bettingService.updateAllBeforeCashOut(allIDs, dataForUpdateAll, response.userId);
										if(firstItem && bonus > 0) {
											bettingService.cashOutStake(packageId, bonus, response.userId);
										}
										if(type == 'TERMINAL') {
											var limit = bettingService.getTerminalUserLimit(response.userId);
											bettingService.updateTerminalUserLimit(response.userId, limit, (-1)*bonus);
										}
										else if(type == 'FRANCHISE') {
											var cassaID = response.kassa_id;
											var limit = bettingService.getFRUserLimit(cassaID);
											bettingService.updateFRUserLimit(response.userId, limit, (-1)*bonus);
										}
										// if(isValid) {
										// 	bettingService.updateUserBalance(response.userId, bettingService.getUserBalance(response.userId) - paidSum);
										// }
									}
								}
							}
						}
						return isValid;
					}
					else isValid = false;
				}
				else {
					if (lostStake.length == 0 && liveStake.length == 0 && paidStake == null && singleStake == null) {
						var packageId = response.packageId;
						var paidSum = 0;
						if(stakesArray[0]) {
							var firstItem = isGame ? stakesArray[0].stake : stakesArray[0];
							if(((wonStake.length + retStake.length) != stakesArray.length  - pendingStake.length) 
								|| (pendingStake.length > 1 && stakesArray.length < 8) || pendingStake.length > 3) {
								response.validation.errors.push({message : 'array error'});
								isValid = false;
							}
							else {
								var pendingEventIDs = _.pluck(pendingStake, 'eid');
								var tempDateStake = bettingService.getCashOutValidateData(pendingEventIDs);
								var dateStake = _.find(tempDateStake, function (item) {
									return item.event_start_time <= nowTime;
								});
								if(dateStake != null) {
									response.validation.errors.push({message : 'One or more events already started'});
									isValid = false;
								}
								else {
									if(firstItem.vdt != null) {
										response.validation.errors.push({message : 'vdt error'});
										isValid = false;
									}
									else {
										if(firstItem.paid_user_id != 0) {
											response.validation.errors.push({message : 'paid user id error'});
											isValid = false;
										}
										else {
											if(firstItem.expiration_date < new Date()) {
												response.validation.errors.push({message : 'expiration date error'});
												isValid = false;
											}
											else {
												if (pendingStake.length < 1) {
													response.validation.errors.push({message: 'this ticket is not available for cash out'});
													isValid = false;
												}
												else {
													var tempOdd = 1, tempSum = 0;
													_.each(wonStake, function(wonStakeItem, key){
														tempOdd *= wonStakeItem.val;
													});
													tempSum = Math.floor(tempOdd * wonStake[0].package_sum);
													var wonIDs = _.pluck(wonStake, 'id').join(",");
													var pendingIDs  = _.pluck(pendingStake, 'id');
													var allIDs = _.pluck(stakesArray, 'id');

													function calculateBetBonusPercent(type, num) {
														var result;
														switch (type) {
															case 4:
																var all_percents = [0, 0, 0, 1, 3, 5, 7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 70];
																if (num > all_percents.length - 1) result = all_percents[all_percents.length - 1];
																else result = all_percents[num];
																break;
															case 1:
																var all_percents = [0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 25, 30];
																if (num > all_percents.length - 1) result = all_percents[all_percents.length - 1];
																else result = all_percents[num];
																break;
															default:
																result = 0;
														}
														return result;
													}
													var bonus_percent = calculateBetBonusPercent(Number(globalSettings['BonusType.' + firstItem.country]), wonStake.length);
													var taxPercent = Number(globalSettings['Tax.' + firstItem.country]);
													var exchangeRate = Number(globalSettings['ExchangeRate.' + firstItem.currency]);
													var bonus, winning, tax, base_tempSum, base_winning, base_bonus, base_tax;


													// if(type == "SHOP" || type == 'TERMINAL') bonus = tempSum * bonus_percent / 100;
													// else bonus = 0;

													if(globalSettings['BonusType.' + firstItem.country] == 2)
														bonus = ((100 * tempSum - taxPercent * firstItem.package_sum) / (100 - taxPercent)) - tempSum;
													else
														bonus = tempSum * bonus_percent / 100;

													tax = (tempSum + bonus - firstItem.package_sum) * taxPercent / 100;
													winning = tempSum + bonus - tax;
													base_bonus = bonus / exchangeRate;
													base_tax = tax / exchangeRate;
													base_tempSum = tempSum / exchangeRate;
													base_winning = winning / exchangeRate;
													var now = new Date();
													var dataForUpdatePending = {
														pdt : now,
														rstatus : 1
													};
													var dataForUpdateAll = {
														bonus : bonus,
														payout_sum : winning,
														wsum : tempSum,
														base_bonus : base_bonus,
														base_payout_sum : base_winning,
														base_wsum : base_tempSum,
														ststatus : 2
													};
													bettingService.updatePendingsBeforeCashOut(pendingIDs, dataForUpdatePending, response.userId);
													bettingService.updateAllBeforeCashOut(allIDs, dataForUpdateAll, response.userId);

													var paidSum = winning;
													if(firstItem && paidSum > 0) {
														bettingService.cashOutStake(packageId, paidSum, response.userId);
													}
													if(type == 'TERMINAL') {
														var limit = bettingService.getTerminalUserLimit(response.userId);
														bettingService.updateTerminalUserLimit(response.userId, limit, (-1)*paidSum);
													}
													else if(type == 'FRANCHISE') {
														var cassaID = response.kassa_id;
														var limit = bettingService.getFRUserLimit(cassaID);
														bettingService.updateFRUserLimit(response.userId, limit, (-1)*paidSum);
													}
													// if(isValid) {
													// 	bettingService.updateUserBalance(response.userId, bettingService.getUserBalance(response.userId) - paidSum);
													// }
												}
											}
										}
									}
								}
							}
						}
						return isValid;
					}
				}

			}
			
			function payOutValidateAndProcess(stakesArray, isGame, response, type, isValid) {
				var pendingStake = _.find(stakesArray, function (item) {
					return item.ststatus == 0; // 0 - pending
				});
				var paidStake = _.find(stakesArray, function (item) {
					return item.vyd == 1; // 1 - paid
				});
				if (pendingStake == null && paidStake == null) {
					var packageId = response.packageId;
					var paidSum = 0;
					if(stakesArray[0]) {
						var firstItem = isGame ? stakesArray[0].stake : stakesArray[0];
						if(firstItem.ststatus != 2) {
							response.validation.errors.push({message : 'ststatus error'});
							isValid = false;
						} else {
							if(firstItem.vdt != null ) {
								response.validation.errors.push({message : 'vdt error'});
								isValid = false;
							} else {
								if(firstItem.paid_user_id != 0 ) {
									response.validation.errors.push({message : 'paid user id error'});
									isValid = false;
								} else {
									if(firstItem.expiration_date < new Date()) {
										response.validation.errors.push({message : 'expiration date error'});
										isValid = false;
									} else {
										if(!firstItem.payout_sum) {

										} else {
											paidSum = firstItem.payout_sum;
										}
										if(firstItem && paidSum > 0) {
											bettingService.cashOutStake(packageId, paidSum, response.userId);
										}
										if(type == 'TERMINAL') {
											var limit = bettingService.getTerminalUserLimit(response.userId);
											bettingService.updateTerminalUserLimit(response.userId, limit, (-1)*paidSum);
										}
										else if(type == 'FRANCHISE') {
											var cassaID = response.kassa_id;
											var limit = bettingService.getFRUserLimit(cassaID);
											bettingService.updateFRUserLimit(cassaID, limit, (1)*paidSum);
										}
										// if(isValid) {
										// 	bettingService.updateUserBalance(response.userId, bettingService.getUserBalance(response.userId) - paidSum);
										// }
									}
								}
							}
						}
					}
					return isValid;
				}
			}

			function getBetTypeFromPackageId(packageId) {
				var playType;
				if (itContains(packageId, 'kb')) {
					playType = betTypes.kaBoom;
				} else if (itContains(packageId, 'f')) {
					playType = betTypes.pickFive;
				} else if (itContains(packageId, 'k')) {
					playType = betTypes.keno;
				} else if (itContains(packageId, 'd')) {
					playType = betTypes.dogs;
				} else if (itContains(packageId, 'h')) {
					playType = betTypes.horses;
				} else if (itContains(packageId, 's')) {
					playType = betTypes.sport;
				} else if (itContains(packageId, 'w')) {
					playType = betTypes.wof;
				}
				return playType;
			}

			return {

				getBetDetails: function (response, isOffline) {

					response.validation = {
						errors: [],
						hasErrors: false
					};

					var isValid = true;

					var packageId = response.packageId;

					var playType = getBetTypeFromPackageId(packageId);

					var searchResult;

					if (playType == betTypes.live || playType == betTypes.sport) {

                        var resultRows = bettingService.getStakeDetails(packageId, isOffline);

						var result = _.map(resultRows, function (rsr) {
							return getStakeObject(rsr, playType, null);
						});

						var eventIds = _.map(result, function (item) {
							return item.eid;
						});
						var scores = bettingService.getEventScores(eventIds);

						searchResult = _.sortBy(result, function (item) {
							return item.market_name;
						});

						_.each(searchResult, function (preStake) {
							// TODO: understand why assumed scores supplied for soccer only
							if (isFootball(preStake.sport_name)) {
								var eventScore = _.find(scores, function (item) {
									return (item.event_id == preStake.eid && item.evnt_src == preStake.evnt_src);
								});

								if (eventScore != null) {
									preStake.eventScore = eventScore.score;
								}
							}
						});

					}

					if (playType == betTypes.horses) {
						searchResult = bettingService.getHorsesSearchResult(packageId);
						searchResult = _.map(searchResult, function (item) {
							return getStakeObject(item.stake, playType, item.race)
						});
					}

					if (playType == betTypes.dogs) {
						searchResult = bettingService.getDogsSearchResult(packageId);
						searchResult = _.map(searchResult, function (item) {
							return getStakeObject(item.stake, playType, item.race)
						});
					}

					if (playType == betTypes.keno) {
						searchResult = bettingService.getKenoSearchResult(packageId);
						searchResult = _.map(searchResult, function (item) {
							return getGameStakeObject(item.stake, item.race, 'keno');
						});
					}

					if (playType == betTypes.wof) {
						searchResult = bettingService.getWofSearchResult(packageId);
						searchResult = _.map(searchResult, function (item) {
							return getStakeObject(item.stake, playType, item.race);
						});
					}
					
					if (playType == betTypes.kaBoom) {
						searchResult = bettingService.getKaBoomSearchResult(packageId);
						searchResult = _.map(searchResult, function (item) {
							return getGameStakeObject(item.stake, item.race, 'kaboom');
						});
					}

					if (playType == betTypes.pickFive) {
						searchResult = bettingService.getPickFiveSearchResult(packageId);
						searchResult = _.map(searchResult, function (item) {
							return getGameStakeObject(item.stake, item.race, 'pickFive');
						});
					}

					response.package_info = {
						ststatus: (searchResult && searchResult.length>0) ? searchResult[0].ststatus : 0,
						paid: (searchResult && searchResult.length>0) ? searchResult[0].vyd : 0,
						paid_date: (searchResult && searchResult.length>0) ? searchResult[0].vdt : 0
					};
					if(searchResult && searchResult.length>0 && searchResult[0].vilka && searchResult[0].vilka > 0)
					{
						response.package_info.euro = searchResult[0].vilka;
						switch(searchResult[0].vilka) {
							case 1:
								break;
							case 2:
								break;
							case 3:
								response.package_info.euro_text =  '- !!! MOTORBIKE !!!' ;
								break;
						}

					}

					response.betDetails = searchResult;

					response.validation.hasErrors = !isValid;

					return response;
				},

				payOut: function (response, type) {

					stakePayoutCalculator.ctorFn([1, 2, 3, 4, 5, 6, 10, 15, 20, 25, 30, 30, 30, 30, 30], 10000000);
					response.validation = {
						errors: [],
						hasErrors: false
					};
					var isValid = true;
					var packageId = response.packageId;
					var playType = getBetTypeFromPackageId(packageId);
					switch (playType) {
						case betTypes.sport:
						case betTypes.live:
							var sportStakes = bettingService.getSportStakesByPackageId(packageId);
							payOutValidateAndProcess(sportStakes, false, response, type, isValid);
							break;
						case betTypes.keno:
							var kenoStakes = bettingService.getKenoSearchResult(packageId);
							payOutValidateAndProcess(kenoStakes, true, response, type, isValid);
							break;
						case betTypes.kaBoom:
							var kaboomStakes = bettingService.getKaBoomSearchResult(packageId);
							payOutValidateAndProcess(kaboomStakes, true, response, type, isValid);
							break;
						case betTypes.pickFive:
							var pickFiveStakes = bettingService.getPickFiveSearchResult(packageId);
							payOutValidateAndProcess(pickFiveStakes, true, response, type, isValid);
							break;
						case betTypes.horses:
							var horseStakes = bettingService.getHorsesSearchResult(packageId);
							payOutValidateAndProcess(horseStakes, true, response, type, isValid);
							break;
						case betTypes.dogs:
							var dogsStakes = bettingService.getDogsSearchResult(packageId);
							payOutValidateAndProcess(dogsStakes, true, response, type, isValid);
							break;
						case betTypes.wof:
							var wofStakes = bettingService.getWofSearchResult(packageId);
							payOutValidateAndProcess(wofStakes, true, response, type, isValid);
							break;
					}

					response.validation.hasErrors = !isValid;

					return response;
				},

				cashOut: function (response, type, country) {

					stakePayoutCalculator.ctorFn([1, 2, 3, 4, 5, 6, 10, 15, 20, 25, 30, 30, 30, 30, 30], 10000000);
					response.validation = {
						errors: [],
						hasErrors: false
					};
					var isValid = true;
					var packageId = response.packageId;
					var playType = getBetTypeFromPackageId(packageId);

					switch (playType) {
						case betTypes.sport:
						case betTypes.live:
							var sportStakes = bettingService.getSportStakesByPackageId(packageId);
							isValid = cashOutValidateAndProcess(sportStakes, false, response, type, country, isValid);
							break;
					}

					response.validation.hasErrors = !isValid;

					return response;
				},

				checkFreeBet: function (response, type, country) {

					stakePayoutCalculator.ctorFn([1, 2, 3, 4, 5, 6, 10, 15, 20, 25, 30, 30, 30, 30, 30], 10000000);
					response.validation = {
						errors: [],
						hasErrors: false
					};
					var isValid = true, sum = 0, _errors = [];
					var packageId = response.packageId;
					var playType = getBetTypeFromPackageId(packageId);
					if(!playType) isValid = false;
					switch (playType) {
						case betTypes.sport:
						case betTypes.live:
							var sportStakes = bettingService.getSportStakesByPackageId(packageId);
							if(!sportStakes) {
                                isValid = false;
                            }
							else {
                                if(sportStakes[0] && sportStakes[0].package_sum) {
									sum = sportStakes[0].package_sum;
									var check = AS.checkFreeBetValidate(sportStakes, country, globalSettings["FreeBetEdge." + country], globalSettings["FreeBetLowEdge." + country], isValid);
									isValid = check.isValid;
									_errors = check.errors;
								}
								else {
									isValid = false;
									_errors = ["This ticket is not available for free bet."];
								}
                            }
							break;
						default:
							isValid = false;
							break;
					}

					response.FreeBet = {
						available : isValid,
						sum : sum,
						errors : _errors
					};

					return response;
				}

			};
		}
	};
};

