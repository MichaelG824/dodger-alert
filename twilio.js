const config = require('./config.js');

//***********TWILIO CONFIG****************************
const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const twilio = require('twilio')(accountSid, authToken);
//***********************************************

//***************GET INSTANT TIME******************
var time = require('time');
var now = new time.Date();
now.setTimezone("America/Los_Angeles");
//*************************************************



//*************GET INSTANT DATE ******************
var date = new Date();
var utcDate = new Date(date.toUTCString());
utcDate.setHours(utcDate.getHours()-8);
var usDate = new Date(utcDate);

//Get the right string for date.
var string = usDate.toLocaleDateString();
//*************************************************

//User schema 
const Users = require('./models/Users.js');

//Module to get all gameday data.
var gamedayHelper = require('gameday-helper');

//Check the time of the Dodger game to see if it needs a reminder,
//If they do send notifications.
var sendNotifications = function()
{
    //Get gameday data
    gamedayHelper.masterScoreboard( new Date(string))
    .then( function( data )
    {
      
      //Get 24:00 time
      var time = now.getHours() + ':' + now.getMinutes();
      
      //Parse it into a new variable.
      var newtime = parseTime(time);
      
      //Get PM or AM 
      var meridian = newtime.substring(5);
      
      //Get time alone
      var time = newtime.substring(0,5);
      
      
      
      
      
      var index =-1;
      
      //Iterate through and find the Dodger game. 
      for(var count = 0; count < data.game.length; count++)
      {
          if(data.game[count].home_team_name=="Dodgers" || data.game[count].away_team_name=="Dodgers")
          {
              index = count;
          }
      }
      
      //Found the dodger game 
      if(index > -1)
      {
        //*******GET THE ENDING TIME************************** 
          var endtime;
          
          var ishome = false;
          
          if(data.game[index].home_team_name == "Dodgers")
          {
              endtime = data.game[index].home_time.substring(0,1);
              ishome = true;
          }
          else {
              endtime = data.game[index].away_time(0,1);
          }
          endtime = parseInt(endtime);
          
          //If the end time is passed 12.
          if((endtime + 4) > 12){
              endtime = (endtime + 4) - 12;
          } else {
              endtime += 4;
          }
          
          endtime = endtime.toString();
          
          if(ishome){
              endtime += data.game[index].home_time.substring(1);
          }else{
              endtime += data.game[index].away_time.substring(1);
          }
          console.log(endtime);
          //**********************************************
          
          //Send message on game time. 
          if((data.game[index].home_time == time && meridian == "PM") && (data.game[index].home_team_name == "Dodgers") || (data.game[index].away_time == time && meridian == "PM") && (data.game[index].away_team_name == "Dodgers"))
          {
              //**************PRE-GAME INFO***********************
              var stadium =  data.game[index].venue;
              var tv = data.game[index].broadcast.home.tv;
              var homepitcher = data.game[index].home_probable_pitcher.name_display_roster;
              var awaypitcher = data.game[index].away_probable_pitcher.name_display_roster;
              var awaythrowinghand = data.game[index].away_probable_pitcher.throwinghand;
              var homethrowinghand = data.game[index].home_probable_pitcher.throwinghand;
              var homewins = data.game[index].home_probable_pitcher.wins;
              var awaywins = data.game[index].away_probable_pitcher.wins;
              var homelosses = data.game[index].home_probable_pitcher.losses;
              var awaylosses = data.game[index].away_probable_pitcher.losses;
              var hometeam = data.game[index].home_team_name;
              var awayteam = data.game[index].away_team_name;
              var homeera = data.game[index].home_probable_pitcher.era;
              var awayera = data.game[index].away_probable_pitcher.era;
             //**********************************************
              
                //*********PARSE THE BODY ***************************
               var body = "";
               
               body += "\n";
               body += "     "  + hometeam + "  VS  " + awayteam + "\n";
               
               body += "TV: " + tv + "\n";
               body += "     @  " + stadium + "\n";
               body += "-------------------------------\n"
               body += "SP:   " + homepitcher + "    " + awaypitcher + "\n";
               body += "R/L:    " + homethrowinghand + "        " + awaythrowinghand + "\n";
               body += "W-L:   " + homewins + "-" + homelosses + "       " + awaywins + "-" + awaylosses + "\n";
               body += "ERA:   " + homeera + "       " + awayera;
               body += "        ";
               //***********************************************************       
                     
             //Cycle through all users. 
              Users.find({} , (err, users) => 
              {
                if(err) 
                  throw err;
                
                
                  users.map(user => 
                  {
                      const options = 
                      {
                          to: `+ ${user.phonenumber}`,
                          from: '+13236010551',
                          body: body,
                      }
                      
                      //Create pre-game message and send to all users
                      twilio.messages.create(options, function(err,message)
                      {
                        if(err)
                          console.log(err);
                          
                        console.log(message);
                      }); 
                  }); 
              });
          }
          
          
          //After game ends, send final score
          else if((endtime == time && meridian == "PM") && (data.game[index].home_team_name == "Dodgers") || (endtime == time && meridian == "PM") && (data.game[index].away_team_name == "Dodgers"))
          {
              //*************POST GAME DATA *********************************
              var homescore = data.game[index].linescore.r.home;
              var awayscore = data.game[index].linescore.r.away;
              var winningpitcher = data.game[index].winning_pitcher.name_display_roster;
              var winningpitcherwins = data.game[index].winning_pitcher.wins;
              var winningpitcherlosses = data.game[index].winning_pitcher.losses;
              var losingpitcher = data.game[index].losing_pitcher.name_display_roster;
              var losingpitcherlosses = data.game[index].losing_pitcher.losses;
              var losingpitcherwins = data.game[index].losing_pitcher.wins;
              var hometeam = data.game[index].home_team_name;
              var awayteam = data.game[index].away_team_name;
              //**************************************************************
              
              //*************PARSE BODY***************************************
              var body = "\n";
              body += "Final score: \n";
              body += hometeam + ": " + homescore + " " + awayteam + ": " + awayscore + "\n";
              body += "WP:" + winningpitcher + "(" + winningpitcherwins + "-" + winningpitcherlosses + ")\n";
              body += "LP: " + losingpitcher + "(" + losingpitcherwins + "-" + losingpitcherlosses + ")\n";
              //**************************************************************
              
              //Cycle through all users. 
              Users.find({} , (err, users) => 
              {
                if(err) 
                  throw err;
                
                
                  users.map(user => 
                  {
                      const options = 
                      {
                          to: `+ ${user.phonenumber}`,
                          from: '+13236010551',
                          body: body,
                      }
                      
                      //Create post-game message and send to all users
                      twilio.messages.create(options, function(err,message)
                      {
                        if(err)
                          console.log(err);
                          
                        console.log(message);
                      }); 
                  }); 
              });
              
          }
          
      }
      
      //If no dodger game, tell user there is none.
      else
      {
          //Send message at 2 pm.
          if(("2:00" == time) && meridian == "PM")
          {
              var body = "There's no Dodger game today!";
              
              //Cycle through all users. 
              Users.find({} , (err, users) => 
              {
                if(err) 
                  throw err;
                
                
                  users.map(user => 
                  {
                      const options = 
                      {
                          to: `+ ${user.phonenumber}`,
                          from: '+13236010551',
                          body: body,
                      }
                      
                      //Create pre-game message and send to all users
                      twilio.messages.create(options, function(err,message)
                      {
                        if(err)
                          console.log(err);
                          
                        console.log(message);
                      }); 
                  }); 
              });   
          }
      }
      
    //********END************  
    })
    .catch( function( error ) {
      console.log( error );
    });
}

//Parse the time function.
function parseTime(time)
{
    // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}



//Export it.
module.exports = sendNotifications;
