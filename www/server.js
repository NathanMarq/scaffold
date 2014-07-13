
var http = require('http'),
    express = require('express'),
    fs = require('fs');

var httpApp = express();

httpApp.set('port', process.env.PORT || 8000);
httpApp.set(express.favicon());

httpApp.use(express.logger('dev'));
httpApp.use(express.bodyParser());
httpApp.use(express.methodOverride());
httpApp.use(express.cookieParser('superdupersecretstring'));
httpApp.use(express.session());
httpApp.use(httpApp.router);
httpApp.use(express.static(__dirname + '/public'));

// include all controllers
fs.readdirSync(__dirname + '/routes/controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require(__dirname + '/routes/controllers/' + file);
      route.controller(httpApp);
  }
});

http.createServer(httpApp).listen(httpApp.get('port'), function(){
    console.log('Express server listening on port ' + httpApp.get('port'));
});
