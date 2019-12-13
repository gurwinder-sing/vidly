const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    // Here we are defining different schema for customer because the customer document
    // can have say upto 50 properties, but we don't want all those properties to show here
    // in rental schema, we are only show here the important properties. Same is the case for 
    // movie
    customer : {
        type : new mongoose.Schema({
            isGold : {
                type : Boolean,
                default : false
            },
            name : {
                type : String,
                required : true,
                minlength : 5,
                maxlength : 50
            },
            phone : {
                type : String,
                required : true,
                minlength : 5,
                maxlength : 50
            }
        }),
        required : true
    },
    movie : {
        type : new mongoose.Schema({
            title : {
                type : String,
                required : true,
                minlength : 5,
                maxlength : 50
            },
            dailyRentals : {
                type : Number,
                required : true,
                // So range of dailyRentalRate will be 0-255
                min : 0,
                max : 255
            }
        }),
        required : true
    },
    dateOut : {
        type : Date,
        required : true,
        default : Date.now
    },
    dateRequired : {
        type : Date
    },
    rentalFee : {
        type : Number,
        min : 0
    }
});

const Rental = mongoose.model('rental',rentalSchema);

function validateSchema(rental){
    const schema = {
        // Here we are expecting only customerId and movieId from client, rest of the
        // properties like dateOut will be set at the server side
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required() 
    };
    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validateRentalSchema = validateSchema;