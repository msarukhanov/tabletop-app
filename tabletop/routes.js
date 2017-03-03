/**
 * Created by xgharibyan on 4/3/15.
 */
var md5 = require('MD5');
var latestData = require('moment-timezone/data/packed/latest.json');
var moment_timezone = require('moment-timezone');
moment_timezone.tz.load(latestData);

var http = require('http');
//var wait = require('wait.for');
var knex = require('knex')({
    client: 'pg',
    connection: 'postgres://gxlwcegldechzz:073cc0afaa097f77f818c89d3d3e9d1a2309ba743977e63a78c86bb5662b9afc@ec2-54-225-230-243.compute-1.amazonaws.com:5432/d12ief33mdff9t?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
    //connection: {
    //    host: 'ec2-54-225-230-243.compute-1.amazonaws.com',
    //    port: '5432',
    //    user: 'gxlwcegldechzz',
    //    password: '073cc0afaa097f77f818c89d3d3e9d1a2309ba743977e63a78c86bb5662b9afc',
    //    database: 'd12ief33mdff9t',
    //    debug: false,
    //    pool: {
    //        min: 0,
    //        max: 10
    //    }
    //}
});
//knex.raw("create table if not exists `users` (`id` int unsigned not null auto_increment primary key, `name` varchar(255), `created_at` datetime, `updated_at` datetime)")
//    .then(function(data) {
//        console.log(data);
//    }, function(err) {
//        console.log(err);
//    });
//knex.schema.dropTableIfExists('users').then(function(data) {
//    console.log(data);
//}, function(err) {
//    console.log(err);
//});
//knex.schema.createTableIfNotExists('users', function(table) {
//    table.increments('user_id').primary();
//    table.string('username');
//    table.string('password');
//    table.integer('server_id');
//    table.integer('char_id');
//    table.dateTime('joined_at')
//}).then(function(data) {
//        console.log(data);
//    }, function(err) {
//        console.log(err);
//    });
//knex.schema.alterTable('users', function(t) {
//    t.unique('username')
//}).then(function(data) {
//    console.log(data);
//}, function(err) {
//    console.log(err);
//});
//knex('users').insert({
//    username: 'mmalkav',
//    password: '1',
//    joined_at: new Date()
//}).then(function(data) {
//    console.log(data);
//}, function(err) {
//    console.log(err);
//});
knex.select().table('users')
    .then(function(data) {
        console.log(data);
    }, function(err) {
        console.log(err);
    });
//knex.schema.createTableIfNotExists('servers', function(table){
//    table.increments('id').primary();
//    table.string('title');
//    table.string('body');
//    table.integer('author_id')
//        .references('uid')
//        .inTable('users');
//    table.dateTime('postDate');
//});
//knex.schema.createTableIfNotExists('comments', function(table){
//    table.increments('id').primary();
//    table.string('body');
//    table.integer('author_id')
//        .references('uid')
//        .inTable('users');
//    table.integer('post_id')
//        .references('id')
//        .inTable('posts');
//    table.dateTime('postDate');
//});

var redisRequests = require('./redisRequests');
//
//var BS = require('./helpers/bettingService')(knex, wait);
//var AS = require('./helpers/services');
//var PlaceBet = require('./helpers/placeBet')(knex, wait, moment_timezone, BS, AS);
//var GameBet = require('./helpers/gameBet')(knex, wait, moment_timezone, BS);
//var PayBet = require('./helpers/payBet')(knex, wait, moment_timezone, BS, AS);
//var Prematch = require('./helpers/prematch')(knex, wait, BS);

global.BetOfficeRoute = function(app, route, callback, permissions) {
    return app.post('/office/'+route, function (req, res) {
        if (req.headers.authorization == undefined) {
            res.send({error: true, message: 'Authorizatioin token required', error_code: 'auth_1'}).end();
        }
        else {
            redisRequests.Getter(req.headers.authorization, function (result) {
                if (result.error != true && result.data != null) {
                    if(permissions) {
                        if(permissions.indexOf(result.data.user_type) > -1) {
                            try {
                                callback(req, res, result.data);
                            } catch (ex) {
                                console.error(ex);
                                res.send({success: false, err: ex.message}).end();
                            }
                        }
                        else {
                            res.send({error: true, message: 'Access denied.'}).end();
                        }
                    }
                    else {
                        callback(req, res, result.data);
                    }
                }
                else {
                    res.send({error: true, message: 'Session Expired or User does not exist', error_code: 'err_5'}).end();
                }
            })
        }
    });
};
global.userToRedis = function(user, cookieExpireTime, callback) {
    redisRequests.SetterEx(user.user_token, cookieExpireTime, user, function (result) {
        if (result.error != true) {
            var allow_use_settings = user.user_level == 1;
            callback({
                error: false,
                message: 'Success',
                allow_use_settings: allow_use_settings,
                data: _.pick(user, 'user_token', 'username', 'agent_timezone', 'user_country', 'user_language', 'employee_info')
            });
        }
        else {
            callback({error: true, message: 'Error', error_code: 'Red_1'});
        }
    });
};

module.exports = function (app) {

    //var Account = require('./models/account')(app, knex, md5, crypto, generators);
    //Account.regRoutes();

	app.get('/', function (req, res) {
		res.render('./index', {title: 'TableTap App'});
	});

	app.get('/files/*', function (req, res) {
		res.sendFile(req.params[0], {root: __dirname + "/view"});
	});

	return app;
};


