const express = require('express');
const { register, login, getMe, verifyEmail } = require('../controllers/authController'); // Import verifyEmail
const { protect } = require('../middlewares/auth');

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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered. Please check your email for verification link.
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: "60c72b2f9c1e4b001c8e4d3a" }
 *                     name: { type: string, example: "John Doe" }
 *                     email: { type: string, example: "john.doe@example.com" }
 *                     role: { type: string, example: "farmer" }
 *                     isVerified: { type: boolean, example: true }
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "60c72b2f9c1e4b001c8e4d3a" }
 *                     name: { type: string, example: "John Doe" }
 *                     email: { type: string, example: "john.doe@example.com" }
 *                     role: { type: string, example: "farmer" }
 *                     isVerified: { type: boolean, example: true }
 *                     createdAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized (e.g., no token, invalid token)
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /auth/verifyemail/{token}:
 *   get:
 *     summary: Verify user email using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The email verification token received in the user's email.
 *     responses:
 *       302:
 *         description: Redirects to frontend login page on successful verification.
 *       400:
 *         description: Invalid or expired verification token.
 *       500:
 *         description: Server error during verification.
 */
router.get('/verifyemail/:token', verifyEmail);

module.exports = router;