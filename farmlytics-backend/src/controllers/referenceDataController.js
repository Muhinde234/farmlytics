// src/controllers/referenceDataController.js
const asyncHandler = require('express-async-handler');
const { province_mapping, district_mapping, mvp_crops_list } = require('../utils/constants'); 

const mapToArray = (map) => Object.entries(map).map(([code, name]) => ({ code: parseInt(code), name }));

// @desc      Get all provinces
// @route     GET /api/v1/provinces
// @access    Public (or Private if desired)
exports.getProvinces = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: mapToArray(province_mapping)
    });
});

// @desc      Get all districts
// @route     GET /api/v1/districts
// @access    Public (or Private if desired)
exports.getDistricts = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: mapToArray(district_mapping)
    });
});

// @desc      Get all available crops
// @route     GET /api/v1/crops/list
// @access    Public (or Private if desired)
exports.getCropList = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: mvp_crops_list
    });
});
