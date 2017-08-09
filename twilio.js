//YOU NEED TO SAVE AND DELETE THIS BEFORE PUSHING
//Change for publication. **********************!IMPORTANT********************
//***********TWILIO CONFIG****************************
const accountSid = 'AC2394ac048859f6b48e7cdf630c29e631';
const authToken = 'e5e14360709c8b0f598c7a9053d87557';
const twilio = require('twilio')(accountSid, authToken);
//***********************************************

var time = require('time');
var now = new time.Date();

now.setTimezone("America/Los_Angeles");

//Module to get all gameday data.
var gamedayHelper = require('gameday-helper');

//Help get the date for the gameDayHelper.
var date = new Date();

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
      //Get 24:00 time
      var time = now.getHours() + ':' + now.getMinutes();
      //Parse it into a new variable.
      var newtime = parseTime(time);
      console.log(newtime);
  }
  else 
  {
      twilio.messages.create({
        from: '+13236010551',
        to: '+18184278207',
        body: "The Dodgers are not playing today!"
      }, function(err, message) {
        if(err) {
          console.error(err.message);
        }
      }); 
  }
  
  
  
})
.catch( function( error ) {
  console.log( error );
});

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
