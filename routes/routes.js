module.exports = function(passport)
{
    const momentTimeZone = require('moment-timezone');
    const moment = require('moment');
    
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







//****************FORGET PAGE*****************************************
    //Get Forget your password page.
    router.get('/forgot', function(req,res){
        res.render('signup', {message: req.flash('forgotMessage')});
    });
    
    //Update the password. 
    router.put('/forgot', passport.authenticate('local-forgot', {
        successRedirect:'/forgot',
        failureRedirect:'/forgot',
        failureFlash:true
    }));
//********************************************************************    
    
    
    
    
    
    
    
    
    return router;
    
}
