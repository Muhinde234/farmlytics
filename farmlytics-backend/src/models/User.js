const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const config = require('../config'); 

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
        select: false 
    },
    role: {
        type: String,
        enum: ['admin', 'farmer', 'buyer'],
        default: 'farmer' 
    },
    isVerified: { 
        type: Boolean,
        default: false
    },
    emailVerificationToken: String, 
    emailVerificationExpire: Date, 
    resetPasswordToken: String, 
    resetPasswordExpire: Date, 
    preferredDistrictName: { 
        type: String,
        trim: true,
        default: null
    },
    preferredProvinceName: { 
        type: String,
        trim: true,
        default: null
    },
    preferredLanguage: { 
        type: String,
        enum: ['en', 'fr', 'rw'],
        default: 'en'
    },
    deviceTokens: { 
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, config.jwtSecret, {
        expiresIn: config.jwtExpire
    });
};


UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


UserSchema.methods.generateEmailVerificationToken = function() {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    this.emailVerificationExpire = Date.now() + 60 * 60 * 1000; 
    return verificationToken;
};


UserSchema.methods.getResetPasswordToken = function() {
    
    const resetToken = crypto.randomBytes(20).toString('hex');

    
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

   
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);