/**
 * Created by xgharibyan on 4/3/15.
 */

var crypto   = require('crypto');
var moment   = require('moment');


module.exports = {

    tokenGenerator :function(userID) {
        return this.keyGenerator(userID);
        // var md5Sum = crypto.createHash('md5');
        // var shaSum = crypto.createHash('sha1');
        // var date = new Date();
        // var salt = '123465798ABSDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+=' + userID;
        // var hashString = date + salt;
        // var tempMD5 = md5Sum.update(hashString).digest('hex');
        // var tempSHA1 = shaSum.update(tempMD5);
        // var userToken = tempSHA1.digest('hex');
        //
        // return userToken;
    },

    keyGenerator: function (userID) {
        var timestamp = (moment().unix()*1000+moment().millisecond());
        var uniqueID = this.makeId();
        var zkey = uniqueID+'.'+userID+'.'+timestamp;
        return zkey;
    },

    makeId: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 6; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    activationCodeGenerator:function(e_email){
        var md5Sum = crypto.createHash('md5');
        var shaSum = crypto.createHash('sha1');
        var date = new Date();
        var hashString = date + e_email;
        var tempMD5 = md5Sum.update(hashString).digest('hex');
        var tempSHA1 = shaSum.update(tempMD5);
        var activationCode = tempSHA1.digest('hex');

        return activationCode
    },
	forgotPasswordCodeGenerator:function(e_email){
		var md5Sum = crypto.createHash('md5');
		var shaSum = crypto.createHash('sha1');
		var date = new Date();
		var salt = '123465798ABSDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+=';
		var hashString = date + e_email + salt;
		var tempMD5 = md5Sum.update(hashString).digest('hex');
		var tempSHA1 = shaSum.update(tempMD5);
		var forgotPasswordCode = tempSHA1.digest('hex');

        return forgotPasswordCode
	}
};
