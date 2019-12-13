const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 50
    }
});

const Genre = mongoose.model('genre',genreSchema);

function validateSchema(genre){
    const schema = {
        name : Joi.string().required().min(3)
    };
    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateGenreSchema = validateSchema;
exports.genreSchema = genreSchema;