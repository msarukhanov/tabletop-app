let express         = require('express');
let session         = require('express-session');
let bodyParser      = require('body-parser');
let cookieParser    = require('cookie-parser');
let jade            = require('jade');
let redis = require('redis');
let RedisStore = require('connect-redis')(session);

global._            = require('underscore');

global.redisClient = redis.createClient('//redis-10291.c15.us-east-1-2.ec2.cloud.redislabs.com:10291', {no_ready_check: true});
redisClient.auth('IHxeojO8lhpg8sE12gNQ5gN0dVne5Nx9', function (err) { if (err) {
    console.error(err);
    throw err;
} });
let session_storage = new RedisStore({ host: '//redis-10291.c15.us-east-1-2.ec2.cloud.redislabs.com:10291', port: 18000, client: redisClient});

function redisLog(type) {
    return function () {
        // let arguments = (typeof arguments != 'undefined') ? arguments : '';
        // console.log(type, arguments);
    }
}

redisClient.select(1, function(err, res){ if(!err) 'Redis Client Set to 1 database'});
redisClient.on('connect', redisLog('Redis Connection Opened ...'));
redisClient.on('ready', redisLog('Redis Connection Ready ...'));
redisClient.on('reconnecting', redisLog('Redis Connection Reconnecting ... '));
redisClient.on('error', redisLog('Redis Connection Error ...'));
redisClient.on('end', redisLog('Redis Connection End ...'));

let app = express();


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
app.use('/favicon.ico', express.static('/tabletop/view/images/theweave.ico'));
require('./tabletop')('routes', app);

let port = parseInt(process.env.PORT) || 8877;

let server = app.listen(port, function() {
    console.log( 'Server listening on port %d in %s mode', port, 'dev' );
});

app.io = require('socket.io')();
//let server = require('http').createServer(app);
app.io.listen(server);

app.io.on('connection', function(socket){
    socket.on('ucon', function (msg) {
        socket.UserInfo = msg;
        socket.json.send(["sm", 'connected'])
    });
    socket.on('message', function (msg) {
        if (msg[0]) {
            switch (msg[0]) {
                case 'start':
                    socket.join('server_' + socket.UserInfo.server_id, function() {
                       // console.log(app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id]);
                       //  let clients = app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].sockets;
                       //  for (let clientId in clients) {
                       //      console.log(app.io.sockets.connected[clientId].UserInfo);
                       //  }
                       // // console.log(app.io);
                        socket.json.send(["sm", 'joined', 'server_' + socket.UserInfo.server_id])
                    });
                    break;
                case 'log-s':
                    app.io.sockets.to('server_' + socket.UserInfo.server_id).emit('message', ['log-s', app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs || []]);
                    break;
                case 'upd':
                    switch(msg[1]) {
                        case 'chat':
                            msg[2].dt = new Date();
                            msg[2].username = socket.UserInfo.username;
                            if(app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs) {
                                app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs.push(msg[2]);
                                if(app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs.length > 50) {
                                    app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs.shift();
                                }
                            }
                            else app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs = [msg[2]];
                            app.io.sockets.to('server_' + socket.UserInfo.server_id).emit('message', ['log-u', msg[2]]);
                            break;
                        case 'roll':
                            msg[2].dt = new Date();
                            msg[2].username = socket.UserInfo.username;
                            let D = msg[2].text.split(",")[0], N = msg[2].text.split(",")[1], result = [], i;
                            for(i=0;i<N;i++){result.push(Math.floor(Math.random() * D) + 1)}
                            msg[2].text = N+"d"+D+" roll results : " + result.join(",");
                            if(app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs) {
                                app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs.push(msg[2]);
                                if(app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs.length > 50) {
                                    app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs.shift();
                                }
                            }
                            else app.io.sockets.adapter.rooms['server_' + socket.UserInfo.server_id].logs = [msg[2]];
                            app.io.sockets.to('server_' + socket.UserInfo.server_id).emit('message', ['log-u', msg[2]]);
                            break;
                        case 'log':
                            break;
                    }
                    break;
                case 'dev':
                    switch (msg[1]) {
                        case 'check':
                            console.log(socket);
                            break;
                    }
            }
        }
    });
});
