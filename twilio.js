//YOU NEED TO SAVE AND DELETE THIS BEFORE PUSHING
//Change for publication. **********************!IMPORTANT********************
//***********TWILIO CONFIG****************************
const accountSid = 'AC2394ac048859f6b48e7cdf630c29e631';
const authToken = 'e5e14360709c8b0f598c7a9053d87557';
const twilio = require('twilio')(accountSid, authToken);
//***********************************************

//Module to get all gameday data.
var gamedayHelper = require('gameday-helper');

//Help get the date for the gameDayHelper.
var date = new Date();

var CronJob = require('cron').CronJob;

/*var currenthour = 0;
new CronJob('* * * * * *', function() {
    currenthour = date.getHours();
    console.log(currenthour);
}, null, true, 'America/Los_Angeles');*/

//console.log(currenthour);
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
