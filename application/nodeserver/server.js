const express = require('express'),
    expressSession = require('express-session'),
    RedisStore = require('connect-redis')(expressSession),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    compress = require('compression'), //gzip lib
    logger = require('log4js').getLogger('main_server'),
    http = require('http'),
    socketio = require('socket.io'),
    domain = require('domain').create();

domain.on('error', (err) => {
	logger.error('Domain error - worthy of a server crash: ');
  logger.error(err.stack);
 // deal with this error somehow - perhaps restart server when all clients disconnect?
});

domain.run(() => {
  process.env.NODE_CONFIG_DIR = "/var/www/application/nodeserver/config";
  process.env.NODE_ENV = "default";
  // process.env.LOG4JS_CONFIG = "/var/www/application/nodeserver/config/log4js.json";
  var config = require("config");

  var httpApp = express();

  var server = http.Server(httpApp);
  var io = socketio(server);

  httpApp.set('port', config.get("server.port"));

  httpApp.use(compress()); //gzip support

  httpApp.use(cookieParser());

  var sessionMiddleware = expressSession({
    store: new RedisStore(),
    secret: config.get("server.secretstring"),
    resave: false,
    saveUninitialized: false

  });

  httpApp.use(sessionMiddleware);

  httpApp.use(bodyParser.json());
  httpApp.use(bodyParser.urlencoded({ extended: true }));
  httpApp.use(methodOverride());

  httpApp.use(express.static(__dirname + '/../public'));

  // include all controllers
  fs.readdirSync(__dirname + '/api')
    .forEach((file) => {
      if(file.substr(-3) !== '.js') {
        var routers = require(__dirname + '/api/' + file);
        if(routers.attachRestHandlers){ routers.attachRestHandlers(httpApp); }
      }
    });

  httpApp.use(function(err, req, res, next) {
    if (err) {
      logger.error(err);
      res.status(500).json(err);
    } else {
      res.status(500).json('Unknown');
    }
  });

  httpApp.use(function(req, res, next) { res.status(404).json({"error": "Oops! Page Not Found."}); });

  io.use(function(socket, next){
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.on('connection', function(socket){
    logger.info("socket.io client now connected!");
    if(socket.request){
      // Do whatever you want for initial connection to websocket

      if(socket.request.headers.cookie){
        // do some special stuff if cookies are enabled on the client
      }

      // then:
      fs.readdirSync(__dirname + '/api')
        .forEach((file) => {
          if(file.substr(-3) !== '.js') {
            var routers = require(__dirname + '/api/' + file);
            if(routers.attachSocketHandlers){ routers.attachSocketHandlers(io, socket); }
          }
        });
    }
    else{
      socket.disconnect();
    }

    socket.on('disconnect', function(){
      logger.info('socket.io client now disconnected...');
    });
  });

  server.listen(httpApp.get('port'), () => {
      logger.info('Express server listening on port ' + httpApp.get('port'));
  });

});
