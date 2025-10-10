const asyncHandler = require('express-async-handler');
const { mvp_crops_list, province_mapping, district_mapping } = require('../utils/constants');
const CropPlan = require('../models/CropPlan');
const analyticsService = require('../utils/analyticsService'); // Import analytics service


exports.getYieldTrends = asyncHandler(async (req, res, next) => {
    const { district, crop, year_start, year_end } = req.query;

    if (!district || !crop) {
        res.status(400);
        throw new Error('Please provide district and crop for yield trends.');
    }

    const validDistrict = Object.values(district_mapping).includes(district);
    const validCrop = mvp_crops_list.some(c => c.name === crop);

    if (!validDistrict || !validCrop) {
        res.status(404);
        throw new Error('Invalid district or crop provided.');
    }

    const cropPlannerService = analyticsService.getCropPlannerService();
    if (!cropPlannerService) {
        res.status(500);
        throw new Error('Analytics services not initialized. Server error during yield trends.');
    }

    const trends = cropPlannerService.get_yield_trends_historical(
        district,
        crop,
        year_start ? parseInt(year_start) : undefined,
        year_end ? parseInt(year_end) : undefined
    );

    if (!trends || trends.length === 0) {
        res.status(404);
        throw new Error(`No historical yield trend data found for ${crop} in ${district}.`);
    }

    res.status(200).json({
        success: true,
        message: 'Historical yield trend data from SAS production data.',
        data: trends
    });
});

exports.getDemandTrends = asyncHandler(async (req, res, next) => {
    const { location, location_type, crop, year_start, year_end } = req.query;

    if (!location || !crop) {
        res.status(400);
        throw new Error('Please provide location and crop for demand trends.');
    }

    const validLocation = (location_type === 'Province' && Object.values(province_mapping).includes(location)) ||
                         (location_type === 'District' && Object.values(district_mapping).includes(location));
    const validCrop = mvp_crops_list.some(c => c.name === crop);

    if (!validLocation || !validCrop) {
        res.status(404);
        throw new Error('Invalid location or crop provided.');
    }

    const marketDemandService = analyticsService.getMarketDemandService();
    if (!marketDemandService) {
        res.status(500);
        throw new Error('Analytics services not initialized. Server error during demand trends.');
    }

    const trends = marketDemandService.get_demand_trends_historical(
        location,
        location_type,
        crop,
        year_start ? parseInt(year_start) : undefined,
        year_end ? parseInt(year_end) : undefined
    );

    if (!trends || trends.length === 0) {
        res.status(404);
        throw new Error(`No historical demand trend data found for ${crop} in ${location}.`);
    }

    res.status(200).json({
        success: true,
        message: 'Historical demand trend data from EICV consumption data.',
        data: trends
    });
});


exports.getMyYieldPerformance = asyncHandler(async (req, res, next) => {
    const { crop, year_start, year_end } = req.query;
    let query = { user: req.user.id, status: 'Harvested' }; 
    
    if (req.user.role === 'admin' && req.query.userId) {
        query.user = req.query.userId;
    }

    if (crop) {
        query.cropName = crop;
    }

    const startYear = year_start ? parseInt(year_start) : new Date().getFullYear() - 3;
    const endYear = year_end ? parseInt(year_end) : new Date().getFullYear();

  
    const yieldData = await CropPlan.aggregate([
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


exports.getMyRevenueTrends = asyncHandler(async (req, res, next) => {
    const { crop, year_start, year_end } = req.query;
    let query = { user: req.user.id, status: 'Harvested' }; 

    if (req.user.role === 'admin' && req.query.userId) { 
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