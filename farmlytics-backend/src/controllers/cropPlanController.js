const asyncHandler = require('express-async-handler');
const CropPlan = require('../models/CropPlan');
const analyticsService = require('../utils/analyticsService'); // For estimates

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

    // Optional: Filter by status if provided in query (e.g., ?status=Planted)
    if (req.query.status) {
        query.status = req.query.status;
    }
    // Optional: Limit results if provided (e.g., ?limit=1)
    const limit = req.query.limit ? parseInt(req.query.limit) : 0; // 0 means no limit

    const cropPlans = await CropPlan.find(query)
                                     .limit(limit) // Apply limit
                                     .sort({ plantingDate: -1 }) // Sort by most recent planting date first
                                     .populate('user', 'name email');

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

    if (cropPlan.user.toString() !== req.user.id && req.user.role !== 'admin') {
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

    // IMPORTANT: Ensure plantingDate is in YYYY-MM-DD format for the service
    const formattedPlantingDate = new Date(plantingDate).toISOString().split('T')[0];

    const estimates = await harvestTrackerService.get_harvest_and_revenue_estimates(
        cropName,
        actualAreaPlantedHa,
        formattedPlantingDate, // Use formatted date
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
    // Set initial status if not provided, for new plans
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
    const shouldRecalculateEstimates = fieldsToRecalculateEstimates.some(field => req.body[field] !== undefined && req.body[field] !== cropPlan[field]);

    if (shouldRecalculateEstimates) {
        const harvestTrackerService = analyticsService.getHarvestTrackerService();
        if (!harvestTrackerService) {
            res.status(500);
            throw new Error('Analytics services not initialized. Server error during crop plan update.');
        }

        const updatedCropName = req.body.cropName || cropPlan.cropName;
        const updatedArea = req.body.actualAreaPlantedHa || cropPlan.actualAreaPlantedHa;
        // Ensure plantingDate is correctly formatted for the service
        const updatedPlantingDate = req.body.plantingDate ? new Date(req.body.plantingDate).toISOString().split('T')[0] : (cropPlan.plantingDate ? cropPlan.plantingDate.toISOString().split('T')[0] : null);
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
        // Only allow status changes from 'Planned' or 'Planted' to 'Cancelled' or 'Harvested'
        // This logic might need further refinement based on your business rules
        // For simplicity, for now, if status is provided, it updates.
    });

    res.status(200).json({
        success: true,
        data: cropPlan
    });
});


// @desc      Record actual harvest data for a crop plan
// @route     POST /api/v1/crop-plans/:id/record-harvest
// @access    Private (Farmer, Admin)
exports.recordHarvest = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {
        actualHarvestDate,
        actualYieldKgPerHa,        
        actualSellingPricePerKgRwf, 
        harvestNotes
    } = req.body;

    // 1. Find the crop plan
    let cropPlan = await CropPlan.findById(id);

    if (!cropPlan) {
        res.status(404);
        throw new Error(`Crop plan not found with id of ${id}`);
    }

    // 2. Authorization: Ensure the logged-in user owns this crop plan (or is an admin)
    if (cropPlan.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error(`User ${req.user.id} is not authorized to record harvest for this crop plan`);
    }

    // 3. State validation: Prevent recording harvest if status is not 'Planted'
    // This is crucial to prevent double-harvesting or harvesting a cancelled/planned crop
    if (cropPlan.status === 'Harvested') {
        res.status(400);
        throw new Error('Harvest data for this crop plan has already been recorded.');
    }
    if (cropPlan.status !== 'Planted') {
        res.status(400);
        throw new Error(`Harvest can only be recorded for crop plans with status 'Planted'. Current status is '${cropPlan.status}'.`);
    }

    // 4. Input Validation & Parsing
    const parsedActualYieldKgPerHa = parseFloat(actualYieldKgPerHa);
    const parsedActualSellingPricePerKgRwf = parseFloat(actualSellingPricePerKgRwf);

    if (!actualHarvestDate || isNaN(parsedActualYieldKgPerHa) || parsedActualYieldKgPerHa <= 0 ||
        isNaN(parsedActualSellingPricePerKgRwf) || parsedActualSellingPricePerKgRwf < 0) { // Price can be 0 if no sale yet
        res.status(400);
        throw new Error('Please provide a valid actual harvest date, positive yield per hectare, and non-negative selling price.');
    }

    // 5. Recalculate actual total production and revenue on the backend
    // Use the authoritative actualAreaPlantedHa from the database document
    const actualTotalProductionKg = cropPlan.actualAreaPlantedHa * parsedActualYieldKgPerHa;
    const actualRevenueRwf = actualTotalProductionKg * parsedActualSellingPricePerKgRwf;

    // 6. Update crop plan fields
    cropPlan.actualHarvestDate = actualHarvestDate;
    cropPlan.actualYieldKgPerHa = parsedActualYieldKgPerHa;
    cropPlan.actualTotalProductionKg = actualTotalProductionKg; // Set calculated total
    cropPlan.actualSellingPricePerKgRwf = parsedActualSellingPricePerKgRwf;
    cropPlan.actualRevenueRwf = actualRevenueRwf; // Set calculated revenue
    cropPlan.harvestNotes = harvestNotes || null; // Use null for empty string or undefined
    cropPlan.status = 'Harvested'; // Update status to 'Harvested'

    // 7. Save the updated document to the database
    await cropPlan.save();

    res.status(200).json({
        success: true,
        message: 'Harvest data recorded successfully!',
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
