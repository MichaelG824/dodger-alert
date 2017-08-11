'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const moment = require('moment');

//Create user schema 
const UserSchema = new Schema ({
    username: { type: String, unique:true },
    password: {type:String},
    phonenumber: Number,
});

//**************PASSWORD STUFF *******************************
//Hash the password so it becomes encrypted.
UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
//************************************************************

//Schema model.
const User = mongoose.model('user-dodger', UserSchema);

module.exports = User;