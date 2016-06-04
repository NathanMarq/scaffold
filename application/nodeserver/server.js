
var express = require('express'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    compress = require('compression'), //gzip lib
    logger = require('log4js').getLogger('main_server'),
    domain = require('domain').create();

domain.on('error', function(err) {
	logger.error('Domain error - worthy of a server crash: ');
  logger.error(err.stack);
 // deal with this error somehow - perhaps restart server when all clients disconnect?
});

domain.run(function() {

  var httpApp = express();

  httpApp.set('port', 8000);

  httpApp.use(compress()); //gzip support

  httpApp.use(cookieParser());

  httpApp.use(expressSession({
    secret: 'superdupersecretstring'
  }));

  httpApp.use(bodyParser());

  httpApp.use(express.static(__dirname + '/../public'));

  // include all controllers
  fs.readdirSync(__dirname + '/routes/controllers').forEach(function (file) {
    if(file.substr(-3) === '.js') {
        var route = require(__dirname + '/routes/controllers/' + file);
        route.controller(httpApp);
    }
  });

  httpApp.listen(httpApp.get('port'), function(){
      logger.info('Express server listening on port ' + httpApp.get('port'));
  });

});
