const Joi = require('joi');

module.exports = function(){
    // So here we are passing a reference to Joi class and assigning the whole thing to
    // Joi.objectId method
    Joi.objectId = require('joi-objectid')(Joi);
}