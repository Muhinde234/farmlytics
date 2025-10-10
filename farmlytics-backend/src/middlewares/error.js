const logger = require('../config/winston'); 

const errorHandler = (err, req, res, next) => {
    let error = { ...err }; // Create a shallow copy of the error object
    error.message = err.message; // Ensure the message is copied over

    // Log to console using Winston (and to file if configured)
    logger.error(`Error encountered: ${err.message}`, { 
        stack: err.stack, 
        method: req.method, 
        path: req.originalUrl, 
        ip: req.ip,
        body: req.body, // Include request body for context (be careful with sensitive data)
        query: req.query 
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = `Resource not found with id of ${err.value}`;
        error.statusCode = 404;
    }
    // Mongoose duplicate key (e.g., trying to register with an email that already exists)
    else if (err.code === 11000) { // Check `else if` to avoid overwriting previous error
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new Error(message.join(', ')); // Join messages if multiple validation errors
        res.status(400);
    }
    // Any other unhandled errors will default to 500 and their original message

    // Send the JSON response with the determined status code and message
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error' // Fallback to generic message if none defined
    });
};

module.exports = errorHandler;
