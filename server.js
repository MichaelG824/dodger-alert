var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var mlb = require('mlb-scores');

//Error handle: 
//It is behind 3 games.
mlb.getGameUrl('dodgers', new Date(2017,8,9), function(err, url){
  if (!err){
    mlb.getGameInfo(url, function(err, data){
      if(err)
          throw err;
          
      console.log(JSON.stringify(data, null, 4));
    });
  }
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

