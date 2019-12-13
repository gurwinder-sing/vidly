const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('../models/genre');

const movieSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 50
    },
    genre : genreSchema,
    numberInStock : Number,
    dailyRentals : Number
});

const Movie = mongoose.model('movie',movieSchema);

function validateSchema(movie){
    const schema = {
        title : Joi.string().required().min(3),
        // This genreId is what client will be sending us and hence it will be string
        genreId : Joi.objectId(),
        numberInStock : Joi.number(),
        dailyRentals : Joi.number()
    };
    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validateMovieSchema = validateSchema;