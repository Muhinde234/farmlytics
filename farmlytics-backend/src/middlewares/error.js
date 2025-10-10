const logger = require('../config/winston'); 

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

   
    logger.error(`Error encountered: ${err.message}`, { 
        stack: err.stack, 
        method: req.method, 
        path: req.originalUrl, 
        ip: req.ip,
        body: req.body, 
        query: req.query 
    });

    
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new Error(message);
        res.status(404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new Error(message);
        res.status(400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new Error(message.join(', ')); 
        res.status(400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;