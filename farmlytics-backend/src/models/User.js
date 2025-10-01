const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // <--- ADD THIS LINE to import the crypto module
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
    isVerified: { // New field for email verification
        type: Boolean,
        default: false
    },
    emailVerificationToken: String, // New field for verification token
    emailVerificationExpire: Date, // New field for token expiration
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function(next) {
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
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to emailVerificationToken field
    // We hash the token that's stored in the DB, but send the unhashed token to the user
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    // Set expire (e.g., 1 hour)
    this.emailVerificationExpire = Date.now() + 60 * 60 * 1000; // 1 hour from now

    return verificationToken;
};

module.exports = mongoose.model('User', UserSchema);