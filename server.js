var express         = require('express');
var session         = require('express-session');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var jade            = require('jade');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);

global._            = require('underscore');

global.redisClient = redis.createClient('//redis-18000.c11.us-east-1-3.ec2.cloud.redislabs.com:18000', {no_ready_check: true});
redisClient.auth('theweavepassnodejs111', function (err) { if (err) throw err; });
var session_storage = new RedisStore({ host: '//redis-18000.c11.us-east-1-3.ec2.cloud.redislabs.com', port: 18000, client: redisClient});

function redisLog(type) {
    return function () {
        var arguments = (typeof arguments != 'undefined') ? arguments : '';
        console.log(type, arguments);
    }
}

redisClient.select(1, function(err, res){ if(!err) 'Redis Client Set to 1 database'});
redisClient.on('connect', redisLog('Redis Connection Opened ...'));
redisClient.on('ready', redisLog('Redis Connection Ready ...'));
redisClient.on('reconnecting', redisLog('Redis Connection Reconnecting ... '));
redisClient.on('error', redisLog('Redis Connection Error ...'));
redisClient.on('end', redisLog('Redis Connection End ...'));

var app = express();
app.set('view engine', 'jade');
app.use(cookieParser('theweavenodejsmylongsecretkey!@#$%'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    key: 'express.sid',
    store: session_storage,
    secret: 'theweavenodejsmylongsecretkey!@#$%',
    saveUninitialized: true,
    resave: false
}));
//app.use(i18n.init);
app.set('views', '' + __dirname + '/tabletop/view');
app.use('/favicon.ico', express.static('./files/img/theweave.ico'));
require('./tabletop')('routes', app);

var port = parseInt(process.env.PORT) || 8888;
app.listen(port, function() {
    console.log( 'Server listening on port %d in %s mode', port, 'dev' );
});

