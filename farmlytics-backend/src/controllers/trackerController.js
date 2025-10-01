const asyncHandler = require('express-async-handler');
const analyticsService = require('../utils/analyticsService'); 

// @desc      Get harvest and revenue estimates
// @route     GET /api/v1/tracker/estimates
// @access    Private (Farmer, Admin)
exports.getHarvestAndRevenueEstimates = asyncHandler(async (req, res, next) => {
    const { crop_name, actual_area_planted_ha, planting_date, district_name } = req.query;

    if (!crop_name || !actual_area_planted_ha || !planting_date || !district_name) {
        res.status(400);
        throw new Error('Please provide crop_name, actual_area_planted_ha, planting_date, and district_name as query parameters.');
    }
    if (isNaN(parseFloat(actual_area_planted_ha)) || parseFloat(actual_area_planted_ha) <= 0) {
        res.status(400);
        throw new Error('actual_area_planted_ha must be a positive number.');
    }
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(planting_date)) {
        res.status(400);
        throw new Error('planting_date must be in YYYY-MM-DD format.');
    }


    const harvestTrackerService = analyticsService.getHarvestTrackerService();
    const estimates = await harvestTrackerService.get_harvest_and_revenue_estimates(
        crop_name,
        parseFloat(actual_area_planted_ha),
        planting_date,
        district_name
    );

    if (estimates.error) { 
        res.status(500);
        throw new Error(estimates.error);
    }

    res.status(200).json({
        success: true,
        data: estimates
    });
});