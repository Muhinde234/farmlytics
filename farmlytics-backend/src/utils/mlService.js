// src/utils/mlService.js
const logger = require('../config/winston');

const mlService = {

    async getDynamicYieldPrediction(district, crop, soilType, weatherForecast, historicalPractices) {
        logger.info(`ML Service: Request for Dynamic Yield Prediction for ${crop} in ${district}`);
       
        const mockYield = (Math.random() * 500 + 1000).toFixed(2); 
        logger.debug(`ML Service: Dynamic Yield Prediction mock result: ${mockYield}`);
        return {
            predicted_yield_kg_per_ha: parseFloat(mockYield),
            confidence: (Math.random() * 0.2 + 0.8).toFixed(2),
            factors_considered: { district, crop, soilType, weatherForecast, historicalPractices },
            message: "This is a mock prediction. Actual ML model integration pending."
        };
    },

    async getDiseasePestPrediction(crop, region, weatherConditions, plantingDate) {
        logger.info(`ML Service: Request for Disease/Pest Prediction for ${crop} in ${region}`);
        const mockRisk = Math.random();
        let prediction = 'Low Risk';
        if (mockRisk > 0.8) prediction = 'High Risk of Pests';
        else if (mockRisk > 0.5) prediction = 'Medium Risk of Disease';
        
        logger.debug(`ML Service: Disease/Pest Prediction mock result: ${prediction}`);
        return {
            prediction: prediction,
            risk_score: parseFloat(mockRisk.toFixed(2)),
            common_diseases_pests: mockRisk > 0.5 ? ['Aphids', 'Mildew'] : [],
            preventive_measures: ['Monitor regularly', 'Crop rotation'],
            message: "This is a mock prediction. Actual ML model integration pending."
        };
    },

    async getOptimalPlantingWindow(crop, district, weatherForecastLongTerm, soilType) {
        logger.info(`ML Service: Request for Optimal Planting Window for ${crop} in ${district}`);
        const mockMonth = Math.floor(Math.random() * 3) + 3; 
        const mockDay = Math.floor(Math.random() * 20) + 1; 
        const currentYear = new Date().getFullYear();

        logger.debug(`ML Service: Optimal Planting Window mock result: ${currentYear}-${mockMonth}-${mockDay}`);
        return {
            optimal_start_date: `${currentYear}-${String(mockMonth).padStart(2, '0')}-${String(mockDay).padStart(2, '0')}`,
            optimal_end_date: `${currentYear}-${String(mockMonth + 1).padStart(2, '0')}-${String(mockDay + 10).padStart(2, '0')}`,
            rationale: 'Based on simulated historical weather patterns and crop requirements.',
            message: "This is a mock recommendation. Actual ML model integration pending."
        };
    }
};

module.exports = mlService;