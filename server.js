var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');

//Usage of passport
require('./config/passport')(passport);

//Connect to database.
mongoose.connect('mongodb://test:test@ds137220.mlab.com:37220/fast-food-data');

//ES6 promises
mongoose.Promise = global.Promise;


//YOU NEED TO SAVE AND DELETE THIS BEFORE PUSHING
//Change for publication. **********************!IMPORTANT********************
//***********TWILIO CONFIG****************************

const twilio = require('twilio')(accountSid, authToken);
//***********************************************

//Module to get all gameday data.
var gamedayHelper = require('gameday-helper');

//Help get the date for the gameDayHelper.
var date = new Date();

var CronJob = require('cron').CronJob;

var currenthour = 0;
new CronJob('* * * * * *', function() {
    currenthour = date.getHours();
    console.log(currenthour);
}, null, true, 'America/Los_Angeles');

console.log(currenthour);
//For testing purposes
//'8/8/17'
//Get gameday data.
gamedayHelper.masterScoreboard( new Date(date))
.then( function( data ){
  // Array of objects with data related to a single game
  
  var index =-1;
  
  for(var count = 0; count < data.game.length; count++)
  {
      if(data.game[count].home_team_name=="Dodgers" || data.game[count].away_team_name=="Dodgers")
      {
          index = count;
      }
  }
  
  if(index > -1)
  {
      
  }
  else 
  {
     /* twilio.messages.create({
        from: '+13236010551',
        to: '+18184278207',
        body: "The Dodgers are not playing today!"
      }, function(err, message) {
        if(err) {
          console.error(err.message);
        }
      }); */
  }
  
  
  
})
.catch( function( error ) {
  console.log( error );
});


//Setup express app.
var app = express();

//Setup route variable.
var route = require('./routes/routes.js')(passport);

//Route middleware.
app.use(route);


//set up template engine 
app.set('view engine', 'ejs');

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

//Update requests to console.
app.use(session({secret:"BiggieNYC", resave:false, saveUninitialized:true}));

//listen to port
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Your are now on port: ", process.env.PORT);
});

