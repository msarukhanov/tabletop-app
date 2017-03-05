/**
 * Created by xgharibyan on 4/3/15.
 */
var md5 = require('MD5');
var latestData = require('moment-timezone/data/packed/latest.json');
var moment   = require('moment');
var moment_timezone = require('moment-timezone');
moment_timezone.tz.load(latestData);

var http = require('http');
//var wait = require('wait.for');
var knex = require('knex')({
    client: 'pg',
    connection: 'postgres://gxlwcegldechzz:073cc0afaa097f77f818c89d3d3e9d1a2309ba743977e63a78c86bb5662b9afc@ec2-54-225-230-243.compute-1.amazonaws.com:5432/d12ief33mdff9t?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
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
//    table.string('type');
//    table.integer('server_id');
//    table.integer('char_id');
//    table.dateTime('joined_at')
//}).then(function(data) {
//        console.log(data);
//    }, function(err) {
//        console.log(err);
//    });
//knex.schema.alterTable('chars', function(table) {
//    //table.unique('username')
//    //table.dropColumn('char_id');
//    //table.integer('char_id')
//    //    .references('id')
//    //    .inTable('chars');
//    //table.dropColumn('char_id');
//    //table.dropColumn('char_id');
//    table.integer('charlist_id')
//        .references('list_id')
//        .inTable('charlists');
//    table.integer('bio_id')
//        .references('bio_id')
//        .inTable('bios');
//}).then(function(data) {
//    console.log(data);
//}, function(err) {
//    console.log(err);
//});
//knex('chars').insert({
//    char_name: 'Vincent Krieg',
//    user_id: 1,
//    type: 'admin',
//    password: '1',
//    created_at: new Date()
//}).then(function(data) {
//    console.log(data);
//}, function(err) {
//    console.log(err);
//});
//knex('users').where('user_id', 1).del().then(function(data) {
//        console.log(data);
//    }, function(err) {
//        console.log(err);
//    });
//knex.select().table('users')
//    .then(function(data) {
//        console.log(data);
//    }, function(err) {
//        console.log(err);
//    });
//knex.schema.createTableIfNotExists('servers', function(table){
//    table.increments('id').primary();
//    table.string('title');
//    table.string('body');
//    table.integer('author_id')
//        .references('uid')
//        .inTable('users');
//    table.dateTime('postDate');
//});
//knex.schema.createTableIfNotExists('chars', function(table){
//    table.increments('id').primary();
//    table.string('char_name');
//    table.integer('user_id')
//        .references('user_id')
//        .inTable('users');
//    //table.integer('charlist_id')
//    //    .references('list_id')
//    //    .inTable('charlists');
//    //table.integer('bio_id')
//    //    .references('bio_id')
//    //    .inTable('bios');
//    //table.integer('server_id')
//    //    .references('server_id')
//    //    .inTable('servers');
//    table.dateTime('created_at');
//}).then(function(data) {
//    console.log(data);
//}, function(err) {
//    console.log(err);
//});
//knex.schema.createTableIfNotExists('charlists', function(table){
//    table.increments('id').primary();
//    table.integer('char_id')
//        .references('id')
//        .inTable('chars');
//    table.jsonb('list');
//    table.dateTime('updated_at');
//    table.dateTime('created_at');
//}).then(function(data) {
//    console.log(data);
//}, function(err) {
//    console.log(err);
//});
//knex.schema.createTableIfNotExists('chars', function(table){
//    table.increments('id').primary();
//    table.string('char_name');
//    table.integer('user_id')
//        .references('user_id')
//        .inTable('users');
//    //table.integer('charlist_id')
//    //    .references('list_id')
//    //    .inTable('charlists');
//    //table.integer('bio_id')
//    //    .references('bio_id')
//    //    .inTable('bios');
//    //table.integer('server_id')
//    //    .references('server_id')
//    //    .inTable('servers');
//    table.dateTime('created_at');
//}).then(function(data) {
//    console.log(data);
//}, function(err) {
//    console.log(err);
//});

var redisRequests = require('./redisRequests');


global.appRoute = function(app, route, callback, permissions) {
    return app.post('/api/'+route, function (req, res) {
        if (req.headers.authorization == undefined) {
            res.send({error: true, message: 'Authorization token required', error_code: 'auth_1'}).end();
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
            callback({error: false, message: 'Success', data: user});
        }
        else {
            callback({error: true, message: 'Error', error_code: 'Red_1'});
        }
    });
};

module.exports = function (app) {

    //var Account = require('./models/account')(app, knex, md5, crypto, generators);
    //Account.regRoutes();

    app.post('/api/signIn', function (req, res) {
        if (req.headers.authorization == undefined) {
            knex('users').select('*')
                .where({
                    username: req.body.username,
                    password: req.body.password
                })
                .then(function (rows) {
                    if (_.isEmpty(rows)) {
                        res.send({error: true, message: 'Email or Password is Wrong', data: null})
                    }
                    else {
                        var timestamp = (moment().unix()*1000+moment().millisecond());
                        var uniqueID = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 6; i++) uniqueID += possible.charAt(Math.floor(Math.random() * possible.length));
                        rows[0].user_token = uniqueID+'T'+rows[0].user_id+'T'+timestamp;
                        userToRedis(rows[0], 30000, function(data) { res.send(data) });
                    }
                }, function (error) {
                    res.send({error: true, message: 'Database error' + error.toString().split("at")[0], data: null})
                });
        }
        else {
            res.send({error: true, message: 'Authorization token required', error_code: 'auth_1'}).end();
        }
    });

    appRoute(app, 'accountInfo', function(req,res,currentUser) {
        if(currentUser) {
            res.send({error: false, data: currentUser}).end();
        }
        else {
            res.send({error: true, message: 'Authorization token required', error_code: 'auth_1'}).end();
        }
    });



	app.get('/', function (req, res) {
		res.render('./index', {title: 'TableTap App'});
	});

	app.get('/files/*', function (req, res) {
		res.sendFile(req.params[0], {root: __dirname + "/view"});
	});

	return app;
};


