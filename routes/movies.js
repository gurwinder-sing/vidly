const auth = require('../middleware/auth');
const { Movie, validateMovieSchema } = require('../models/movie');
const { Genre, validateGenreSchema } = require('../models/genre');
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/',async(req, res) => {
    const movies = await Movie.find();
    res.send(movies);
})

router.get('/:id',async(req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('This movie id does not exist');

    res.send(movie);
})

router.post('/',auth,async(req, res) => {
    const result = validateMovieSchema(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre');

    let  movie = new Movie({ 
        title : req.body.title,
        genre : {
            _id : genre._id,
            name :genre.name
        },
        numberInStock : req.body.numberInStock,
        dailyRentals : req.body.dailyRentals
     });
    try{
        await movie.save();
        res.send(movie);
    }
    catch(err){
        for (field in err.errors)
            console.log(err.errors[field].message)
    }
    
})

router.put('/:id',auth,async(req, res) => {
    const result = validateMovieSchema(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre');
    
    const movie = await Movie.updateOne({ _id : req.params.id},{
        $set : {
            title : req.body.title,
            'genre._id':genre._id,
            'genre.name' : genre.name,
            numberInStock : req.body.numberInStock,
            dailyRentals : req.body.dailyRentals
        }
    });
    if(!movie) return res.status(404).send('This movie id does not exist');

    res.send(movie);
})

router.delete('/:id',auth,async(req, res) => {
    
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send('This movie id does not exist');
    res.send(movie);
})

module.exports = router;