const express = require('express'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    compress = require('compression'), //gzip lib
    logger = require('log4js').getLogger('main_server'),
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

  httpApp.set('port', config.get("server.port"));

  httpApp.use(compress()); //gzip support

  httpApp.use(cookieParser());

  httpApp.use(expressSession({
    secret: config.get("server.secretstring")
  }));

  httpApp.use(bodyParser());

  httpApp.use(express.static(__dirname + '/../public'));

  // include all controllers
  fs.readdirSync(__dirname + '/routes')
    .forEach((file) => {
      if(file.substr(-3) !== '.js') {
        var routers = require(__dirname + '/routes/' + file);
        routers.attachHandlers(httpApp);
      }
    });

  httpApp.listen(httpApp.get('port'), () => {
      logger.info('Express server listening on port ' + httpApp.get('port'));
  });

});
