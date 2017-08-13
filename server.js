var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');
var timechecker = require('./time-checker');


//Usage of passport
require('./config/passport')(passport);


//ES6 promises
mongoose.Promise = global.Promise;

//Connect to database.
mongoose.connect('mongodb://test:test@ds137220.mlab.com:37220/fast-food-data');



var app = express();

//Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyparser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyparser.json()); // parse application/json
app.use(function (req, res, next){ //configure for cross origin headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
//For sessions.
app.use(session({secret:"BiggieSmalls", resave:false, saveUninitialized:true}));

//Middleware for login and register.
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//define Routes
var route = require('./routes/routes.js')(passport);

//set up template engine 
app.set('view engine', 'ejs');

//static files 
app.use(express.static('./client'));

//middleware for routes
app.use(route);

//Run time checker 
timechecker.start();

//listen to port
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("You are now on port: ",process.env.PORT);
});
