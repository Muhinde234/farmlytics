const asyncHandler = require('express-async-handler');
const analyticsService = require('../utils/analyticsService'); 

// @desc      Get market demand insights
// @route     GET /api/v1/market/demand
// @access    Private (Farmer, Buyer, Admin)
exports.getMarketDemandInsights = asyncHandler(async (req, res, next) => {
    const { location_name, location_type, top_n, sort_by } = req.query;

    if (!location_name) {
        res.status(400);
        throw new Error('Please provide location_name as a query parameter.');
    }

    const marketDemandService = analyticsService.getMarketDemandService();
    const insights = marketDemandService.get_market_demand_insights(
        location_name,
        location_type,
        top_n ? parseInt(top_n) : undefined,
        sort_by
    );

    if (!insights || insights.length === 0) {
        res.status(404);
        throw new Error(`No market demand data found for ${location_type || 'District'}: ${location_name}.`);
    }

    res.status(200).json({
        success: true,
        data: insights
    });
});

// @desc      Find cooperatives
// @route     GET /api/v1/market/cooperatives
// @access    Private (Farmer, Buyer, Admin)
exports.findCooperatives = asyncHandler(async (req, res, next) => {
    const { location_name, location_type } = req.query;

    if (!location_name) {
        res.status(400);
        throw new Error('Please provide location_name as a query parameter.');
    }

    const marketConnectionService = analyticsService.getMarketConnectionService();
    const cooperatives = marketConnectionService.find_cooperatives(
        location_name,
        location_type
    );

    if (!cooperatives || cooperatives.length === 0) {
        res.status(404);
        throw new Error(`No cooperatives found for ${location_type || 'District'}: ${location_name}.`);
    }

    res.status(200).json({
        success: true,
        data: cooperatives
    });
});

// @desc      Find potential buyers and food processors
// @route     GET /api/v1/market/buyers-processors
// @access    Private (Farmer, Buyer, Admin)
exports.findPotentialBuyersAndProcessors = asyncHandler(async (req, res, next) => {
    const { location_name, location_type, min_workers, min_turnover } = req.query;

    if (!location_name) {
        res.status(400);
        throw new Error('Please provide location_name as a query parameter.');
    }

    const marketConnectionService = analyticsService.getMarketConnectionService();
    const results = marketConnectionService.find_potential_buyers_and_processors(
        location_name,
        location_type,
        min_workers ? parseInt(min_workers) : undefined,
        min_turnover ? parseFloat(min_turnover) : undefined
    );

    if ((!results.Potential_Buyers || results.Potential_Buyers.length === 0) &&
        (!results.Food_Processors || results.Food_Processors.length === 0)) {
        res.status(404);
        throw new Error(`No significant potential buyers or food processors found for ${location_type || 'District'}: ${location_name}.`);
    }

    res.status(200).json({
        success: true,
        data: results
    });
});

// @desc      Find exporters
// @route     GET /api/v1/market/exporters
// @access    Private (Farmer, Buyer, Admin)
exports.findExporters = asyncHandler(async (req, res, next) => {
    const { location_name, location_type } = req.query;

    if (!location_name) {
        res.status(400);
        throw new Error('Please provide location_name as a query parameter.');
    }

    const marketConnectionService = analyticsService.getMarketConnectionService();
    const exporters = marketConnectionService.find_exporters(
        location_name,
        location_type
    );

    if (!exporters || exporters.length === 0) {
        res.status(404);
        throw new Error(`No goods exporters found for ${location_type || 'District'}: ${location_name}.`);
    }

    res.status(200).json({
        success: true,
        data: exporters
    });
});