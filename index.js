const winston = require('winston');
const express = require('express');
const app = express();

// We have calling logging module before the other modules, because if we encounter
// an error in other modules, we will be able to log that error and terminate the process
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port,()=> winston.info(`listening to port ${port}`));

module.exports = server;