var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');


//YOU NEED TO DELETE THIS BEFORE PUSHING 
//***********TWILIO CONFIG****************************
const accountSid = 'AC2394ac048859f6b48e7cdf630c29e631';
const authToken = '7746ed52d16e0f369aa2de3dfcf81940';
const twilio = require('twilio')(accountSid, authToken);
//***********************************************

console.log(twilio);


twilio.messages.create({
  from: '+13236010551',
  to: '+18184278207',
  body: "Free breezy hoe"
}, function(err, message) {
  if(err) {
    console.error(err.message);
  }
});

//Get all MLB data.
var gamedayHelper = require('gameday-helper');

//Help get the date for the gameDayHelper.
var date = new Date();
console.log("Wow: ", date);

//For testing purposes
//'8/8/17'
gamedayHelper.masterScoreboard( new Date(date))
.then( function( data ){
  // Array of objects with data related to a single game
  console.log("Issa wow",date);
  console.log(data.game[0].home_team_name);
  console.log(data.game[0].away_team_name);
  
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
      console.log("We have a dodger game");
  }else {
      console.log("No game to be found.");
  }
  
  
  
})
.catch( function( error ) {
  console.log( error );
});


//Setup express app.
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

//Update requests to console.
app.use(session({secret:"BiggieNYC", resave:false, saveUninitialized:true}));

//listen to port
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Your are now on port: ", process.env.PORT);
});

