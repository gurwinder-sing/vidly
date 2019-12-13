const winston = require('winston');

// This middleware is the part of the request processing pipeline and is gonna get called,
// whenever there will be an exception in the request processing pipeline in express
module.exports = function(err, req, res, next){
    winston.log('error', err.message, err)

    res.status(500).send('Something failed');
}