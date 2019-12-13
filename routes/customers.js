const auth = require('../middleware/auth');
const { Customer, validateCustomerSchema} = require('../models/customer');
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/',async(req, res) => {
    const customers = await Customer.find();
    res.send(customers);
})

router.get('/:id',async(req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('This genre id does not exist');

    res.send(customer);
})

router.post('/',auth,async(req, res) => {
    const result = validateCustomerSchema(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    let  customer = new Customer({
        isGold : req.body.isGold, 
        name : req.body.name,
        phone : req.body.phone 
        });
    try{
        customer = await customer.save();
        res.send(customer);
    }
    catch(err){
        for (field in err.errors)
            console.log(err.errors[field].message)
    }
    
})

router.put('/:id',auth,async(req, res) => {
    const result = validateCustomerSchema(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);
    
    const customer = await Customer.updateOne({ _id : req.params.id},{
        $set : {
            isGold : req.body.isGold,
            name : req.body.name,
            phone : req.body.phone
        }
    });
    if(!customer) return res.status(404).send('This genre id does not exist');

    res.send(customer);
})

router.delete('/:id',auth,async(req, res) => {
    
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(404).send('This genre id does not exist');
    res.send(customer);
})

module.exports = router;