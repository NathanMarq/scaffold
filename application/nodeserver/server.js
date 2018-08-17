const express = require('express'),
    expressSession = require('express-session'),
    sioRedis = require('socket.io-redis'),
    farmhash = require('farmhash'),
    RedisStore = require('connect-redis')(expressSession),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    os = require('os'),
    fs = require('fs'),
    compress = require('compression'), //gzip lib
    logger = require('log4js').getLogger('main_server'),
    http = require('http'),
    socketio = require('socket.io'),
    cluster = require('cluster'),
    domain = require('domain'),
    net = require('net');

/*
  PER NODE DOCUMENTATION:
*/
if(cluster.isMaster){ // this is where we'll build out all the child workers:

  var workers = [],
      num_workers = os.cpus().length; // # of workers is same as CPU count

  for(var i = 0; i < num_workers; i++){
    var worker = cluster.fork();
    var next = workers.push(worker);
    logger.info("worker #" + (next - 1) + " started.");
  }

  // Helper function for getting a worker index based on IP address.
  var worker_index = (ip, len) => {
    return farmhash.fingerprint32(ip) % len;
  };

  // Create the main front-facing server listening on our port.
  net.createServer({ pauseOnConnect: true }, (connection) => {
    // We received a connection and need to pass it to the appropriate
    // worker. Get the worker for this connection's source IP and pass
    // it the connection.
    var idx = worker_index(connection.remoteAddress, num_workers);
    var worker = workers[idx];
    worker.send('sticky-session:connection', connection);
  })
  .listen(8000, () => {
    logger.info('Connection management server listening on port 8000');
  });

  cluster.on('disconnect', () => { // worker can be passed here as a param
    logger.error('Disconnected from worker! Starting a new one.');
    var next = workers.push(cluster.fork());
    logger.info("worker #" + (next - 1) + " started.");
  });

}
else {
  // the worker

  const d = domain.create();

  // See the cluster documentation for more details about using
  // worker processes to serve requests. How it works, caveats, etc.

  process.env.NODE_CONFIG_DIR = "/var/www/application/nodeserver/config";
  process.env.NODE_ENV = "default";
  // process.env.LOG4JS_CONFIG = "/var/www/application/nodeserver/config/log4js.json";
  var config = require("config");

  var httpApp = express();

  var server = http.Server(httpApp);

  var io = socketio(server);
  io.adapter(sioRedis({ host: 'localhost', port: 6379 }));

  httpApp.set('port', 0); // set this to internal port 0...

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

  d.on('error', (err) => {
    logger.error('Domain error - worthy of a server crash: ');
    logger.error(err.stack);

    // Note: We're in dangerous territory!
    // By definition, something unexpected occurred,
    // which we probably didn't want.
    // Anything can happen now! Be very careful!

    try {
      // make sure we close down within 30 seconds
      const killtimer = setTimeout(() => {
        process.exit(1);
      }, 30000);
      // But don't keep the process open just for that!
      killtimer.unref();

      // stop taking new requests.
      server.close();

      // Let the master know we're dead. This will trigger a
      // 'disconnect' in the cluster master, and then it will fork
      // a new worker.
      cluster.worker.disconnect();

      // try to send an error to the request that triggered the problem,
      // assuming we have access to res, req:
      // res.statusCode = 500;
      // res.setHeader('content-type', 'text/plain');
      // res.end('Oops, there was a problem!\n');
    } catch (er2) {
      // oh well, not much we can do at this point.
      console.error(`Error sending 500! ${er2.stack}`);
    }
  });

  // Now, run all our API/buggy code within the "domain":
  d.run(function(){
    // This is where we put our bugs!

    // include all API modules:
    fs.readdirSync(__dirname + '/api')
      .forEach((file) => {
        if(file.substr(-3) !== '.js') {
          var routers = require(__dirname + '/api/' + file);
          if(routers.attachRestHandlers){ routers.attachRestHandlers(httpApp); }
        }
      });

    // handle errors if we don't capture the request from the API modules:
    httpApp.use(function(err, req, res, next) {
      if (err) {
        logger.error(err);
        res.status(500).json(err);
      } else {
        res.status(500).json('Unknown');
      }
    });

    httpApp.use(function(req, res, next) {
      res.status(404).json({"error": "Oops! Page Not Found."});
    });

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
      logger.info('Worker Express server listening on port ' + httpApp.get('port'));
    });

    // Listen to messages sent from the master. Ignore everything else.
    process.on('message', function(message, connection) {
      if(message !== 'sticky-session:connection') { return; }

      // Emulate a connection event on the server by emitting the
      // event with the connection the master sent us.
      server.emit('connection', connection);

      // re-connect the client with this worker:
      connection.resume();
    });

  });
}
