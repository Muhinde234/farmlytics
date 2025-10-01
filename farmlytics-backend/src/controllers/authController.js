const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const config = require('../config'); 

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'farmer' 
    });

    sendTokenResponse(user, 201, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(401); // Unauthorized
        throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401); // Unauthorized
        throw new Error('Invalid credentials');
    }

    sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// Get token from model, create cookie and send response
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Extract the number of days from config.jwtExpire (e.g., "30d" -> 30)
    const expiresInDays = parseInt(config.jwtExpire, 10);
    // Ensure it's a valid number, default to 30 days if parsing fails
    const validExpiresInDays = isNaN(expiresInDays) ? 30 : expiresInDays;


    // Options for cookie (you can configure httponly, secure etc. for production)
    const options = {
        // Correctly calculate expiration date in milliseconds
        expires: new Date(Date.now() + validExpiresInDays * 24 * 60 * 60 * 1000), 
        httpOnly: true // Prevent client-side JS from reading the cookie
    };

    if (config.nodeEnv === 'production') {
        options.secure = true; // Only send cookie over HTTPS in production
    }

    res.status(statusCode)
        .cookie('token', token, options) // Set cookie (optional, can just send token in JSON)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};