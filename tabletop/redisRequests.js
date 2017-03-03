/**
 * Created by xgharibyan on 4/3/15.
 */

module.exports = {

    SetterEx: function (key, duration, value, callback) {
        redisClient.SETEX(key, parseInt(duration), JSON.stringify(value), function (error, result) {
            if (!error) {
                callback({error: false, data: result, message: 'success'});
                return;
            }
            callback({error: true, message: error});
        });
    },

    Getter: function (key, callback) {
        redisClient.get(key, function (error, res) {
            if (!error) {
                callback({error: false, data: JSON.parse(res), message: 'success'});
                return;
            }
            callback({error: true, message: error});
        });
    },

    Updater : function(key, value, callback) {
        redisClient.set(key, JSON.stringify(value), function (error, res) {
            if (!error) {
                callback({error: false, data: res, message: 'success'});
                return true;
            }
            callback({error: true, message: error});
            return true;
        });
    },

    Expirer: function (key, duration, callback) {

        redisClient.expire(key, duration, function (error, result) {
            if (!error) {
                callback({error: 'false', data: result, message: 'success'});
            }
            callback({error: 'true', message: error})
        });
    }

};
