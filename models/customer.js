const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold : Boolean,
    name : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 50
    },
    phone : String
});

const Customer = mongoose.model('customer',customerSchema);

function validateSchema(customer){
    const schema = {
        isGold : Joi.boolean(),
        name : Joi.string().required().min(5).max(50),
        phone : Joi.string()
    };
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validateCustomerSchema = validateSchema;