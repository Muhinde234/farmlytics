const asyncHandler = require('express-async-handler');
const mlService = require('../utils/mlService'); // Import our ML service
const logger = require('../config/winston');

// @desc      Get dynamic yield prediction
// @route     GET /api/v1/ml/predict-yield
// @access    Private (Farmer, Admin)
exports.predictYield = asyncHandler(async (req, res, next) => {
    const { district, crop, soilType, weatherForecast, historicalPractices } = req.query;

    if (!district || !crop) {
        res.status(400);
        throw new Error('Please provide district and crop for yield prediction.');
    }

    // Call the ML service (which currently returns mock data)
    const prediction = await mlService.getDynamicYieldPrediction(
        district, crop, soilType, weatherForecast, historicalPractices
    );

    res.status(200).json({
        success: true,
        data: prediction
    });
});

// @desc      Get disease/pest prediction
// @route     GET /api/v1/ml/predict-disease-pest
// @access    Private (Farmer, Admin)
exports.predictDiseasePest = asyncHandler(async (req, res, next) => {
    const { crop, region, weatherConditions, plantingDate } = req.query;

    if (!crop || !region) {
        res.status(400);
        throw new Error('Please provide crop and region for disease/pest prediction.');
    }

    const prediction = await mlService.getDiseasePestPrediction(
        crop, region, weatherConditions, plantingDate
    );

    res.status(200).json({
        success: true,
        data: prediction
    });
});

// @desc      Get optimal planting window
// @route     GET /api/v1/ml/optimal-planting-window
// @access    Private (Farmer, Admin)
exports.getOptimalPlantingWindow = asyncHandler(async (req, res, next) => {
    const { crop, district, weatherForecastLongTerm, soilType } = req.query;

    if (!crop || !district) {
        res.status(400);
        throw new Error('Please provide crop and district for optimal planting window prediction.');
    }

    const prediction = await mlService.getOptimalPlantingWindow(
        crop, district, weatherForecastLongTerm, soilType
    );

    res.status(200).json({
        success: true,
        data: prediction
    });
});