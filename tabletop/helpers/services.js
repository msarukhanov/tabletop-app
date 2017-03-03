/**
 * Created by Mark Sarukhanov on 20.08.2016.
 */

module.exports = {

    checkFreeBetValidate : function(stakesArray, country, freeBetEdge, freeBetLowEdge, isValid) {

        var nowTime = new Date(), _errors = [];
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
            var firstItem = stakesArray[0];
            if(stakesArray.length <= 8) {
                isValid = false;
                _errors.push("Less 9 bets.");
            }
            if(((wonStake.length + retStake.length) < (stakesArray.length - 1)) || lostStake.length > 1) {
                isValid = false;
                _errors.push("Too many lost games.");
            }
            if(liveStake.length != 0) {
                isValid = false;
                _errors.push("There are live games.");
            }
            if(paidStake != null || firstItem.vdt != null || firstItem.paid_user_id != 0) {
                isValid = false;
                _errors.push("The ticket is already paid.");
            }
            if(singleStake != null) {
                isValid = false;
                _errors.push("Not a multiple ticket.");
            }
            if(pendingStake.length != 0) {
                isValid = false;
                _errors.push("There are pending games.");
            }
            if(firstItem.package_sum >= Number(freeBetEdge)) {
                isValid = false;
                _errors.push("The bet amount should be less than " + freeBetEdge + ".");
            }
            if(firstItem.package_sum < Number(freeBetLowEdge)) {
                isValid = false;
                _errors.push("The bet amount is less than " + freeBetLowEdge + ".");
            }
            if((firstItem.expiration_date < new Date())) {
                isValid = false;
                _errors.push("The ticket has expired.");
            }
            if(false == isValid) {
                console.log('FreeBet Denied');
                console.log('stakesArray.length > 8:',stakesArray.length > 8);
                console.log('(wonStake.length + retStake.length) >= (stakesArray.length - 1):',(wonStake.length + retStake.length) >= (stakesArray.length - 1));
                console.log('liveStake.length == 0:',liveStake.length == 0);
                console.log('paidStake == null:',paidStake == null);
                console.log('singleStake == null:',singleStake == null);
                console.log('pendingStake.length == 0:',pendingStake.length ==0);
                console.log('lostStake.length < 2:',lostStake.length <2);
                console.log('firstItem.package_sum <= Number(freeBetEdge):',firstItem.package_sum <= Number(freeBetEdge));
                console.log('firstItem.package_sum > Number(freeBetLowEdge):',firstItem.package_sum > Number(freeBetLowEdge));
                console.log('(firstItem.vdt != null):',(firstItem.vdt != null));
                console.log('(firstItem.paid_user_id != 0):',(firstItem.paid_user_id != 0));
                console.log('(firstItem.expiration_date < new Date()):',(firstItem.expiration_date < new Date()));
            }
            return {
                isValid : isValid,
                errors : _errors
            };
        }
    }
};
