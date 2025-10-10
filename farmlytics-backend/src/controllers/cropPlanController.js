const asyncHandler = require('express-async-handler');
const CropPlan = require('../models/CropPlan');
const analyticsService = require('../utils/analyticsService')

// @desc      Get all crop plans for a user
// @route     GET /api/v1/crop-plans
// @access    Private (Farmer, Admin)
exports.getCropPlans = asyncHandler(async (req, res, next) => {
    let query = {};
    if (req.user.role === 'farmer') {
        query.user = req.user.id;
    } else if (req.user.role === 'admin' && req.query.userId) {
        query.user = req.query.userId;
    }

    const cropPlans = await CropPlan.find(query).populate('user', 'name email');

    res.status(200).json({
        success: true,
        count: cropPlans.length,
        data: cropPlans
    });
});

// @desc      Get single crop plan
// @route     GET /api/v1/crop-plans/:id
// @access    Private (Farmer, Admin)
exports.getCropPlan = asyncHandler(async (req, res, next) => {
    const cropPlan = await CropPlan.findById(req.params.id).populate('user', 'name email');

    if (!cropPlan) {
        res.status(404);
        throw new Error(`Crop plan not found with id of ${req.params.id}`);
    }

    if (cropPlan.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error(`User ${req.user.id} is not authorized to view this crop plan`);
    }

    res.status(200).json({
        success: true,
        data: cropPlan
    });
});

// @desc      Create new crop plan
// @route     POST /api/v1/crop-plans
// @access    Private (Farmer, Admin)

exports.createCropPlan = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    const { cropName, actualAreaPlantedHa, plantingDate, districtName } = req.body;

    const harvestTrackerService = analyticsService.getHarvestTrackerService();
    if (!harvestTrackerService) {
        res.status(500);
        throw new Error('Analytics services not initialized. Server error during crop plan creation.');
    }

    const estimates = await harvestTrackerService.get_harvest_and_revenue_estimates(
        cropName,
        actualAreaPlantedHa,
        plantingDate,
        districtName
    );

    if (estimates.error) {
        res.status(500);
        throw new Error(`Error generating estimates: ${estimates.error}`);
    }

    req.body.estimatedHarvestDate = estimates.Estimated_Harvest_Date;
    req.body.estimatedYieldKgPerHa = estimates.Estimated_Yield_Kg_per_Ha;
    req.body.estimatedTotalProductionKg = estimates.Estimated_Total_Production_Kg;
    req.body.estimatedPricePerKgRwf = estimates.Estimated_Price_Per_Kg_Rwf;
    req.body.estimatedRevenueRwf = estimates.Estimated_Revenue_Rwf;
   
    if (!req.body.status) {
        req.body.status = 'Planted';
    }


    const cropPlan = await CropPlan.create(req.body);

    res.status(201).json({
        success: true,
        data: cropPlan
    });
});

// @desc      Update crop plan
// @route     PUT /api/v1/crop-plans/:id
// @access    Private (Farmer, Admin)

