module.exports = function(passport)
{
    const momentTimeZone = require('moment-timezone');
    const moment = require('moment');
    const bodyParser = require('body-parser');
    
    //Used for parsing body when inputting data.
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());
    
    var router = require('express').Router();
    
    //user model.
    const User = require('../models/Users.js');
    
    //Get home page.
    router.get('/', function(req,res){
        res.render('home');
    });
    
    //Get dashboard 
    router.get('/dashboard', function(req,res){
        res.render('dashboard');
    });
    
    //Get delete dashboard
    router.get('/dashboard', function(req,res){
        res.render('deldashboard');
    });
    
    

//***************SIGNUP PAGE**************************************** 
    //Get signup page.
    router.get('/signup', function(req,res){
        res.render('signup', {message: req.flash('signupMessage')});
    });
    
    //Create user for the app.
    router.post('/signup', passport.authenticate('local-register',{
        successRedirect:'/dashboard',
        failureRedirect:'/signup',
        failureFlash:true
    }));
//******************************************************************    
    
    
    
    
    
    
    
//*********************DELETE PAGE *********************************    
    //Get deletion page.
    router.get('/delete', function(req,res){
        res.render('signup', {message: req.flash('deleteMessage')});
    });
    
    //Delete user from app.
    router.delete('/delete', passport.authenticate('local-deletion',{
        successRedirect:'/deldashboard',
        failureRedirect:'/delete',
        failureFlash:true
    }));
//*******************************************************************

 /*
    passport.use('local-register', new localStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	
	//Process the username. 
	//If it already exists, return user name already taken to the front end. 
	//Otherwise, register to data base.
	function(req, username, password, done){
		process.nextTick(function(){
			User.findOne({'username': username}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That username already taken'));
				} else {
					var newUser = new User();
					newUser.username = username;
					newUser.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});

		});
	}));
*/
/*
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
    */


//****************FORGET PAGE PUT REQUEST*****************************************
    //Get Forget your password page.
    router.get('/forgot', function(req,res){
        res.render('signup', {message: req.flash('forgotMessage')});
    });
    
    //Update the password. 
    router.put('/forgot',function(req,res) 
    {
        var oldPassword = req.body.oldPassword;
        var newPassword = req.body.newPassword;
        var username = req.body.username;
        
        User.findOne({username:username,password:oldPassword}).then(function(result)
        {
            if(!result)
            {
                res.json({status:"Success", redirect: '/forgot'});
            }
            else 
            {
                User.findOneAndUpdate({password:oldPassword}, {password: newPassword}).then(function(err,result)
                {
                    if(err)
                    {
                        throw err;
                    }
                    else{
                        console.log(result);
                    }
                });
            }
        });
    });
//********************************************************************    
    
    
    
    
    
    
    
    
    return router;
    
}
