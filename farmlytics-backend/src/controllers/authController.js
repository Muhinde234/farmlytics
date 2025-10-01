const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const config = require('../config');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); 

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'farmer',
        isVerified: false 
    });

    
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false }); 

    
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verificationToken}`;

    const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p style="color: #007A3D;">Hello ${user.name},</p>
            <p>Thank you for registering with Farmlytics! To activate your account, please click the button below:</p>
            <p style="margin: 20px 0;">
                <a href="${verificationUrl}" style="
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
            <p style="color: #FFD200;">Best regards,</p> <!-- Yellow from Rwandan flag -->
            <p style="color: #007A3D;">The Farmlytics Team</p> <!-- Green from Rwandan flag -->
            <hr style="border-top: 1px solid #00A3DD; margin-top: 20px;"> <!-- Blue from Rwandan flag -->
            <p style="font-size: 0.8em; color: #555;">If the button above does not work, copy and paste this link into your browser:</p>
            <p style="font-size: 0.8em;"><a href="${verificationUrl}">${verificationUrl}</a></p>
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
            user: { 
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
                    h1 { color: #dc3545; margin-bottom: 20px; } /* Red for error */
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
                h1 { color: #28a745; margin-bottom: 20px; } /* Green for success */
                p { color: #6c757d; margin-bottom: 10px; }
                a { color: #007bff; text-decoration: none; }
                a:hover { text-decoration: underline; }
                .flag-colors {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }
                .flag-color-green { background-color: #007A3D; width: 40px; height: 10px; } /* Green */
                .flag-color-yellow { background-color: #FFD200; width: 40px; height: 10px; } /* Yellow */
                .flag-color-blue { background-color: #00A3DD; width: 40px; height: 10px; } /* Blue */
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Email Successfully Verified!</h1>
                <p>Your Farmlytics account is now active.</p>
                <p>You can now log in to the Farmlytics application.</p>
                <p><a href="${req.protocol}://${req.get('host')}/api/v1/auth/login">Proceed to Login</a></p>
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
                isVerified: user.isVerified 
            }
        });
};