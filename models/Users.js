const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

//Create user schema 
const UserSchema = new Schema ({
    name: String,
    username: { type: String, unique:true },
    password: {type:String},
    phonenumber: Number,
});

//Hash the password so it becomes encrypted.
UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

const User = mongoose.model('user-dodger', UserSchema);

module.exports = User;