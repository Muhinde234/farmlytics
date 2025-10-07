const express = require('express');
const { 
    register, 
    login, 
    getMe, 
    updateMe, 
    verifyEmail,
    forgotPassword, 
    resetPassword,  
    renderResetPasswordForm, // NEW: Render the password reset form
    updatePassword  
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user and send verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: new.user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, farmer, buyer]
 *                 default: farmer
 *                 example: farmer
 *     responses:
 *       201:
 *         description: User registered successfully. Email verification link sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User registered. Please check your email for verification link." }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: "60c72b2f9c1e4b001c8e4d3a" }
 *                     name: { type: string, example: "John Doe" }
 *                     email: { type: string, example: "new.user@example.com" }
 *                     role: { type: string, example: "farmer" }
 *                     isVerified: { type: boolean, example: false }
 *       400:
 *         description: Bad request (e.g., missing fields, invalid email, duplicate email)
 *       500:
 *         description: Email could not be sent (server issue)
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 token: { type: string, example: "eyJ..." }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: "60c72b2f9c1e4b001c8e4d3a" }
 *                     name: { type: string, example: "John Doe" }
 *                     email: { type: string, example: "john.doe@example.com" }
 *                     role: { type: string, example: "farmer" }
 *                     isVerified: { type: boolean, example: true }
 *                     preferredDistrictName: { type: string, example: "Gasabo" }
 *                     preferredProvinceName: { type: string, example: "Kigali City" }
 *                     preferredLanguage: { type: string, example: "en" }
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       401:
 *         description: Unauthorized (e.g., invalid credentials, email not verified)
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged in user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "60c72b2f9c1e4b001c8e4d3a" }
 *                     name: { type: string, example: "John Doe" }
 *                     email: { type: string, example: "john.doe@example.com" }
 *                     role: { type: string, example: "farmer" }
 *                     isVerified: { type: boolean, example: true }
 *                     preferredDistrictName: { type: string, example: "Gasabo" }
 *                     preferredProvinceName: { type: string, example: "Kigali City" }
 *                     preferredLanguage: { type: string, example: "en" }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized (e.g., no token, invalid token)
 *   put:
 *     summary: Update current logged in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Johnathan Doe
 *               preferredDistrictName:
 *                 type: string
 *                 example: Nyamagabe
 *               preferredProvinceName:
 *                 type: string
 *                 example: Southern Province
 *               preferredLanguage:
 *                 type: string
 *                 enum: [en, fr, rw]
 *                 example: fr
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., validation error)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.route('/me')
    .get(protect, getMe)
    .put(protect, updateMe);

/**
 * @swagger
 * /auth/verifyemail/{token}:
 *   get:
 *     summary: Verify user email using token (Backend renders success/failure page)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The email verification token received in the user's email.
 *     responses:
 *       200:
 *         description: HTML page indicating successful verification.
 *       400:
 *         description: HTML page indicating invalid or expired verification token.
 *       500:
 *         description: Server error during verification.
 */
router.get('/verifyemail/:token', verifyEmail);

/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     summary: Initiate password reset by sending a reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email sent for password reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Email sent for password reset." }
 *       404:
 *         description: No user found with that email address.
 *       500:
 *         description: Email could not be sent (server issue).
 */
router.post('/forgotpassword', forgotPassword);

/**
 * @swagger
 * /auth/resetpassword-form/{token}:
 *   get:
 *     summary: Render HTML form to reset password (Backend renders form)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The password reset token received in the email.
 *     responses:
 *       200:
 *         description: HTML page with password reset form.
 *       400:
 *         description: HTML page indicating invalid or expired reset token.
 */
router.get('/resetpassword-form/:token', renderResetPasswordForm); // NEW route for form

/**
 * @swagger
 * /auth/resetpassword/{token}:
 *   put:
 *     summary: Reset password using a valid token (handles form submission)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The password reset token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newpassword123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully. User can now login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Password reset successfully. You can now login." }
 *       400:
 *         description: Invalid or expired reset token, or passwords do not match.
 *       500:
 *         description: Server error.
 */
router.put('/resetpassword/:token', resetPassword);

/**
 * @swagger
 * /auth/updatepassword:
 *   put:
 *     summary: Update password for the logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: brandnewpassword
 *               confirmNewPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: brandnewpassword
 *     responses:
 *       200:
 *         description: Password updated successfully. User logged in with new token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 token: { type: string, example: "eyJ..." }
 *                 user: { type: object, properties: { id: { type: string }, email: { type: string } } }
 *       400:
 *         description: New passwords do not match.
 *       401:
 *         description: Unauthorized (e.g., current password incorrect, invalid token).
 *       500:
 *         description: Server error.
 */
router.put('/updatepassword', protect, updatePassword);

module.exports = router;