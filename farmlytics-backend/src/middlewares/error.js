// src/middlewares/error.js

const logger = require('../config/winston'); // NEW: Import Winston logger

const errorHandler = (err, req, res, next) => {
    let error = { ...err }; // Create a shallow copy of the error object
    error.message = err.message; // Ensure the message is copied over

    // Log the error for debugging purposes (Winston will handle its destination)
    logger.error(`Error encountered: ${err.message}`, {
        stack: err.stack,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        body: req.body, // Be cautious with logging sensitive data like passwords
        query: req.query
    });

    // Mongoose bad ObjectId (e.g., when findById receives a non-valid ID format)
    if (err.name === 'CastError') {
        error.message = `Resource not found with id of ${err.value}`;
        error.statusCode = 404;
    }
    // Mongoose duplicate key (e.g., trying to register with an email that already exists)
    else if (err.code === 11000) { // Check `else if` to avoid overwriting previous error
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }
    // Mongoose validation error (e.g., missing a required field, invalid email format)
    else if (err.name === 'ValidationError') {
        // Collect all validation error messages
        const messages = Object.values(err.errors).map(val => val.message);
        error.message = messages.join(', '); // Join messages if multiple validation errors
        error.statusCode = 400;
    }
    // JWT specific errors from `protect` middleware
    else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        error.message = 'Not authorized, token failed or expired';
        error.statusCode = 401;
    }
    // Any other unhandled errors will default to 500 and their original message

    // Send the JSON response with the determined status code and message
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error' // Fallback to generic message if none defined
    });
};

module.exports = errorHandler;
