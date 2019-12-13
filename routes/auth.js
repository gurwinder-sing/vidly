const bcrypt = require('bcrypt');
// For convention we assin the result in _
const _ = require('lodash');
const Joi = require('joi');
const { User } = require('../models/user');
const express = require('express');

const router = express.Router();

router.post('/',async(req, res) => {
    try{

        const result = validate(req.body);
        if(result.error) return res.status(400).send(result.error.details[0].message);
    
        let user =  await User.findOne({ email : req.body.email });
        if(!user.email) return res.status(400).send('Invalid email or password');
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send('Invalid email or password');

        // So token is getting generated with the combination of our payload and private key
        const token = user.generateAuthToken();
    
        res.send(token);
    }
    catch(err){
        return res.status(400).send('Invalid email or password');
    }
});

function validate(auth){
    const schema = {
        email : Joi.string().required().min(5).max(50).email(),
        password : Joi.string().required().min(5).max(50)
    };
    return Joi.validate(auth, schema);
}

module.exports = router;