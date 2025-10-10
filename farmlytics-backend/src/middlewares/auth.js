const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const config = require('../config');
const logger = require('../config/winston'); // Import Winston logger

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
        logger.debug(`Auth Middleware: Found Bearer token: ${token ? token.substring(0, 10) + '...' : 'None'}`);
    }
    // else if (req.cookies.token) { // If using cookies for token storage
    //     token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        logger.warn('Auth Middleware: No token provided in request header. Unauthorized access attempt.');
        res.status(401);
        throw new Error('Not authorized to access this route, no token');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        logger.debug(`Auth Middleware: Token decoded. User ID: ${decoded.id}, Role: ${decoded.role}`);

        req.user = await User.findById(decoded.id).select('-password'); // Attach user to request (excluding password)
        
        if (!req.user) {
            logger.warn(`Auth Middleware: User not found in DB for decoded ID: ${decoded.id}. Token might be valid but user deleted.`);
            res.status(401);
            throw new Error('Not authorized to access this route, user not found');
        }

        logger.debug(`Auth Middleware: User ${req.user.email} (Role: ${req.user.role}) authenticated successfully.`);
        next();
    } catch (error) {
        logger.error(`Auth Middleware: Token verification failed. Error: ${error.message}`, { token: token ? token.substring(0, 50) + '...' : 'None', stack: error.stack });
        res.status(401);
        throw new Error('Not authorized to access this route, token failed');
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logger.warn(`Auth Middleware: User ${req.user.email} (Role: ${req.user.role}) is not authorized for roles: ${roles.join(', ')}.`);
            res.status(403); // Forbidden
            throw new Error(`User role ${req.user.role} is not authorized to access this route`);
        }
        next();
    };
};