exports.updateCropPlan = asyncHandler(async (req, res, next) => {
    let cropPlan = await CropPlan.findById(req.params.id);

    if (!cropPlan) {
        res.status(404);
        throw new Error(`Crop plan not found with id of ${req.params.id}`);
    }

    if (cropPlan.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error(`User ${req.user.id} is not authorized to update this crop plan`);
    }

    // Recalculate estimates if relevant fields are updated
    const fieldsToRecalculateEstimates = ['cropName', 'actualAreaPlantedHa', 'plantingDate', 'districtName'];
    const shouldRecalculateEstimates = fieldsToRecalculateEstimates.some(field => req.body[field] !== undefined);

    if (shouldRecalculateEstimates) {
        const harvestTrackerService = analyticsService.getHarvestTrackerService();
        if (!harvestTrackerService) {
            res.status(500);
            throw new Error('Analytics services not initialized. Server error during crop plan update.');
        }

        const updatedCropName = req.body.cropName || cropPlan.cropName;
        const updatedArea = req.body.actualAreaPlantedHa || cropPlan.actualAreaPlantedHa;
        const updatedPlantingDate = req.body.plantingDate || (cropPlan.plantingDate ? cropPlan.plantingDate.toISOString().split('T')[0] : null);
        const updatedDistrict = req.body.districtName || cropPlan.districtName;

        const estimates = await harvestTrackerService.get_harvest_and_revenue_estimates(
            updatedCropName,
            updatedArea,
            updatedPlantingDate,
            updatedDistrict
        );

        if (estimates.error) {
            res.status(500);
            throw new Error(`Error regenerating estimates: ${estimates.error}`);
        }

        req.body.estimatedHarvestDate = estimates.Estimated_Harvest_Date;
        req.body.estimatedYieldKgPerHa = estimates.Estimated_Yield_Kg_per_Ha;
        req.body.estimatedTotalProductionKg = estimates.Estimated_Total_Production_Kg;
        req.body.estimatedPricePerKgRwf = estimates.Estimated_Price_Per_Kg_Rwf;
        req.body.estimatedRevenueRwf = estimates.Estimated_Revenue_Rwf;
    }

    cropPlan = await CropPlan.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: cropPlan
    });
});

// @desc      Record actual harvest data for a crop plan
// @route     PUT /api/v1/crop-plans/:id/record-harvest
// @access    Private (Farmer, Admin)

exports.recordHarvest = asyncHandler(async (req, res, next) => {
    let cropPlan = await CropPlan.findById(req.params.id);

    if (!cropPlan) {
        res.status(404);
        throw new Error(`Crop plan not found with id of ${req.params.id}`);
    }

    if (cropPlan.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error(`User ${req.user.id} is not authorized to record harvest for this crop plan`);
    }

    const { actualHarvestDate, actualYieldKgPerHa, actualSellingPricePerKgRwf, harvestNotes } = req.body;

    if (!actualHarvestDate || actualYieldKgPerHa === undefined || actualSellingPricePerKgRwf === undefined) {
        res.status(400);
        throw new Error('Please provide actualHarvestDate, actualYieldKgPerHa, and actualSellingPricePerKgRwf.');
    }
    if (isNaN(parseFloat(actualYieldKgPerHa)) || parseFloat(actualYieldKgPerHa) < 0 ||
        isNaN(parseFloat(actualSellingPricePerKgRwf)) || parseFloat(actualSellingPricePerKgRwf) < 0) {
        res.status(400);
        throw new Error('Actual yield and selling price must be non-negative numbers.');
    }

    const parsedActualYieldKgPerHa = parseFloat(actualYieldKgPerHa);
    const parsedActualSellingPricePerKgRwf = parseFloat(actualSellingPricePerKgRwf);

    
    const actualTotalProductionKg = cropPlan.actualAreaPlantedHa * parsedActualYieldKgPerHa;
    const actualRevenueRwf = actualTotalProductionKg * parsedActualSellingPricePerKgRwf;

   
    cropPlan.actualHarvestDate = actualHarvestDate;
    cropPlan.actualYieldKgPerHa = parsedActualYieldKgPerHa;
    cropPlan.actualTotalProductionKg = actualTotalProductionKg;
    cropPlan.actualSellingPricePerKgRwf = parsedActualSellingPricePerKgRwf;
    cropPlan.actualRevenueRwf = actualRevenueRwf;
    cropPlan.harvestNotes = harvestNotes || null;
    cropPlan.status = 'Harvested'; 

    await cropPlan.save(); 

    res.status(200).json({
        success: true,
        data: cropPlan
    });
});

// @desc      Delete crop plan
// @route     DELETE /api/v1/crop-plans/:id
// @access    Private (Farmer, Admin)
exports.deleteCropPlan = asyncHandler(async (req, res, next) => {
    const cropPlan = await CropPlan.findById(req.params.id);

    if (!cropPlan) {
        res.status(404);
        throw new Error(`Crop plan not found with id of ${req.params.id}`);
    }

    if (cropPlan.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error(`User ${req.user.id} is not authorized to delete this crop plan`);
    }

    await cropPlan.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
