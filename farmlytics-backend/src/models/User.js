const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import crypto for token generation
const config = require('../config'); // Import our config for JWT secret

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-1]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Don't return password in query results by default
    },
    role: {
        type: String,
        enum: ['admin', 'farmer', 'buyer'],
        default: 'farmer' // Default role for new users
    },
    isVerified: { // For email verification
        type: Boolean,
        default: false
    },
    emailVerificationToken: String, // For email verification
    emailVerificationExpire: Date, // For email verification
    resetPasswordToken: String, // For password reset
    resetPasswordExpire: Date, // For password reset token expiration
    preferredDistrictName: { // For user personalization
        type: String,
        trim: true,
        default: null
    },
    preferredProvinceName: { // For user personalization
        type: String,
        trim: true,
        default: null
    },
    preferredLanguage: { // For user personalization
        type: String,
        enum: ['en', 'fr', 'rw'],
        default: 'en'
    },
    deviceTokens: { // NEW: Array to store device tokens for push notifications
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function(next) {
    // Only hash if password has been modified or is new
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, config.jwtSecret, {
        expiresIn: config.jwtExpire
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash email verification token
UserSchema.methods.generateEmailVerificationToken = function() {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    this.emailVerificationExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    return verificationToken;
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (e.g., 10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);