const bunyan = require('bunyan');

// Imports the Google Cloud client library for Bunyan
const {LoggingBunyan} = require('@google-cloud/logging-bunyan');

// Import Google Cloud Stackdriver Error Reporting library
const {ErrorReporting} = require('@google-cloud/error-reporting');

const errors = new ErrorReporting();
const loggingBunyan = new LoggingBunyan();

// Create a Bunyan logger that streams to Stackdriver Logging
const logger = bunyan.createLogger({
  name: process.env.GAE_SERVICE || 'default',
  streams: [
    // Log to Stackdriver Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
});

module.exports = {
  logger,
  errors
};
