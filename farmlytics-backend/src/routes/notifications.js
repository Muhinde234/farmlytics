const express = require('express');
const { 
    sendTestNotification,
    registerDeviceToken
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Push notification services (e.g., Expo Push Notifications)
 */

// These routes generally require authentication
router.use(protect);

/**
 * @swagger
 * /notifications/send-test:
 *   post:
 *     summary: Send a test push notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               deviceToken:
 *                 type: string
 *                 description: (Optional) A specific recipient device token. If `sendToAdminSelf` is true and admin has tokens, this is ignored.
 *                 example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
 *               title:
 *                 type: string
 *                 example: "Harvest Alert"
 *                 description: Title of the notification.
 *               body:
 *                 type: string
 *                 example: "Your maize harvest is due next week!"
 *                 description: Body text of the notification.
 *               data:
 *                 type: object
 *                 description: Optional custom data to send with the notification.
 *                 example: { cropId: "123", type: "harvest_reminder" }
 *               sendToAdminSelf:
 *                 type: boolean
 *                 default: false
 *                 description: If true, attempts to send the notification to the admin's own stored device tokens. Requires admin role and stored tokens.
 *     responses:
 *       200:
 *         description: Test notification request processed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Test notification request processed." }
 *                 details: { type: object, example: { data: [...] } }
 *       400:
 *         description: Bad request (missing parameters, no valid tokens)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user is not an admin)
 *       500:
 *         description: Failed to send notification
 */
router.post('/send-test', authorize('admin'), sendTestNotification);

/**
 * @swagger
 * /notifications/register-token:
 *   post:
 *     summary: Register a device token for push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceToken
 *             properties:
 *               deviceToken:
 *                 type: string
 *                 example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
 *                 description: The unique device token obtained from the mobile device for sending push notifications.
 *     responses:
 *       200:
 *         description: Device token registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Device token registered successfully." }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
 *       400:
 *         description: Bad request (missing deviceToken)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Authenticated user not found.
 */
router.post('/register-token', registerDeviceToken);


module.exports = router;