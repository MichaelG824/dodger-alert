//YOU NEED TO SAVE AND DELETE THIS BEFORE PUSHING
//Change for publication. **********************!IMPORTANT********************
//***********TWILIO CONFIG****************************
const accountSid = 'AC2394ac048859f6b48e7cdf630c29e631';
const authToken = 'e5e14360709c8b0f598c7a9053d87557';
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
      var meridian = newtime.substring(4);
      
      //Get time alone
      var time = newtime.substring(0,4);
      
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
          
          
          //Send message on game time. 
          if((data.game[index].home_time == time) && meridian == "PM")
          {
              var body = "";
              
              body += data.game[index];
              
              Users.find().forEach(function(user)
              {
                  
                  const options = 
                  {
                      to: `+ ${user.phonenumber}`,
                      from: '+13236010551',
                      body: body,
                  }
                  
                  //Create message 
                  twilio.messages.create(options, function(err,message)
                  {
                      if(err)
                        console.log(err);
                        
                      console.log(message);
                  });
                  
              }); 
          }
          
          //After game ends, send final score
          else if(true)
          {
              
          }
          
      }
      
      //If no dodger game, tell user there is none.
      else
      {
          //Send message at 2 pm.
          if(("2:00" == time) && meridian == "PM")
          {
              var body = "There's no Dodger game today!";
              
              Users.find().forEach(function(user)
              {
                  
                  const options = 
                  {
                      to: `+ ${user.phonenumber}`,
                      from: '+13236010551',
                      body: body,
                  }
                  
                  //Create message 
                  twilio.messages.create(options, function(err,message)
                  {
                      if(err)
                        console.log(err);
                        
                      console.log(message);
                  });
                  
              });      
          }
      }
      
    //********END************  
    
    
     var body = "";
              
              body += data.game[index];
              
              console.log(body);
             
                  
                  const options = 
                  {
                      to: '8184278207',
                      from: '+13236010551',
                      body: body,
                  }
                  
                  //Create message 
                 /* twilio.messages.create(options, function(err,message)
                  {
                      if(err)
                        console.log(err);
                        
                      console.log(message);
                  }); */
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
