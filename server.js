global._ = require('lodash');
global.t = require('moment');

var cookieParser = require('cookie-parser'),
    env = process.env.NODE_ENV || 'development',
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    routes = require('./api/routes');

(function run(appdir) {

  app.use(cookieParser());

  app.dir = appdir;

  // things to do on each request
  app.use(function (req, res, next) {
    // log each request in development environment
    if(env !== 'production') console.log(t().format('HH:MM'), req.method, req.url, req.socket.bytesRead); 

    next();
  });

  // static files
  app.use(express.static(app.dir + '/public'));

  // Standard error handling
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  // to support JSON-encoded bodies
  app.use(bodyParser.json({limit: '2000mb'}));
  // to support URL-encoded bodies
  app.use(bodyParser.urlencoded({
    limit: '2000mb', extended: true
  }));

  routes(app);

  if(cluster.isMaster) { 
    for(var i = 0; i < (numCPUs); i++) {
      cluster.fork();
    }
  }
  else {
    // Fire up server
    var server = app.listen(process.env.PORT || 7000, function() {
      console.log('Listening on port %d', server.address().port);
    });
  }

})(process.cwd());

module.exports = app;