const asyncHandler = require('express-async-handler');
const analyticsService = require('../utils/analyticsService'); // Import our analytics service

// @desc      Get crop recommendations
// @route     GET /api/v1/crops/recommendations
// @access    Private (Farmer, Admin)
exports.getCropRecommendations = asyncHandler(async (req, res, next) => {
    const { district_name, farm_size_ha, top_n, season } = req.query;

    if (!district_name || !farm_size_ha) {
        res.status(400);
        throw new Error('Please provide district_name and farm_size_ha as query parameters.');
    }
    // Validate farm_size_ha as a positive number
    const parsedFarmSizeHa = parseFloat(farm_size_ha);
    if (isNaN(parsedFarmSizeHa) || parsedFarmSizeHa <= 0) {
        res.status(400);
        throw new Error('farm_size_ha must be a positive number.');
    }

    const cropPlannerService = analyticsService.getCropPlannerService();
    // Ensure the service is initialized before use
    if (!cropPlannerService) {
        res.status(500);
        throw new Error('Analytics services not initialized. Server error during crop recommendations.');
    }

    const recommendations = cropPlannerService.get_crop_recommendations(
        district_name,
        parsedFarmSizeHa, // Use the parsed float
        top_n ? parseInt(top_n) : undefined, // Pass undefined if not provided to use default in service
        season
    );

    if (!recommendations || recommendations.length === 0) {
        res.status(404);
        throw new Error(`No crop recommendations found for district: ${district_name}${season ? ` in ${season}` : ''}.`);
    }

    res.status(200).json({
        success: true,
        data: recommendations
    });
});