/**
 * Created by xgharibyan on 4/3/15.
 */

// API Dependencies

module.exports = function (file, app) {
    switch (file) {
        case "routes":
            return require('./routes.js')(app);
            break;
    }
};