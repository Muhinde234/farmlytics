const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const config = require('../config');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Helper function to send JWT response (already defined, but ensuring it's here)
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const expiresInDays = parseInt(config.jwtExpire, 10);
    const validExpiresInDays = isNaN(expiresInDays) ? 30 : expiresInDays;

    const options = {
        expires: new Date(Date.now() + validExpiresInDays * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (config.nodeEnv === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                preferredDistrictName: user.preferredDistrictName, // Include new fields
                preferredProvinceName: user.preferredProvinceName,
                preferredLanguage: user.preferredLanguage
            }
        });
};


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
        role: role || 'farmer',
        isVerified: false
    });

    // Generate verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false }); // Save user with token (skip validation for password hashing pre-hook as it's already hashed)

    // Create verification URL
    // Use config.baseFrontendUrl for email verification, or if not set, use backend's current host
    const frontendVerifyUrl = `${config.baseFrontendUrl}/verifyemail/${verificationToken}`;
    const backendVerifyUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verificationToken}`;
    const verificationLink = config.baseFrontendUrl ? frontendVerifyUrl : backendVerifyUrl; // Prefer frontend link

    // Construct email message with Rwandan flag colors (conceptually)
    const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p style="color: #007A3D;">Hello ${user.name},</p>
            <p>Thank you for registering with Farmlytics! To activate your account, please click the button below:</p>
            <p style="margin: 20px 0;">
                <a href="${verificationLink}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007A3D; /* Green from Rwandan flag */
                    color: #FFFFFF;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                ">Verify My Account</a>
            </p>
            <p>This verification link is valid for 1 hour.</p>
            <p>If you did not register for a Farmlytics account, please ignore this email.</p>
            <p style="color: #FFD200;">Best regards,</p>
            <p style="color: #007A3D;">The Farmlytics Team</p>
            <hr style="border-top: 1px solid #00A3DD; margin-top: 20px;">
            <p style="font-size: 0.8em; color: #555;">If the button above does not work, copy and paste this link into your browser:</p>
            <p style="font-size: 0.8em;"><a href="${verificationLink}">${verificationLink}</a></p>
        </div>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Farmlytics Account Verification',
            html: message
        });

        res.status(201).json({
            success: true,
            message: 'User registered. Please check your email for verification link.',
            user: { // Still return user data, but mark as unverified
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (err) {
        console.error(err);
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent. Please contact support.');
    }
});


// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
        res.status(401);
        throw new Error('Please verify your email to log in. Check your inbox for a verification link.');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc      Update user profile
// @route     PUT /api/v1/auth/me
// @access    Private (All authenticated roles)
exports.updateMe = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        preferredDistrictName: req.body.preferredDistrictName,
        preferredProvinceName: req.body.preferredProvinceName,
        preferredLanguage: req.body.preferredLanguage
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true, // Return the updated document
        runValidators: true // Run schema validators
    });

    if (!user) { // This case should ideally not happen if req.user.id is valid
        res.status(404);
        throw new Error('User not found.');
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc      Verify user email
// @route     GET /api/v1/auth/verifyemail/:token
// @access    Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const verificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        emailVerificationToken: verificationToken,
        emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Farmlytics - Verification Failed</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                    .container { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px; text-align: center; max-width: 500px; width: 100%; }
                    h1 { color: #dc3545; margin-bottom: 20px; }
                    p { color: #6c757d; margin-bottom: 10px; }
                    a { color: #007bff; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Email Verification Failed!</h1>
                    <p>The verification link is invalid or has expired.</p>
                    <p>Please try registering again or contact support if you continue to experience issues.</p>
                    <p><a href="${req.protocol}://${req.get('host')}/api-docs">Go to API Documentation</a></p>
                </div>
            </body>
            </html>
        `);
        return;
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Farmlytics - Email Verified</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                .container { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px; text-align: center; max-width: 500px; width: 100%; }
                h1 { color: #28a745; margin-bottom: 20px; }
                p { color: #6c757d; margin-bottom: 10px; }
                a { color: #007bff; text-decoration: none; }
                a:hover { text-decoration: underline; }
                .flag-colors {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }
                .flag-color-green { background-color: #007A3D; width: 40px; height: 10px; }
                .flag-color-yellow { background-color: #FFD200; width: 40px; height: 10px; }
                .flag-color-blue { background-color: #00A3DD; width: 40px; height: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Email Successfully Verified!</h1>
                <p>Your Farmlytics account is now active.</p>
                <p>You can now log in to the Farmlytics application.</p>
                <p><a href="${config.baseFrontendUrl}/login?status=emailVerifiedSuccess">Proceed to Login (Frontend)</a></p>
                <p><a href="${req.protocol}://${req.get('host')}/api-docs">Go to API Documentation (Backend)</a></p>
                <div class="flag-colors">
                    <div class="flag-color-green"></div>
                    <div class="flag-color-yellow"></div>
                    <div class="flag-color-blue"></div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// @desc      Forgot Password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('No user found with that email address.');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false }); // Save token (skip validation for password hashing pre-hook)

    // Create reset URL
    const resetUrl = `${config.baseFrontendUrl}/resetpassword/${resetToken}`; // Frontend URL

    const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p style="color: #007A3D;">Hello,</p>
            <p>You are receiving this email because you (or someone else) has requested the reset of a password for your account.</p>
            <p>Please make a PUT request to: </p>
            <p style="margin: 20px 0;">
                <a href="${resetUrl}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007A3D;
                    color: #FFFFFF;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                ">Reset Password</a>
            </p>
            <p>This reset token is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p style="color: #FFD200;">Best regards,</p>
            <p style="color: #007A3D;">The Farmlytics Team</p>
            <hr style="border-top: 1px solid #00A3DD; margin-top: 20px;">
            <p style="font-size: 0.8em; color: #555;">If the button above does not work, copy and paste this link into your browser:</p>
            <p style="font-size: 0.8em;"><a href="${resetUrl}">${resetUrl}</a></p>
        </div>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Farmlytics Password Reset Token',
            html: message
        });

        res.status(200).json({ success: true, message: 'Email sent for password reset.' });

    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent for password reset. Please contact support.');
    }
});

// @desc      Reset Password
// @route     PUT /api/v1/auth/resetpassword/:token
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token from URL
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() } // Token must not be expired
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired reset token.');
    }

    // Set new password
    if (req.body.password !== req.body.confirmPassword) {
        res.status(400);
        throw new Error('Passwords do not match.');
    }

    user.password = req.body.password; // Mongoose pre-save hook will hash this
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc      Update User Password (when logged in)
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password'); // Select password to compare

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        res.status(401);
        throw new Error('Current password is incorrect.');
    }

    // Set new password
    if (req.body.newPassword !== req.body.confirmNewPassword) {
        res.status(400);
        throw new Error('New passwords do not match.');
    }

    user.password = req.body.newPassword; // Mongoose pre-save hook will hash this
    await user.save(); // This will trigger the pre-save hook to hash the new password

    sendTokenResponse(user, 200, res);
});