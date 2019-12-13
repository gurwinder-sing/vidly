const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
const { Genre, validateGenreSchema } = require('../models/genre');
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();



router.get('/',async(req, res) => {
    //throw new Error('Could not fetch the genres');
    const genres = await Genre.find();
    res.send(genres);
})

router.get('/:id',async(req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('This genre id does not exist');

    res.send(genre);
})

// Our post(or any CRUD) method has an optional argument, where we can pass the middleware
// function and it will be executed before this method . So we have added auth middleware
// , so first the user will be authenticated, only after that user will be able to post
router.post('/',auth,async(req, res) => {
    const result = validateGenreSchema(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    let  genre = new Genre({ name : req.body.name });
    try{
        genre = await genre.save();
        res.send(genre);
    }
    catch(err){
        for (field in err.errors)
            console.log(err.errors[field].message)
    }
    
})

router.put('/:id',auth,async(req, res) => {
    const result = validateGenreSchema(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);
    
    const genre = await Genre.updateOne({ _id : req.params.id},{
        $set : {
            name : req.body.name
        }
    });
    if(!genre) return res.status(404).send('This genre id does not exist');

    res.send(genre);
})

router.delete('/:id',[ auth, admin ] ,async(req, res) => {
    
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send('This genre id does not exist');
    res.send(genre);
})

module.exports = router;