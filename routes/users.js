const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
// For convention we assin the result in _
const _ = require('lodash');
const { User, validateUserSchema } = require('../models/user');
const express = require('express');

const router = express.Router();

// Here we are getting the information of the current user(logged in one)
router.get('/me', auth, async(req, res)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

router.post('/',async(req, res) => {
    try{

        const result = validateUserSchema(req.body);
        if(result.error) return res.status(400).send(result.error.details[0].message);
    
        let user = User.findOne({ email : req.body.email });
        if(user.email) return res.status(400).send('User with a given email is already in database');
        
        user = new User(_.pick(req.body,['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    
        await user.save();

        const token = user.generateAuthToken();
        
        // This pick method gonna return the object, with the properties mentioned in an array from the user object
        // Just like we have headers in our req object, we have these in res object too
        // And we're gonna send our token to that header
        // Now any custom header we are defining in our application, we should prefix these
        // headers with "x-"
        res.header('x-auth-token',token).send(_.pick(user,['_id', 'name', 'email']));
    }
    catch(err){
        console.log(err.message);
    }
});

module.exports = router;