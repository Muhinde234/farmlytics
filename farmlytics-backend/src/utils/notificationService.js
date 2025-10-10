// src/utils/notificationService.js
const logger = require('../config/winston');
const config = require('../config');
const axios = require('axios'); 


const notificationService = {

    async sendPushNotification(deviceTokens, title, body, data = {}, extraOptions = {}) {
        if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
            logger.warn('Notification Service: No device tokens provided. Cannot send notification.');
            return { success: false, message: 'No device tokens provided.' };
        }

        
        const expoPushEndpoint = 'https://exp.host/--/api/v2/push/send';
        const messages = deviceTokens.map(token => ({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data,
            ...extraOptions 
        }));

        logger.info(`Notification Service: Attempting to send notification to ${deviceTokens.length} devices via Expo Push API.`);
        logger.debug(`Expo Push Payload: ${JSON.stringify(messages)}`);

        try {
        

            const response = await axios.post(expoPushEndpoint, messages, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                     'Authorization': `Bearer ${config.notificationServiceApiKey}` 
                },
            });

            logger.info(`Expo Push API Response: ${JSON.stringify(response.data)}`);

            
            if (response.data && response.data.data) {
                const results = response.data.data;
                const successfulReceipts = results.filter(r => r.status === 'ok').length;
                const failedReceipts = results.filter(r => r.status === 'error').length;
                
                if (failedReceipts > 0) {
                    logger.error(`Expo Push Notification: ${failedReceipts} failures encountered.`, { details: results.filter(r => r.status === 'error') });
                    return { success: false, message: `Notification partially sent (${successfulReceipts} sent, ${failedReceipts} failed).`, details: response.data };
                } else {
                    return { success: true, message: 'Notification sent successfully via Expo Push API.', details: response.data };
                }
            } else {
                logger.error('Expo Push API did not return expected data structure.', { response: response.data });
                return { success: false, message: 'Expo Push API returned an unexpected response.', details: response.data };
            }

        } catch (error) {
            logger.error(`Error sending Expo Push notification: ${error.message}`, { details: error.response?.data || error });
            
            logger.warn('Notification Service: Falling back to simulated response due to actual sending error.');
            const simulatedResponse = {
                data: deviceTokens.map(token => ({ status: 'ok', id: `sim-${Math.random().toString(36).substring(7)}` })),
                message: `Simulated success after error: ${error.message}`
            };
            return { success: false, message: 'Failed to send notification via Expo Push API (simulated failure/fallback).', error: error.message, fcmResponse: simulatedResponse };
        }
    }
};

module.exports = notificationService;