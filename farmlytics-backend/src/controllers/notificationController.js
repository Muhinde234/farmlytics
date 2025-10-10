// src/controllers/notificationController.js
const asyncHandler = require('express-async-handler');
const notificationService = require('../utils/notificationService');
const User = require('../models/User'); // To fetch/update user's device tokens
const logger = require('../config/winston');

// @desc      Send a test push notification
// @route     POST /api/v1/notifications/send-test
// @access    Private (Admin only for testing purposes)
exports.sendTestNotification = asyncHandler(async (req, res, next) => {
    // deviceToken provided in body for flexible testing, or use admin's own tokens if available
    const { deviceToken, title, body, data, sendToAdminSelf = false } = req.body; 

    let targetDeviceTokens = [];

    if (sendToAdminSelf && req.user.role === 'admin') {
        const adminUser = await User.findById(req.user.id);
        if (adminUser && adminUser.deviceTokens.length > 0) {
            targetDeviceTokens = adminUser.deviceTokens;
            logger.info(`Admin ${req.user.id} sending test notification to own stored device tokens.`);
        } else {
            logger.warn(`Admin ${req.user.id} requested to send to self, but no device tokens stored.`);
            if (!deviceToken) { // If no stored token and no deviceToken provided in body
                res.status(400);
                throw new Error('Admin requested to send to self but no tokens found, and no deviceToken provided in request body.');
            }
        }
    } 
    
    // If not sending to self, or no tokens for self, use deviceToken from body if provided
    if (deviceToken && targetDeviceTokens.length === 0) {
        targetDeviceTokens = [deviceToken];
    }

    if (targetDeviceTokens.length === 0) {
        res.status(400);
        throw new Error('No valid device token(s) provided or found to send notification.');
    }
    if (!title || !body) {
        res.status(400);
        throw new Error('Please provide title and body for the test notification.');
    }

    const response = await notificationService.sendPushNotification(
        targetDeviceTokens,
        title,
        body,
        data
    );

    if (response.success) {
        res.status(200).json({
            success: true,
            message: 'Test notification request processed.',
            details: response.details // Use 'details' for Expo response
        });
    } else {
        res.status(500).json({
            success: false,
            message: response.message,
            error: response.error,
            details: response.details
        });
    }
});

// @desc      Register a device token for push notifications
// @route     POST /api/v1/notifications/register-token
// @access    Private (Authenticated User)
exports.registerDeviceToken = asyncHandler(async (req, res, next) => {
    const { deviceToken } = req.body;

    if (!deviceToken) {
        res.status(400);
        throw new Error('Please provide a device token.');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('Authenticated user not found.');
    }

    // Add token if it doesn't already exist for this user
    if (!user.deviceTokens.includes(deviceToken)) {
        user.deviceTokens.push(deviceToken);
        await user.save();
        logger.info(`Device token '${deviceToken}' registered for user ${req.user.id}.`);
    } else {
        logger.info(`Device token '${deviceToken}' already registered for user ${req.user.id}.`);
    }

    res.status(200).json({
        success: true,
        message: 'Device token registered successfully.',
        data: user.deviceTokens // Return updated tokens
    });
});