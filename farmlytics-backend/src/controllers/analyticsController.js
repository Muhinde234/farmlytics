// src/controllers/analyticsController.js
const asyncHandler = require('express-async-handler');
const { mvp_crops_list, province_mapping, district_mapping } = require('../utils/constants');
const CropPlan = require('../models/CropPlan'); // NEW: Import CropPlan model

// Helper to get a random value for mock data
const getRandom = (min, max) => Math.random() * (max - min) + min;

// @desc      Get historical yield trends (STILL MOCK UNLESS NEW CSVs ARE PROVIDED)
// @route     GET /api/v1/analytics/yield-trends
// @access    Private (Farmer, Admin)
exports.getYieldTrends = asyncHandler(async (req, res, next) => {
    const { district, crop, year_start, year_end } = req.query;

    if (!district || !crop) {
        return res.status(400).json({
            success: false,
            error: 'Please provide district and crop for yield trends.'
        });
    }

    const validDistrict = Object.values(district_mapping).includes(district);
    const validCrop = mvp_crops_list.some(c => c.name === crop);

    if (!validDistrict || !validCrop) {
        return res.status(404).json({
            success: false,
            error: 'Invalid district or crop provided.'
        });
    }

    const mockData = [];
    const currentYear = new Date().getFullYear();
    const startYear = year_start ? parseInt(year_start) : currentYear - 3;
    const endYear = year_end ? parseInt(year_end) : currentYear;

    for (let year = startYear; year <= endYear; year++) {
        const baseYield = mvp_crops_list.find(c => c.name === crop)?.averageMaturityDays || 100;
        const simulatedYield = parseFloat(
            (baseYield * (10 + getRandom(-2, 2)) + getRandom(0, 500)).toFixed(2)
        );

        mockData.push({
            year: year,
            district: district,
            crop: crop,
            average_yield_kg_per_ha: simulatedYield,
            total_production_kg: parseFloat((simulatedYield * getRandom(100, 500)).toFixed(2))
        });
    }

    res.status(200).json({
        success: true,
        message: 'This is mock historical yield trend data from static sources. Full implementation requires multiple years of SAS-like data.',
        data: mockData
    });
});

// @desc      Get historical demand trends (STILL MOCK UNLESS NEW CSVs ARE PROVIDED)
// @route     GET /api/v1/analytics/demand-trends
// @access    Private (Farmer, Buyer, Admin)
exports.getDemandTrends = asyncHandler(async (req, res, next) => {
    const { location, location_type, crop, year_start, year_end } = req.query;

    if (!location || !crop) {
        return res.status(400).json({
            success: false,
            error: 'Please provide location and crop for demand trends.'
        });
    }

    const validLocation = (location_type === 'Province' && Object.values(province_mapping).includes(location)) ||
                         (location_type === 'District' && Object.values(district_mapping).includes(location));
    const validCrop = mvp_crops_list.some(c => c.name === crop);

    if (!validLocation || !validCrop) {
        return res.status(404).json({
            success: false,
            error: 'Invalid location or crop provided.'
        });
    }

    const mockData = [];
    const currentYear = new Date().getFullYear();
    const startYear = year_start ? parseInt(year_start) : currentYear - 3;
    const endYear = year_end ? parseInt(year_end) : currentYear;

    for (let year = startYear; year <= endYear; year++) {
        const baseDemandQty = getRandom(50000, 200000);
        const simulatedDemandQty = parseFloat((baseDemandQty * getRandom(0.8, 1.2)).toFixed(2));
        const simulatedDemandValue = parseFloat((simulatedDemandQty * getRandom(200, 600)).toFixed(2));

        mockData.push({
            year: year,
            location: location,
            location_type: location_type,
            crop: crop,
            total_weighted_consumption_qty_kg: simulatedDemandQty,
            total_weighted_consumption_value_rwf: simulatedDemandValue
        });
    }

    res.status(200).json({
        success: true,
        message: 'This is mock historical demand trend data from static sources. Full implementation requires multiple years of EICV-like data.',
        data: mockData
    });
});

// @desc      Get user's personal yield performance trends (REAL DATA FROM MONGODB)
// @route     GET /api/v1/analytics/my-yield-performance
// @access    Private (Farmer, Admin)
exports.getMyYieldPerformance = asyncHandler(async (req, res, next) => {
    const { crop, year_start, year_end } = req.query;
    let query = { user: req.user.id, status: 'Harvested' }; // Only for harvested plans
    
    if (req.user.role === 'admin' && req.query.userId) { // Admin can view other farmers' data
        query.user = req.query.userId;
    }

    if (crop) {
        query.cropName = crop;
    }

    const startYear = year_start ? parseInt(year_start) : new Date().getFullYear() - 3;
    const endYear = year_end ? parseInt(year_end) : new Date().getFullYear();

    // Aggregate crop plans for the user
    const yieldData = await CropPlan.aggregate([
        { $match: query },
        {
            $addFields: { // Extract year from actualHarvestDate or plantingDate
                year: { $year: { $cond: [ "$actualHarvestDate", "$actualHarvestDate", "$plantingDate" ] } }
            }
        },
        { $match: { year: { $gte: startYear, $lte: endYear } } },
        {
            $group: {
                _id: { year: "$year", crop: "$cropName" },
                avgEstimatedYieldKgPerHa: { $avg: "$estimatedYieldKgPerHa" },
                avgActualYieldKgPerHa: { $avg: "$actualYieldKgPerHa" },
                totalEstimatedProductionKg: { $sum: "$estimatedTotalProductionKg" },
                totalActualProductionKg: { $sum: "$actualTotalProductionKg" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.crop": 1 } }
    ]);

    res.status(200).json({
        success: true,
        message: 'Personal yield performance data from your recorded crop plans.',
        data: yieldData
    });
});

// @desc      Get user's personal revenue trends (REAL DATA FROM MONGODB)
// @route     GET /api/v1/analytics/my-revenue-trends
// @access    Private (Farmer, Admin)
exports.getMyRevenueTrends = asyncHandler(async (req, res, next) => {
    const { crop, year_start, year_end } = req.query;
    let query = { user: req.user.id, status: 'Harvested' }; // Only for harvested plans

    if (req.user.role === 'admin' && req.query.userId) { // Admin can view other farmers' data
        query.user = req.query.userId;
    }

    if (crop) {
        query.cropName = crop;
    }

    const startYear = year_start ? parseInt(year_start) : new Date().getFullYear() - 3;
    const endYear = year_end ? parseInt(year_end) : new Date().getFullYear();

    const revenueData = await CropPlan.aggregate([
        { $match: query },
        {
            $addFields: {
                year: { $year: { $cond: [ "$actualHarvestDate", "$actualHarvestDate", "$plantingDate" ] } }
            }
        },
        { $match: { year: { $gte: startYear, $lte: endYear } } },
        {
            $group: {
                _id: { year: "$year", crop: "$cropName" },
                avgEstimatedRevenueRwf: { $avg: "$estimatedRevenueRwf" },
                avgActualRevenueRwf: { $avg: "$actualRevenueRwf" },
                totalEstimatedRevenueRwf: { $sum: "$estimatedRevenueRwf" },
                totalActualRevenueRwf: { $sum: "$actualRevenueRwf" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.crop": 1 } }
    ]);

    res.status(200).json({
        success: true,
        message: 'Personal revenue performance data from your recorded crop plans.',
        data: revenueData
    });
});