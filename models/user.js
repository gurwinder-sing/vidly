const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 50
    },
    email : {
        type : String,
        required : true,
        unique : true,
        minlength : 5,
        maxlength : 50
    },
    password : {
        type : String,
        required : true,
        minlength : 5,
        // We are setting the maxlenght to 1024, because we are gonna hash these passwords
        maxlength : 1024
    },
    isAdmin : Boolean
})

userSchema.methods.generateAuthToken = function (){
    // this is used to reference to user object
    const token = jwt.sign({ _id : this._id , isAdmin : this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('user', userSchema);

function validateUserSchema(user){
    const schema = {
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().required().min(5).max(50).email(),
        password : Joi.string().required().min(5).max(50)
    };
    return Joi.validate(user, schema);
}

exports.validateUserSchema = validateUserSchema;
exports.User = User;