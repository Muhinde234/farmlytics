const express = require('express');
const { 
    getUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin - User Management
 *   description: Administrator access to manage user accounts
 */

// All admin routes require authentication and admin authorization
router.use(protect);
router.use(authorize('admin')); // Ensure only 'admin' role can access these routes

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 2 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (e.g., no token, invalid token)
 *       403:
 *         description: Forbidden (user is not an admin)
 *   post:
 *     summary: Create a new user (Admin access)
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
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
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: aline Admin
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aline.admin@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: adminpass123
 *               role:
 *                 type: string
 *                 enum: [admin, farmer, buyer]
 *                 default: farmer
 *                 example: admin
 *               isVerified:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the user's email is verified. Defaults to true for admin created users.
 *               preferredDistrictName:
 *                 type: string
 *                 example: Gasabo
 *               preferredProvinceName:
 *                 type: string
 *                 example: Kigali City
 *               preferredLanguage:
 *                 type: string
 *                 enum: [en, fr, rw]
 *                 example: en
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., validation error, duplicate email)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route('/')
    .get(getUsers)
    .post(createUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update a user's details by ID (Admin access)
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane 
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Optional. If provided, the user's password will be updated (and hashed).
 *                 example: newsecurepass
 *               role:
 *                 type: string
 *                 enum: [admin, farmer, buyer]
 *                 example: farmer
 *               isVerified:
 *                 type: boolean
 *                 example: true
 *               preferredDistrictName:
 *                 type: string
 *                 example: Nyanza
 *               preferredProvinceName:
 *                 type: string
 *                 example: Southern Province
 *               preferredLanguage:
 *                 type: string
 *                 enum: [en, fr, rw]
 *                 example: rw
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., validation error, invalid email format)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete a user by ID (Admin access)
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object, example: {} }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;