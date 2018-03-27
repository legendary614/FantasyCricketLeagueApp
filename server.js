var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(path.join(__dirname, 'client')));

// required for passport
app.use(session({ secret: 'cricmybrain' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./router/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./router/matchroutes.js')(app);
//require('./models/mailer.js');



if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// Test Email

// var mailer = require('./models/mailer');
// var text = "Hello world\n"+
//           "===========\n"+
//           "\n"+
//           "How are you?"
// mailer.sendEmail('vinit.adkar@gmail.com', 'V', '<h1>Hello world</h1><p><b>How</b> are you?', text, function (message) {console.log(message)})

console.log("Server Initialized Sucessfully!!!!")
module.exports = app;