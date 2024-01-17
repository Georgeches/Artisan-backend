const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');

// Define a custom format for the logger
const customFormat = ':method :url :status :res[content-length] - :response-time ms';

// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, 'logs');
const accessLogStream = rfs.createStream('request.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
});

// Create a middleware function to log requests
const requestLogger = morgan(customFormat, { stream: accessLogStream });

module.exports = requestLogger;
