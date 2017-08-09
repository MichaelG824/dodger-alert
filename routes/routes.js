module.exports = function(passport)
{
    const momentTimeZone = require('moment-timezone');
    const moment = require('moment');
    const bodyParser = require('body-parser');
    
   
    var router = require('express').Router();
    
     //Used for parsing body when inputting data.
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());
    
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
    router.get('/deldashboard', function(req,res){
        console.log("Hit delete");
        res.render('deldashboard');
    });
    
    

//***************SIGNUP PAGE**************************************** 
    //Get signup page.
    router.get('/signup', function(req,res){
        res.render('signup', {message: req.flash('signupMessage')});
    });
    
    //Create user for the app.
    router.post('/signup', function(req,res)
    {
        console.log("Hit 1");
        var username = req.body.username;
        var phonenumber = req.body.phonenumber;
        var password = req.body.password;
        
        console.log(username);
        console.log(password);
        console.log(phonenumber);
        
        //If phone number is in database. 
        //Say to user that it already exists.
        User.findOne({phonenumber:phonenumber}).then(function(result){
            if(result)
            {
                console.log("Found phone number")
                 //Change this.
                res.json({status:"Success", redirect:'/signup'});
            }
        });
        
        //If the user exists, send that it already exists.
        //Otherwise save in database.
        User.findOne({username: username}).then(function(user){
			if(user)
			{
			    res.send("User already exists try again.");
			} 
			else 
			{
				var newUser = new User();
				newUser.username = username;
				newUser.password = password;
                newUser.phonenumber = phonenumber;
                
                //Save user.
				newUser.save(function(err)
				{
					if(err)
					{
					    console.log(err);
					    throw err;
					}
					
					
				});
				
			}
		});
		console.log("Hit 2");
		res.json({status:"Success", redirect:'/dashboard'});
    });
//******************************************************************    
    
    
    
    
    
    //req.flash('deleteMessage')
    
//*********************DELETE PAGE *********************************    
    //Get deletion page.
    router.get('/delete', function(req,res){
        res.render('delete', {message:req.flash('deleteMessage')});
    });
    
    //Delete user from app.
    router.post('/delete', passport.authenticate('local-deletion',{
        successRedirect:'/deldashboard',
        failureRedirect:'/delete',
        failureFlash:true
    }));
//*******************************************************************


//****************FORGET PAGE*****************************************
    //Get Forget your password page.
    router.get('/forgot', function(req,res){
        res.render('forgot', {message: req.flash('forgotMessage')});
    });
    
    //Update the password. 
    router.post('/forgot',function(req,res) 
    {
        var oldPassword = req.body.oldpassword;
        var newPassword = req.body.newpassword;
        var username = req.body.username;
        console.log(oldPassword);
        
        User.findOne({username:username,password:oldPassword}).then(function(result)
        {
            console.log(result);
            if(!result)
            {
                console.log("Cannot find");
                res.json({status:"Success", redirect: '/forgot'});
            }
            else 
            {
                User.findOneAndUpdate({password:oldPassword}, {password: newPassword}).then(function(result)
                {
                    console.log(result);
                });
                res.json({status:"Success", redirect: '/'});
            }
        });
    });
//********************************************************************    
    
    
    
    
    
    
    
    
    return router;
    
}
