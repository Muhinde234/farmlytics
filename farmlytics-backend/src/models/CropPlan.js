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
        enum: ['Maize', 'Beans', 'Irish potatoes', 'Cassava', 'Tomatoes'] 
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


CropPlanSchema.pre('save', async function(next) {
    if (this.isModified('actualAreaPlantedHa') || this.isModified('plantingDate') || this.isModified('districtName')) {
        
    }
    next();
});


module.exports = mongoose.model('CropPlan', CropPlanSchema);