const auth = require('../middleware/auth');
const { Rental, validateRentalSchema} = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');

const router = express.Router();

// We need to initialize it
Fawn.init(mongoose);

router.get('/',async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

router.get('/:id',async(req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(404).send('This rental id does not exist');
 
    res.send(rental);
})

router.post('/',auth,async(req, res) => {
    const result = validateRentalSchema(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie');

    if(movie.numberInStock === 0) return res.status(400).send('Movie is not in stock');

    let  rental = new Rental({
        customer : {
            _id : customer._id,
            name : customer.name,
            isGold : customer.isGold,
            phone : customer.phone
        },
        movie : {
            _id : movie._id,
            title : movie.title,
            dailyRentals : movie.dailyRentals
        }
        });
    try{
        // rental = await rental.save();

        // movie.numberInStock--;
        // movie.save();

        // As we want 2 phase commit of rental and movie , we are using the fawn module
        // In this we are directly working with the collections i.e. rentals, movies
        // In the save method as a 1st argument we are passing rentals collection and as 
        // a 2nd argument we are passing the document(object) which we want to store in mongodb
        // //ly in update as 2nd argument we are providing the update condition and in third 
        // argument we are providing the values which we wanna update
        // At the last we need to execute the run method, without it nothing will saved/updated to mongodb

        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id : movie._id }, {
                $inc : { numberInStock : -1 }
            })
            .run();

        res.send(rental);
    }
    catch(err){
        for (field in err.errors)
            console.log(err.errors[field].message)
    }
    
})

module.exports = router;