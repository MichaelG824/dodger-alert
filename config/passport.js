var localStrategy = require('passport-local').Strategy;



//user model.
const User = require('../models/Users.js');

module.exports = function(passport)
{
    //Serialize user.
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    
    //Deserialize user.
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            if(err){
                console.log("Deserialize user error");
            }
            done(err,user);
        });
    });

    
    
    //************DELETE REQUEST**********************************
     passport.use('local-deletion', new localStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done){
	   process.nextTick(function()
	   {
	       User.findOne({'username': username}, function(err,user)
	       {
	           if(err)
	               return done(err);
	           
	           else if(!user)
	           {
	               return done(null, false, req.flash('deleteMessage', 'Sorry that username does not exist.'));
	           }
	           else if(!user.validPassword(password))
	           {
				   return done(null, false, req.flash('deleteMessage', 'Inavalid password. Please try again.'));
			   }
	           else
	           {
	                User.findOneAndRemove({'username': username}, function(err,result)
	                {
	                    if(err)
	                    {
	                        return done(err);
	                    }
	                    return done(null, result);
	                });
	           }
	           
	       });
	   });
    }));
    //***************************************************************

}