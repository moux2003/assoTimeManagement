
/**
 * Module dependencies.
 */

var express = require('express');
// var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');

var configDB = require('./config/database.js');

var app = express();

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
// require('./config/passport')(passport); // pass passport for configuration

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// use dot engine
app.engine('dot', require('dot-emc').init({app: app, fileExtension:'dot'}).__express);
app.set('view engine', 'dot');
// others
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(express.bodyParser()); // get information from html forms
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
// required for passport
app.use(express.session({ secret: 'birdsareallmylifeforever' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  // disable cache templating
  app.engine('dot', require('dot-emc').init({app: app, fileExtension:'dot', options:{templateSettings:{cache:false}}}).__express);
}

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// app.get('/', routes.index);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
