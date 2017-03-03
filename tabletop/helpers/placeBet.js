var http = require('http');

module.exports = function (knex, wait, moment, BS, AS) {
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

			var validMessages = {
				thisPriceIsNotActiveVM: "This price is not active",
				priceIsNotAvailable: "Price is not available",
				notEnoughLimit: "Out of limit for this terminal"
			};

			function isNullOrEmptyOrNotNumber(input) {
				return (input == null
				|| input == 0
				|| typeof input !== 'number');
			}

			function addMessageToValidatable(bet, fieldName, message) {
				var temp = {};
				temp[fieldName] = message;
				bet.validation.errors.push(temp);
				bet.validation.hasErrors = true;
			}

			function validateBetSlipItem(betSlip, user_info) {
				//create container in betSlip for validation
				betSlip.validation = {
					errors: [],
					hasErrors: false
				};

				var isValid = true;

				if (betType == '0') {//single
					if (isNullOrEmptyOrNotNumber(betSlip.stake)) {
						addMessageToValidatable(betSlip, 'single', "Minimum amount is " + globalSettings['MinStakeAmount.' + user_info.user_country]);
						isValid = false;
					} else {//multi

					}

				} else {

				}

				betSlip.validation.hasErrors = !isValid;

				return isValid;
			}

			function validateBetSlips(bet, user_info) {
				var isValid = true;
				_.each(bet.betSlips, function (betSlip) {
					if (validateBetSlipItem(betSlip, user_info)) {
					} else {
						isValid = false;
					}
				});
				return isValid;
			}

			function validateFranchisesUsers(bet) {
				var isValid = true;
				var result = bettingService.getFranchisesByUserId(bet.user_id);
				if (result.length == 0) {
				} else {//is franchise user
					var franchiseUser = result[0];
					var stakeAmount = 0;
					if (betType == 0) {
						stakeAmount = _.reduce(_.pluck(bet.betSlips, 'stake'), function (item1, item2) {
							return item1 + item2;
						}, 0);
					} else {
						stakeAmount = bet.multiStake;
					}
					if (Number(franchiseUser.amount_limit) < Number(stakeAmount)) {
						//add error
						var message = "Your CashBox limit "
							+ franchiseUser.amount_limit + " less then the stake amount " +
							stakeAmount;
						addMessageToValidatable(bet, bet.betType, message);
						isValid = false;
					}
				}
				return isValid;
			}

			function validateModuleBlocks(bet) {

				var isValid = true;

				var blocks = bettingService.getBlocks();

				var defaultBlock = _.find(blocks, function (item) {

					return item.user_id == null;
				});

				var userBlock = _.find(blocks, function (item) {
					return item.user_id == bet.user_id;
				});

				// var isLiveEventExists = _.some(bet.betSlips, function (item) {
				// 	return item.isPreMatch != 1;
				// });
                //
				// if (isLiveEventExists) {
				// 	//TODO: Validate if Live
				// }
                //
				// var isSportEventExists = _.some(bet.betSlips, function (item) {
				// 	return item.isPreMatch == 1;
				// });
                //
				// if (isSportEventExists) {
					if ((defaultBlock && defaultBlock.blocked) || (userBlock && userBlock.blocked)) {
						var message = "Event blocked";
						addMessageToValidatable(bet, bet.betType, message);
						isValid = false;
					}
				// }


				return isValid;

			}

			//Price item validation (C#)
			function validatePriceItems(bet, user_info, timezoneDifference) {
				var isValid = true;

				var elistd = [];
				_.each(bet.betSlips,function(b){
					//console.log(b);
					elistd.push(b.event_id);
				});

				//console.log(elistd);

				var preStakeLimitsPreMatch = bettingService.getPreMatchLimitsBoosted(elistd);
				var preStakeLimitsLive = bettingService.getLiveLimitsBoosted(elistd);

				var liveDefaultLimit = bettingService.getLiveDefaultLimit();
				var preDefaultLimit = bettingService.getPreDefaultLimit();

				var defaultLimitPerBetLimitPreMatch = preDefaultLimit.per_bet_limit;
				var defaultLimitMaxPerLimitPreMatch = preDefaultLimit.max_bet_limit;

				var defaultLimitPerBetLimitLive = liveDefaultLimit.per_bet_limit;
				var defaultLimitMaxPerLimitLive = liveDefaultLimit.max_bet_limit;

				var refIds = _.pluck(bet.betSlips, 'price_reference_id');

				var priceItems = bettingService.getPrePrices(refIds);
				_.each(bet.betSlips, function innerValidation(requestedPrice) {
					var requestedPriceAmount = requestedPrice.stake;
					var isPrematch = (requestedPrice.isPreMatch == true);
					var priceItem;
					var preStakeLimitsForEvents;
					function messageAndInvalid(message) {
						addMessageToValidatable(requestedPrice, bet.betType, message);
						isValid = false;
					}
					function conditionalValidate(array, iterator, message) {
						if (_.some(array, function (item) {
								//console.log('Iterator:',item);
								return iterator(item);
							})) {
							addMessageToValidatable(requestedPrice, bet.betType, message); //validMessages   return (item[itemArg] == requestedPrice[priceArg] && !item.active);
							return true;
						}
						else return false;
					}
					function conditionalValidateArray(arrayArg) {
						var result = _.find(arrayArg, function(validateStep) {
							return conditionalValidate(validateStep[0], validateStep[1], validateStep[2]);
						});
						return result ? false : true ;
					}
					if (isPrematch) {
						//console.log(requestedPrice);
						if(!requestedPrice.market_id) {
							requestedPrice.price_id = requestedPrice.price_reference_id;
							requestedPrice.market_id = bettingService.getPreInfoByPrice(requestedPrice.price_reference_id);
						}
						//console.log(requestedPrice)
						//false true
						//( 2016-07-15 13:00:00 ) 15:00:00  vs  14:16:21

						var tempDate = requestedPrice.eventStartDate;
						tempDate = moment(tempDate).add(timezoneDifference, 'hours');
						//console.log(tempDate <= moment(),tempDate > moment());
						//console.log('(',requestedPrice.eventStartDate,')',tempDate.format('HH:mm:ss'),' vs ',moment().format('HH:mm:ss'));

						if (tempDate <= moment()) {
							messageAndInvalid('This event is started');
							console.log('timezoneDifference:',timezoneDifference);
							console.log('This event',requestedPrice.event_id,'is started (',requestedPrice.eventStartDate,')',tempDate.format('HH:mm:ss'),'<',moment().format('HH:mm:ss'))
						}
						else {
							var priceLimit = bettingService.getPreLimitByPriceRefId(requestedPrice.price_reference_id);
							if (priceLimit != null) messageAndInvalid(requestedPrice, bet.betType, validMessages.thisPriceIsNotActiveVM);
							else {
								preStakeLimitsForEvents = _.filter(preStakeLimitsPreMatch, function (item) {return item.event_id > 0;});
								var preStakeLimitsByCompetition = _.filter(preStakeLimitsPreMatch, function (item) {return (requestedPrice.competition_id == item.competition_id);});
								preStakeLimitsByCompetition = [];
								var condValid = conditionalValidateArray([
									[preStakeLimitsPreMatch, function(item){return (item.price_id == requestedPrice.price_reference_id && !item.active)}, validMessages.thisPriceIsNotActiveVM],
									[preStakeLimitsPreMatch, function(item){return (item.market_id == requestedPrice.market_id && !item.active)}, validMessages.thisPriceIsNotActiveVM],
									[preStakeLimitsPreMatch, function(item){return (item.sport_id == requestedPrice.sport_id && !item.active)}, validMessages.thisPriceIsNotActiveVM],
									[preStakeLimitsForEvents, function(item){return (item.event_id == requestedPrice.event_id && !item.active)}, validMessages.thisPriceIsNotActiveVM],
									[preStakeLimitsByCompetition, function(item){return (!item.active)}, validMessages.thisPriceIsNotActiveVM]
								]);
								if(!condValid)
									isValid=false;
							}
						}
						priceItem = _.find(priceItems, function (item) {
							return (item.price_reference_id == requestedPrice.price_reference_id);
						});
						if (priceItem != null) {
							//if (priceItem.rate != requestedPrice.price_rate && bet.checkRateChanges == false)  messageAndInvalid("The rate has been changed from " + requestedPrice.price_rate + " to " + priceItem.rate);

							if (priceItem.rate != requestedPrice.price_rate && requestedPrice.price_rate.toFixed(2) != (priceItem.rate * (1 * globalSettings["RateChange." + user_info.user_country])).toFixed(2)) {
								if(bet.checkRateChanges == false) {
									//console.log('RCNA',requestedPrice.price_rate,'=>', priceItem.rate);
									messageAndInvalid("The rate has been changed from " + requestedPrice.price_rate + " to " + priceItem.rate);
								}
								else {
									//console.log('RC',requestedPrice.price_rate,'=>', priceItem.rate);
									requestedPrice.price_rate = (priceItem.rate * (1 * globalSettings["RateChange." + user_info.user_country])).toFixed(2);
								}
							}
						} else {
							messageAndInvalid(validMessages.priceIsNotAvailable)
						}
					}
					else {
						//console.log(requestedPrice);
						if(!requestedPrice.market_id) {
							requestedPrice.price_id = requestedPrice.price_reference_id;
							requestedPrice.market_id = bettingService.getLiveInfoByPrice(requestedPrice.price_id);
						}
						priceItem = bettingService.getLivePricesNew(requestedPrice.price_id, requestedPrice.market_id, requestedPrice.event_id)[0];
						var eventItem = bettingService.liveEventCheck(requestedPrice.price_id, requestedPrice.market_id, requestedPrice.event_id)[0];
						var marketItem = bettingService.liveMarketCheck(requestedPrice.price_id, requestedPrice.market_id, requestedPrice.event_id)[0];
						//console.log(priceItem);
						//console.log(requestedPrice);

						//console.log(eventItem,requestedPrice.event_id);
						//console.log(marketItem);

						if (priceItem != null) {
							if (priceItem.rate != requestedPrice.price_rate) {
								if(bet.checkRateChanges == false) {
									//console.log('RCNA',requestedPrice.price_rate,'=>', priceItem.rate);
									messageAndInvalid("The rate has been changed from " + requestedPrice.price_rate + " to " + priceItem.rate);
								}
								else {
									//console.log('RC',requestedPrice.price_rate,'=>', priceItem.rate);
									requestedPrice.price_rate = priceItem.rate;
								}
							}
							if(eventItem.monitor_status != 1) messageAndInvalid("Event is not available");
							if(marketItem.market_status_id != 1) messageAndInvalid("Market is not available");
							if(priceItem.price_status_id != 1) messageAndInvalid("Price is not available");
						} else {
							messageAndInvalid(validMessages.priceIsNotAvailable)
						}
						// var preStakeLimitsByEventSource = _.find(preStakeLimitsLive, function (item) {
						// 	return (item.evnt_src == (1 - requestedPrice.isPreMatch));
						// });

						//console.log(preStakeLimitsLive);

						preStakeLimitsForEvents = _.filter(preStakeLimitsLive, function (item) {
							return ((item.event_id == requestedPrice.event_id) || (item.price_id == requestedPrice.price_id) || (item.market_id == requestedPrice.market_id) || (item.sport_id == requestedPrice.sport_id));
						});
						//console.log('Checking conditional:',requestedPrice);
						//console.log('MBefore:',validMessages);

						if(preStakeLimitsForEvents.length > 0) {

							var condValid = conditionalValidateArray([
								[preStakeLimitsForEvents, function(item){return (item.price_id == requestedPrice.price_id && !item.active);}, validMessages.thisPriceIsNotActiveVM],
								[preStakeLimitsForEvents, function(item){return (item.market_id == requestedPrice.market_id && !item.active);}, validMessages.thisPriceIsNotActiveVM],
								[preStakeLimitsForEvents, function(item){return (item.event_id == requestedPrice.event_id && !item.active);}, validMessages.thisPriceIsNotActiveVM],
								[preStakeLimitsLive, function(item){return (item.sport_id == requestedPrice.sport_id && !item.active);}, validMessages.thisPriceIsNotActiveVM]
							]);

							// var condValid = conditionalValidateArray([
							// 	[preStakeLimitsForEvents, function(item){if (item.price_id == requestedPrice.price_id && !item.active){console.log('0------------------------------------->>>>>',item);return true;}else return false;}, validMessages.thisPriceIsNotActiveVM],
							// 	[preStakeLimitsForEvents, function(item){if (item.market_id == requestedPrice.market_id && !item.active){console.log('1------------------------------------->>>>>',item);return true;}else return false;}, validMessages.thisPriceIsNotActiveVM],
							// 	[preStakeLimitsForEvents, function(item){if (item.event_id == requestedPrice.event_id && !item.active){console.log('2------------------------------------->>>>>',item);return true;}else return false;}, validMessages.thisPriceIsNotActiveVM],
							// 	[preStakeLimitsLive, function(item){if (item.sport_id == requestedPrice.sport_id && !item.active){console.log('3------------------------------------->>>>>',item);return true;}else return false;}, validMessages.thisPriceIsNotActiveVM]
							// ]);
							//console.log(condValid);
							if(!condValid)
								isValid=false;

						}
						else isValid = isValid;
					}

					var priceId, limits = [], competitionId, sportName;

					if (betType == 0) {
						competitionId = 0;
						var defaultPerLimit = 0;
						sportName = null;

						priceId = isPrematch ? requestedPrice.price_reference_id : requestedPrice.price_id ;
						limits = isPrematch ? preStakeLimitsPreMatch : preStakeLimitsLive ;
						defaultPerLimit = isPrematch ? defaultLimitPerBetLimitPreMatch : defaultLimitPerBetLimitLive ;
						if (isPrematch) competitionId = requestedPrice.competition_id;
						else sportName = requestedPrice.sport_name;

						var maxPerBetLimit = getPricePerBetLimit(priceId, requestedPrice.market_id, requestedPrice.event_id, competitionId, requestedPrice.sport_id, limits, defaultPerLimit, requestedPrice.evnt_src, sportName);
						if (requestedPriceAmount > maxPerBetLimit) messageAndInvalid("Max amount for the per bet is " + maxPerBetLimit);
						defaultBetLimit = isPrematch ? defaultLimitMaxPerLimitPreMatch : defaultLimitMaxPerLimitLive ;
						var preStakeLimit = getPricePerBetLimit(priceId, requestedPrice.market_id, requestedPrice.event_id, competitionId, requestedPrice.sport_id, limits, defaultBetLimit, requestedPrice.evnt_src, sportName);
						if (preStakeLimit.max_bet_limit != 0) {
							var preStakeLimitStorage = bettingService.getLimitsStorage(priceId, requestedPrice.evnt_src);
							var maxBetLimit = preStakeLimitStorage == null ? requestedPriceAmount : (preStakeLimitStorage.stake_sum + requestedPriceAmount);
							if (maxBetLimit > preStakeLimit.max_bet_limit) messageAndInvalid("Max amount for the per bet is " + (preStakeLimit.max_bet_limit - (preStakeLimitStorage == null ? 0 : preStakeLimitStorage.stake_sum)));
						}
						if (requestedPriceAmount < Number(globalSettings['MinStakeAmount.' + user_info.user_country])) {
							messageAndInvalid("Minimum amount is " + globalSettings['MinStakeAmount.' + user_info.user_country]);
						}
					}
				});

				//console.log(bet);

				return isValid;
			}

			function validateLimitItems(bet, user_type) {
				var isValid = true;
				if(user_type == 'TERMINAL') {
					if (bet.multiStake > bettingService.getTerminalUserLimit(bet.user_id)) {
						addMessageToValidatable(bet, bet.betType, 'Out of limit for this terminal');
						isValid = false;
					}
				}
				else if(user_type == 'FRANCHISE') {
					if (bet.multiStake > bettingService.getFRUserLimit(bet.cassa_id)) {
						//console.log(bet.cassa_id,bettingService.getFRUserLimit(bet.cassa_id));
						addMessageToValidatable(bet, bet.betType, 'Out of limit for this franchise');
						isValid = false;
					}
				}
				else {}
				return isValid;
			}

			function formatShortCode(shortCode, evnt_src) {

				if(undefined == shortCode)
					shortCode='UNDEF';

				var digits = 4 - shortCode.length;
				if (digits <= 0) {
					return shortCode;
				}

				var shCode = shortCode;

				for (var i = 0; i < digits; i++) {
					shCode = '0' + shCode;
				}

				if (evnt_src != 0) {
					shCode = 'L' + shCode;
				}

				return shCode;
			}

			//Validate Same event prices for express type
			function validateEventPricesForExpressType(bet) {
				var isValid = true;

				if (bet.betType == "multi") {

					var prices = bet.betSlips.slice(0);
					var events = _.pluck(prices, 'event_id');
					var tempEvents = _.uniq(events);
					//var intersection = _.intersection(events, tempEvents);
					function find_duplicates(arr) {
						var len=arr.length, out=[], counts={};
						for (var i=0;i<len;i++) {
							var item = arr[i];
							counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
							if (counts[item] === 2) {out.push(item);}
						}
						return out;
					}
					var duplicates = find_duplicates(events);
					if(duplicates.length > 0 || tempEvents.length < events.length) {
						isValid = false;
						addMessageToValidatable(bet, bet.betType, 'You have chosen one more prices from the same event');
						_.each(bet.betSlips, function(betLine, key){
							if(_.find(duplicates, function(num){return num == betLine.event_id;})) {
								var msg = formatShortCode(bet.betSlips[key].event_short_code, bet.betSlips[key].evnt_src);
								addMessageToValidatable(bet.betSlips[key], bet.betType, 'Event Short Code: ' + msg);
							}
						});
					}
					// if(intersection && intersection.length < events.length) {
					// 	isValid = false;
					// 	addMessageToValidatable(bet, bet.betType, 'You have chosen one more prices from the same event');
					// 	_.each(bet.betSlips, function(betLine, key){
					// 		if(_.find(intersection, function(num){
					// 				console.log(num);
					// 				return num == betLine.event_id;
					// 			})) {
					// 			console.log(key);
					// 			var msg = formatShortCode(bet.betSlips[key].event_short_code, bet.betSlips[key].evnt_src);
					// 			addMessageToValidatable(bet.betSlips[key], bet.betType, 'Event Short Code: ' + msg);
					// 		}
					// 	});
					// }
                    //
					// var pricesLoop = bet.betSlips.slice(0);
                    //
					// _.each(pricesLoop, function (price) {
					// 	prices = _.without(prices, price);
					// 	if (_.some(prices, function (item) {
					// 			return (item.event_id == price.event_id && item.evnt_src == price.evnt_src);
					// 		})) {
					// 		var msg = formatShortCode(price.event_short_code, price.evnt_src);
					// 		addMessageToValidatable(price, bet.betType, 'Event Short Code: ' + msg);
					// 		isValid = false;
					// 	}
					// 	prices.push(price);
					// });
				}
                //
				// if (!isValid) {
				// 	addMessageToValidatable(bet, bet.betType, 'You have chosen one more prices from the same event');
				// }

				return isValid;
			}

			function validatePriceMinAmountForExpressType(bet, real_amount, min_amount) {
				var isValid = true;
				if (betType == 1 && real_amount < min_amount) {
					addMessageToValidatable(bet, bet.betType, 'Minimum amount is ' + min_amount);
					isValid = false;
				}

				return isValid;
			}

			function validatePriceMaxAmountForExpressType(bet, real_amount, max_amount) {
				var isValid = true;

				if (betType == 1 && real_amount > max_amount) {
					addMessageToValidatable(bet, bet.betType, 'Maximum amount is ' + max_amount);
					isValid = false;
				}

				return isValid;
			}

			function getPricePerBetLimit(priceId, marketId, eventId, competitionId, sportId, limits, defaultPerLimit, evnt_src, sportName) {
				var limitByEventSource;
				if (evnt_src != 0) {
					limitByEventSource = _.filter(limits, function (item) {
						//not prematches
						return (item.evnt_src == evnt_src);
					});
				} else {
					limitByEventSource = limits;
				}

				//price
				var priceLimit = _.find(limitByEventSource, function (item) {
					return item.price_id == priceId;
				});
				if (priceLimit != null && priceLimit.per_bet_limit > 0)
					return priceLimit.per_bet_limit;

				//market
				var marketLimit = _.find(limitByEventSource, function (item) {
					return (item.market_id == marketId);
				});
				if (marketLimit != null && marketLimit.per_bet_limit > 0) {
					return marketLimit.per_bet_limit;
				}

				//event
				var eventLimit = _.find(limitByEventSource, function (item) {
					return (item.event_id == eventId);
				});
				if (eventLimit != null && eventLimit.per_bet_limit > 0) {
					return eventLimit.per_bet_limit;
				}

				//competition
				var competitionLimit = _.find(limitByEventSource, function (item) {
					return item.competition_id == competitionId;
				});
				if (competitionLimit != null && competitionLimit.per_bet_limit > 0) {
					return competitionLimit.per_bet_limit;
				}

				if (sportName == null) {
					var sportLimit = _.find(limitByEventSource, function (item) {
						return item.sport_id == sportId;
					});
					if (sportLimit != null && sportLimit.per_bet_limit > 0) {
						return sportLimit.per_bet_limit;
					}
				} else {
					var sportLimit = _.find(limitByEventSource, function (item) {
						return item.sport_name == sportName;
					});
					if (sportLimit != null && sportLimit.per_bet_limit > 0) {
						return sportLimit.per_bet_limit;
					}
				}

				return defaultPerLimit;
			}

			return {

				validateBet: function (bet, user_type, user_info) {
					//create container in bet for validation
					bet.validation = {
						errors: [],
						hasErrors: false
					};
					var now = moment.utc();
					var tz_offset = moment.tz.zone("Africa/Dar_es_Salaam").offset(now);
					var current_offset = moment.tz.zone(user_info.agent_timezone).offset(now);
					var timezoneDifference = (current_offset - tz_offset )/60;
					//get bet type as a number
					betType = bet.betType == "multi" ? '1' : '0';

					var isValid = true;

					var tempMinAmount = Number(globalSettings['MinStakeAmount.' + user_info.user_country]);
					var tempMaxAmount = Number(globalSettings['MaxStakeAmount.' + user_info.user_country]);
					var tempRealAmount = betType == 1 ? bet.multiStake : bet.totalAmount;

					
					// *** Validate global bet ***
					if (betType == 0) {//is single
						if(globalSettings["AllowOrdinars." + user_info.user_country] == '0') {
							addMessageToValidatable(bet, bet.betType, "Betslip should contain more than one event.");
							isValid = false;
						}
					} else {//is multi
						if(globalSettings["AllowOrdinars." + user_info.user_country] == '0' && bet.betSlips.length < 2) {
							addMessageToValidatable(bet, bet.betType, "Betslip should contain more than one event.");
							isValid = false;
						}
						if (isNullOrEmptyOrNotNumber(bet.multiStake)) {
							addMessageToValidatable(bet, bet.betType, "Minimum amount is " + globalSettings['MinStakeAmount.' + user_info.user_country]);
							isValid = false;
						}

						// var total_rate;
						// var ratestocount = _.pluck(bet.betSlips,'price_rate');
						// total_rate = _.reduce(ratestocount,function(memo, num){ return memo * num; }, 1);
                        //
						// if(total_rate > globalSettings['MaxKf'])
						// {
						// 	addMessageToValidatable(bet, bet.betType, "Maximum total odds is "+globalSettings['MaxKf']+".");
						// 	isValid = false;
						// }


					}
					//console.log(bet);
					_.each(bet.betSlips, function(betSlip) {

						var tempDate = new Date(betSlip.eventStartDate);
						tempDate = moment(tempDate).add(timezoneDifference, 'hours');
						if(tempDate < moment() && betSlip.isPreMatch == true) {
							addMessageToValidatable(bet, bet.betType, "One or more events has already started");
							isValid = false;
						}
					});
					// *** Validate betSlips ***
					if (validateBetSlips(bet, user_info) == false) {
						isValid = false;
					} else {
						if (validateFranchisesUsers(bet) == false) {
							isValid = false;
						} else {
							if (validateModuleBlocks(bet) == false) {
								isValid = false;
							} else {
								if (validatePriceItems(bet, user_info, timezoneDifference) == false) {
									isValid = false;
								} else {
									if(validateLimitItems(bet, user_type) == false) {
										isValid = false;
									} else {
										if (validateEventPricesForExpressType(bet) == false) {
											isValid = false;
										}
										if (validatePriceMinAmountForExpressType(bet, tempRealAmount, tempMinAmount) == false) {
											isValid = false;
										}
										if (validatePriceMaxAmountForExpressType(bet, tempRealAmount, tempMaxAmount) == false) {
											isValid = false;
										}
										var _From = JSON.parse(globalSettings["BlockingHours." + user_info.user_country]).s,
											_Till = JSON.parse(globalSettings["BlockingHours." + user_info.user_country]).e,
											_timeFrom = _From.split(":"), _timeTill = _Till.split(":"),
											timeFrom = moment().hour(_timeFrom[0]).minute(_timeFrom[1]).second(0),
											timeTill = moment().hour(_timeTill[0]).minute(_timeTill[1]).second(0);
										if(moment() > timeFrom && moment() < timeTill) {
											addMessageToValidatable(bet, bet.betType, "Betting is not allowed during blocking hours.");
											isValid = false;
										}
										if(bet.freeBetOn) {
											var sportStakes = bettingService.getSportStakesByPackageId(bet.freeBetPackageID);
											if(!AS.checkFreeBetValidate(sportStakes, user_info.user_country, globalSettings["FreeBetEdge." + user_info.user_country], globalSettings["FreeBetLowEdge." + user_info.user_country], isValid)
												|| bet.multiStake >= globalSettings["FreeBetEdge." + user_info.user_country] ) {
												addMessageToValidatable(bet, bet.betType, "Free Bet ticket : " + bet.freeBetPackageID + " is invalid");
												isValid = false;
											}
										}
										if(bet.payoutCodeOn) {
											var payoutCode = bettingService.getPCode(bet.payoutCode);
											if(!payoutCode || payoutCode.used == 1) {
												addMessageToValidatable(bet, bet.betType, "Voucher code is invalid");
												isValid = false;
											}
										}
									}
								}
							}
						}
					}

					bet.validation.hasErrors = !isValid;
					
					return isValid;
				},

				placeBet: function (req, bet, user_info) {
					var dateOfAdmission = new Date();
					var stakeMaxStartDate = _.max(bet.betSlips, function (item) {
						return new Date(item.eventStartDate).getTime();
					});

					stakeMaxStartDate = stakeMaxStartDate.eventStartDate;
					var expirationDate = new Date(dateOfAdmission);

					if(user_info.user_country == "NIGERIA") {
						expirationDate = new Date(stakeMaxStartDate);
						expirationDate = moment(expirationDate).add(7, 'days').format("YYYY-MM-DD hh:mm");
					}
					else {
						expirationDate = moment(expirationDate).add(30, 'days').format("YYYY-MM-DD hh:mm");
						if (expirationDate < stakeMaxStartDate) {
							expirationDate = new Date(stakeMaxStartDate);
							expirationDate = moment(expirationDate).add(7, 'days').format("YYYY-MM-DD hh:mm");
						}
					}

					function genPackId (){
						var t=Math.ceil(new Date().getTime() /(1000)).toString(); var d = Math.ceil(new Date().getTime() /(1000*86400)-17000).toString(); var t5 = d+t.substring(t.length-5,t.length); var pad = "000000000";var tpad = pad.substring(0, pad.length - t5.length) + t5; return tpad;
					}
					//var ticks = ((new Date().getTime()) + 62135596800000).toString();
					var packageId = bet.user_id + "-S" + genPackId();/*ticks.substring(ticks.length - 10, ticks.length);*/
					var betType = bet.betType == "multi" ? '1' : '0';
					var package_sum = (betType == '0'?bet.totalAmount:bet.multiStake);

					if('TANZANIA' == user_info.user_country && package_sum >= 1000) {
						var vcode = bettingService.generateVCode();
					}
					else{
						var vcode = '';
					}

					var preStake = {};
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

					var total_rate, bonusType = 1, bonus_percent;
					var ratestocount = _.pluck(bet.betSlips,'price_rate');
					if (betType == '0') {
						total_rate = _.max(ratestocount);
					} else {
						total_rate = _.reduce(ratestocount,function(memo, num){ return memo * num; }, 1);
					}

					if(user_info.user_country == "TANZANIA" && (user_info.user_type == "SHOP" ||  user_info.user_type == "FRANCHISE")) {
						bonusType = 2;
						bonus_percent = 0;
					}
					else {
						bonusType = Number(globalSettings['BonusType.' + user_info.user_country]);
						bonus_percent = betType==1 ? calculateBetBonusPercent(bonusType, bet.betSlips.length) : 0;
					}

					var taxPercent = Number(globalSettings['Tax.' + user_info.user_country]);
					var exchangeRate = Number(globalSettings['ExchangeRate.' + user_info.user_currency]);

		    		/*
                    *  Raw approach
                    */
                    var raw_betlines = [];
                    var raw_prefix;
                    var raw_fields = [];
                    var raw_balancelimit = "";
                    function raw_sqlify(row){
                        if(_.isEmpty(raw_fields)) {
                            raw_fields = _.keys(row);
                            raw_prefix = "INSERT INTO `betoffice`.s_prestakes ("+raw_fields.join(',')+") VALUES ";
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



					_.each(bet.betSlips, function (item, key) {
						var preStake = {
							bonus_percent: bonus_percent,				
							eid: item.event_id,
							ebid: 0,
							type: betType,
							prm1: item.handicap_value || 0,
							val: item.price_rate,					
							price_reference_id: item.price_reference_id,
							sport_id: item.sport_id,
							market_name: item.market_name,
							market_name_fr : item.market_name_fr.replace(/'/g,"`"),
							market_code: item.market_code,				
							total_rate: (total_rate > globalSettings['MaxKf'] ? globalSettings['MaxKf'] : total_rate.toFixed(2)),
							bonus_type: bonusType,
							package_id: packageId,
							dt: new Date(),
							user_id: bet.user_id,
							is_header: key==0,
							expiration_date: expirationDate,
							tax_percent: taxPercent,							
							currency: user_info.user_currency,
							country: user_info.user_country,
							employee_id: user_info.employee_info ? user_info.employee_info.id : 0,
							vcode: vcode
						};

						preStake.price_name = item.price_name;
						preStake.price_name_fr = item.price_name_fr.replace(/'/g,"`");

						if(item.market_code) {
							if((item.market_code.indexOf("RTG") > -1 || item.market_code.indexOf("OU") > -1 || item.market_code.indexOf("AH") > -1 || item.market_code.indexOf("TGBTS") > -1))
							{
								preStake.price_name += " ("+ (item.handicap_value || 0) +")";
								preStake.price_name_fr += " ("+ (item.handicap_value || 0) +")";
							}
						}


						if(item.isPreMatch == false) {
							preStake.evnt_src = 2;
							preStake.online = 1;
						}
						else {
							preStake.evnt_src = 0;
							preStake.online = 0;
						}

						if (betType == '0') {
							preStake.package_sum = bet.totalAmount;
							preStake.sum = item.stake;
						}
						else {
							preStake.package_sum = bet.multiStake;
							preStake.sum = 0;
						}
						preStake.base_package_sum = preStake.package_sum / exchangeRate;
						preStake.base_sum = preStake.sum / exchangeRate;

						//bettingService.saveBet(preStake);
						raw_betlines.push(raw_sqlify(preStake));
					});


					if(bet.validation.hasErrors == false) {
						var query = "call `betoffice`.SaveBetSafeVcode(\""+raw_prefix + raw_betlines.join(',') +";\","+bet.user_id+","+package_sum+","+(user_info.user_type == "FRANCHISE"?user_info.kassa_id:null) +
							","+(vcode?"'"+vcode+"'":null)+
							","+(vcode?"'"+packageId+"'":null)+");";
						//console.log(query);
						var saferes = bettingService.safeBetSave(query);

						if(saferes){
							bet.betSlips = bettingService.getSportStakesByPackageId(packageId);
							this.postBetAction(user_info,packageId,bet);
							if(bet.freeBetOn) {
								this.updateFreeBet(user_info, bet.freeBetPackageID, bet);
							}
							if(bet.payoutCodeOn) {
								this.updatePayoutCode(user_info, bet.payoutCode, bet);
							}
						}
						else {
							console.log('Safe bet - failed:',query);
							return null;
						}
					}
					return(bet);
				},

				updateFreeBet : function(user_info, packageId, bet) {
					if('NIGERIA' == user_info.user_country) {
						if(bet.freeBetOn) {
							bettingService.cashOutFreeBet(packageId, bet.betSlips[0].package_sum, bet.betSlips[0].base_package_sum, user_info.user_id);
							bettingService.updateUserBalance(user_info.user_id, bettingService.getUserBalance(user_info.user_id) - bet.betSlips[0].package_sum);
                            if('FRANCHISE' == user_info.user_type) bettingService.updateFRUserLimit(user_info.kassa_id, bettingService.getFRUserLimit(user_info.kassa_id), bet.betSlips[0].package_sum);
						}
					}
				},

				updatePayoutCode : function(user_info, pcode, bet) {
					if('NIGERIA' != user_info.user_country) {
						if(bet.payoutCodeOn) {
							bettingService.cashOutPCode(pcode, bet.packageId, user_info.user_id);
							bettingService.updateUserBalance(user_info.user_id, bettingService.getUserBalance(user_info.user_id) - bet.betSlips[0].package_sum);
						}
					}
				},

                postBetAction: function(user_info, packageId, bet){
					// calculating bonus points employee
					if('TANZANIA' == user_info.user_country || 'DR CONGO' == user_info.user_country || 'DR CONGO II' == user_info.user_country) {
						var liveLines = 0, preLines = 0, package_sum;
						_.each(bet.betSlips, function(betLine, key){
							if(betLine.online == 1) liveLines++;
							else preLines++;
							package_sum = betLine.package_sum;
						});
						bettingService.addEmployeeActivity(user_info, 'live', liveLines);
						bettingService.addEmployeeActivity(user_info, 'prematch', preLines);
						bettingService.addEmployeeActivity(user_info, 'package', package_sum);
					}

                    // England - Premier League - Six Balls
                    if('TANZANIA' == user_info.user_country && bet.betSlips[0].package_sum >= 3000) {
                        var resultRows = bettingService.getHasMotoCup(packageId);
                        if(resultRows && resultRows[0] && resultRows[1] && resultRows[2] && resultRows[0].length > 0 && resultRows[1].length > 0 && resultRows[2].length > 0)
                        {
							var count = resultRows[0][0].retval;
							var lastdt_prematch = resultRows[1][0].retval;
							var lastdt_live = resultRows[2][0].retval;

							if(count > 0)
							{
								function zMonday(d){return moment(d).isoWeekday(8).hours(20).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');}
								//var nextmonday = moment(lastdt);
								//nextmonday.day("Monday").hours(20).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');


								var nextgame_pre = zMonday(lastdt_prematch);
								var nextgame_liv = zMonday(lastdt_live);

								console.log(nextgame_pre,nextgame_liv);

								if(null == lastdt_prematch || "Invalid date" == nextgame_pre)
									nextgame_pre = nextgame_liv;
								if(null == lastdt_live || "Invalid date" == nextgame_liv)
									nextgame_liv = nextgame_pre;

								var nextgame = (nextgame_pre > nextgame_liv ? nextgame_pre : nextgame_liv);

								console.log("Moto pre",lastdt_prematch,", Moto liv",lastdt_live, nextgame, bet.betSlips[0].package_id);

								var balls = [];
								var fullstack = _.range(1, 81);

								var iterations = Math.floor(bet.betSlips[0].package_sum / 3000);
								for(var it=0;it<iterations;++it)
								{
									balls = _.sample(_.shuffle(fullstack),6);
									bettingService.addMotoCup(packageId,balls,nextgame);
								}
							}
                        }
                    }

                    var request = require('request');
                    var options = {
                        method: 'post',
                        body: 'PackageId' + packageId,
                        json: false,
                        url: 'http://play.betunit.com:9080/pub?id=Stake',
                        headers: {
                        }
                    };
                    request(options, function (err, res, body) {
                        if (err) {
                            console.log('Error :', err);
                            return null;
                        }
                    });
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
					bettingService.updateTerminalIncome(user_id, bettingService.getTerminalIncome(user_id, 'sport') + amount, 'sport');
				},

				updateTerminalRevenue: function(user_id) {
					bettingService.updateTerminalRevenue(user_id);
				}

			};
		}
	};
};
