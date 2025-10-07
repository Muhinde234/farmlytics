const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc      Get all users
// @route     GET /api/v1/admin/users
// @access    Private (Admin only)
exports.getUsers = asyncHandler(async (req, res, next) => {
    // Admins can see all users. No specific filtering needed unless requested.
    const users = await User.find().select('-password'); // Exclude passwords from results

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc      Get single user
// @route     GET /api/v1/admin/users/:id
// @access    Private (Admin only)
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password

    if (!user) {
        res.status(404);
        throw new Error(`User not found with id of ${req.params.id}`);
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc      Create user (by Admin)
// @route     POST /api/v1/admin/users
// @access    Private (Admin only)
// Note: This is separate from /auth/register as it's admin-controlled without email verification initially
exports.createUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, isVerified, preferredDistrictName, preferredProvinceName, preferredLanguage } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'farmer', // Admin can set role, default to farmer
        isVerified: isVerified !== undefined ? isVerified : true, // Admin-created users are verified by default unless specified
        preferredDistrictName,
        preferredProvinceName,
        preferredLanguage
    });

    res.status(201).json({
        success: true,
        data: user // This will return user without password due to schema select: false
    });
});


// @desc      Update user (by Admin)
// @route     PUT /api/v1/admin/users/:id
// @access    Private (Admin only)
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error(`User not found with id of ${req.params.id}`);
    }

    // Admins can update any field except password directly (password handled via specific reset/update flows)
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        isVerified: req.body.isVerified,
        preferredDistrictName: req.body.preferredDistrictName,
        preferredProvinceName: req.body.preferredProvinceName,
        preferredLanguage: req.body.preferredLanguage
    };

    // Filter out undefined fields so Mongoose doesn't try to set them to null/undefined
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    // Handle password change separately if admin provides it, otherwise existing hash remains
    if (req.body.password) {
        user.password = req.body.password; // Pre-save hook will hash this
    }

    // Update other fields
    Object.assign(user, fieldsToUpdate);
    await user.save(); // Save to trigger pre-save hook for password if updated, and run validators

    res.status(200).json({
        success: true,
        data: user.toObject({ getters: true, virtuals: false, transform: (doc, ret) => {
            delete ret.password; // Ensure password is removed even if set
            return ret;
        }})
    });
});


// @desc      Delete user (by Admin)
// @route     DELETE /api/v1/admin/users/:id
// @access    Private (Admin only)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error(`User not found with id of ${req.params.id}`);
    }

    await user.deleteOne(); // Use deleteOne() on the document instance

    res.status(200).json({
        success: true,
        data: {} // Return empty object for successful deletion
    });
});