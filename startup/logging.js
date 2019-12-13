// Now this winston logger, by default comes with a transport, which is console(To write logging messages on console)
const winston = require('winston');
//require('winston-mongodb');
require('express-async-errors');

module.exports = function(){
    winston.handleExceptions(
        new winston.transports.Console({ colorize : true, prettyPrint : true }),
        new winston.transports.File({ filename : 'unhandledExceptions.log'}));
    // or process.on('uncaughtException', ex => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });
    
    // For promises(asynchronous code)
    process.on('unhandledRejection', ex => {
        throw ex;
    });

    // To add another transport. Here we are adding file transport
    winston.add(winston.transports.File , { filename : 'logfile.log' });

    // To add mongodb transport . We can also add level for a particular transport
    // winston.add(winston.transports.MongoDB, { 
    //     db : 'mongodb://localhost/vidly',
    //     level : 'error'
    // })
}