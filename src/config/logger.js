const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');


const customFormat = ':method :url :status :res[content-length] - :response-time ms';


const logDirectory = path.join(__dirname, 'logs');
const accessLogStream = rfs.createStream('request.log', {
  interval: '1d', 
  path: logDirectory,
});


const requestLogger = morgan(customFormat, { stream: accessLogStream });

module.exports = requestLogger;
