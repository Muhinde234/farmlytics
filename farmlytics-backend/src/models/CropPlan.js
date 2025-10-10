const mongoose = require('mongoose');

const CropPlanSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cropName: {
        type: String,
        required: [true, 'Please add a crop name'],
        trim: true,
        enum: ['Maize', 'Beans', 'Irish potatoes', 'Cassava', 'Tomatoes'] // MVP crops
    },
    districtName: {
        type: String,
        required: [true, 'Please specify the district name'],
        trim: true
        
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
    
    actualHarvestDate: { 
        type: Date,
        default: null
    },
    actualYieldKgPerHa: { 
        type: Number,
        min: [0, 'Actual yield cannot be negative'],
        default: null
    },
    actualTotalProductionKg: { 
        type: Number,
        min: [0, 'Actual production cannot be negative'],
        default: null
    },
    actualSellingPricePerKgRwf: { 
        type: Number,
        min: [0, 'Actual selling price cannot be negative'],
        default: null
    },
    actualRevenueRwf: { 
        type: Number,
        min: [0, 'Actual revenue cannot be negative'],
        default: null
    },
    harvestNotes: { 
        type: String,
        trim: true,
        default: null
    },
    status: { 
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