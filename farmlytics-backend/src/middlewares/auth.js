const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); 
const User = require('../models/User');
const config = require('../config');


exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  
        token = req.headers.authorization.split(' ')[1];
    }
     else if (req.cookies.token) { 
         token = req.cookies.token;
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized to access this route, no token');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        req.user = await User.findById(decoded.id).select('-password'); // Attach user to request (excluding password)
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized to access this route, user not found');
        }
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized to access this route, token failed');
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403); 
            throw new Error(`User role ${req.user.role} is not authorized to access this route`);
        }
        next();
    };
};