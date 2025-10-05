const mongoose = require('mongoose');

const CropPlanSchema = new mongoose.Schema({
    user: { // Links this crop plan to a specific farmer
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cropName: {
        type: String,
        required: [true, 'Please add a crop name'],
        trim: true,
        enum: ['Maize', 'Beans', 'Irish potatoes', 'Cassava', 'Tomatoes'] // Restrict to MVP crops
    },
    districtName: {
        type: String,
        required: [true, 'Please specify the district name'],
        trim: true
        // In a real app, you might want to validate this against a list of valid districts
    },
    actualAreaPlantedHa: {
        type: Number,
        required: [true, 'Please add the actual area planted in hectares'],
        min: [0.01, 'Area planted must be at least 0.01 hectares']
    },
    plantingDate: {
        type: Date,
        required: [true, 'Please add the planting date']
    },
    // ESTIMATED fields (calculated by the system)
    estimatedHarvestDate: {
        type: Date
    },
    estimatedYieldKgPerHa: {
        type: Number
    },
    estimatedTotalProductionKg: {
        type: Number
    },
    estimatedPricePerKgRwf: {
        type: Number
    },
    estimatedRevenueRwf: {
        type: Number
    },
    // ACTUAL fields (recorded by the farmer post-harvest)
    actualHarvestDate: { // NEW: Date of actual harvest
        type: Date,
        default: null
    },
    actualYieldKgPerHa: { // NEW: Actual yield recorded by farmer
        type: Number,
        min: [0, 'Actual yield cannot be negative'],
        default: null
    },
    actualTotalProductionKg: { // NEW: Actual total production recorded by farmer
        type: Number,
        min: [0, 'Actual production cannot be negative'],
        default: null
    },
    actualSellingPricePerKgRwf: { // NEW: Actual selling price recorded by farmer
        type: Number,
        min: [0, 'Actual selling price cannot be negative'],
        default: null
    },
    actualRevenueRwf: { // NEW: Actual revenue recorded by farmer
        type: Number,
        min: [0, 'Actual revenue cannot be negative'],
        default: null
    },
    harvestNotes: { // NEW: Any notes from the farmer about the harvest
        type: String,
        trim: true,
        default: null
    },
    status: { // To track the lifecycle of the crop plan
        type: String,
        enum: ['Planned', 'Planted', 'Harvested', 'Completed', 'Cancelled'],
        default: 'Planted'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CropPlan', CropPlanSchema);