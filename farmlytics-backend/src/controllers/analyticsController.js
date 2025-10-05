// src/controllers/analyticsController.js
const asyncHandler = require('express-async-handler');
const { mvp_crops_list, district_mapping } = require('../utils/constants'); // Import constants

// Helper to get a random value for mock data
const getRandom = (min, max) => Math.random() * (max - min) + min;

// @desc      Get historical yield trends
// @route     GET /api/v1/analytics/yield-trends
// @access    Private (Farmer, Admin)
exports.getYieldTrends = asyncHandler(async (req, res, next) => {
    const { district, crop, year_start, year_end } = req.query;

    // --- MVP Placeholder Logic ---
    // For a real implementation, you would query a database with historical SAS data.
    // For now, we return mock data based on input or a generic response.

    if (!district || !crop) {
        return res.status(400).json({
            success: false,
            error: 'Please provide district and crop for yield trends.'
        });
    }

    // Check if district and crop are valid (using our constants)
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
    const startYear = year_start ? parseInt(year_start) : currentYear - 3; // Default to last 3 years
    const endYear = year_end ? parseInt(year_end) : currentYear;

    for (let year = startYear; year <= endYear; year++) {
        // Simulate some trend variation
        const baseYield = mvp_crops_list.find(c => c.name === crop)?.averageMaturityDays || 100; // Using maturity as base for example
        const simulatedYield = parseFloat(
            (baseYield * (10 + getRandom(-2, 2)) + getRandom(0, 500)).toFixed(2)
        ); // kg/ha

        mockData.push({
            year: year,
            district: district,
            crop: crop,
            average_yield_kg_per_ha: simulatedYield,
            total_production_kg: parseFloat((simulatedYield * getRandom(100, 500)).toFixed(2)) // Mock production
        });
    }

    res.status(200).json({
        success: true,
        message: 'This is mock historical yield trend data. Full implementation requires historical data sources.',
        data: mockData
    });
});

// @desc      Get historical demand trends
// @route     GET /api/v1/analytics/demand-trends
// @access    Private (Farmer, Buyer, Admin)
exports.getDemandTrends = asyncHandler(async (req, res, next) => {
    const { location, location_type, crop, year_start, year_end } = req.query;

    // --- MVP Placeholder Logic ---
    // For a real implementation, you would query a database with historical EICV data.

    if (!location || !crop) {
        return res.status(400).json({
            success: false,
            error: 'Please provide location and crop for demand trends.'
        });
    }

    // Check if location and crop are valid
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
        // Simulate demand variation
        const baseDemandQty = getRandom(50000, 200000); // Base quantity in Kg
        const simulatedDemandQty = parseFloat((baseDemandQty * getRandom(0.8, 1.2)).toFixed(2));
        const simulatedDemandValue = parseFloat((simulatedDemandQty * getRandom(200, 600)).toFixed(2)); // Value in Rwf

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
        message: 'This is mock historical demand trend data. Full implementation requires historical data sources.',
        data: mockData
    });
});