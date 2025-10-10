const asyncHandler = require('express-async-handler');
const User = require('../models/User');


exports.getUsers = asyncHandler(async (req, res, next) => {
    
    const users = await User.find().select('-password'); 

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});


exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password'); 
    if (!user) {
        res.status(404);
        throw new Error(`User not found with id of ${req.params.id}`);
    }

    res.status(200).json({
        success: true,
        data: user
    });
});


exports.createUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, isVerified, preferredDistrictName, preferredProvinceName, preferredLanguage } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'farmer', 
        isVerified: isVerified !== undefined ? isVerified : true, 
        preferredDistrictName,
        preferredProvinceName,
        preferredLanguage
    });

    res.status(201).json({
        success: true,
        data: user 
    });
});


exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error(`User not found with id of ${req.params.id}`);
    }

   
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        isVerified: req.body.isVerified,
        preferredDistrictName: req.body.preferredDistrictName,
        preferredProvinceName: req.body.preferredProvinceName,
        preferredLanguage: req.body.preferredLanguage
    };

    
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

   
    if (req.body.password) {
        user.password = req.body.password; 
    }

  
    Object.assign(user, fieldsToUpdate);
    await user.save(); 

    res.status(200).json({
        success: true,
        data: user.toObject({ getters: true, virtuals: false, transform: (doc, ret) => {
            delete ret.password; 
            return ret;
        }})
    });
});



exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error(`User not found with id of ${req.params.id}`);
    }

    await user.deleteOne(); 

    res.status(200).json({
        success: true,
        data: {} 
    });
});