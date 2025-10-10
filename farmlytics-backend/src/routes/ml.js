const express = require('express');
const {
    predictYield,
    predictDiseasePest,
    getOptimalPlantingWindow
} = require('../controllers/mlController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Machine Learning (ML) Models
 *   description:  API endpoints for advanced agricultural predictions
 */

// All ML routes require authentication (and usually 'farmer' or 'admin' role)
router.use(protect);
router.use(authorize('farmer', 'admin'));

/**
 * @swagger
 * /ml/predict-yield:
 *   get:
 *     summary: Get dynamic yield prediction for a crop
 *     tags: [Machine Learning (ML) Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         required: true
 *         description: The district name (e.g., "Gasabo").
 *         example: Gasabo
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
 *         required: true
 *         description: The crop name (e.g., "Maize").
 *         example: Maize
 *       - in: query
 *         name: soilType
 *         schema:
 *           type: string
 *         description: Optional soil type (e.g., "Clay", "Loam").
 *         example: Loam
 *       - in: query
 *         name: weatherForecast
 *         schema:
 *           type: string
 *         description: Optional weather forecast summary (e.g., "Sunny next week", "Heavy rain").
 *         example: "Sunny next week"
 *       - in: query
 *         name: historicalPractices
 *         schema:
 *           type: string
 *         description: Optional summary of historical farming practices.
 *         example: "Good fertilizer use"
 *     responses:
 *       200:
 *         description: Dynamic yield prediction.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     predicted_yield_kg_per_ha: { type: number, format: float, example: 1250.75 }
 *                     confidence: { type: number, format: float, example: 0.92 }
 *                     factors_considered: { type: object, example: { district: "Gasabo", crop: "Maize" } }
 *                     message: { type: string, example: "This is a mock prediction. Actual ML model integration pending." }
 *       400:
 *         description: Bad request (e.g., missing parameters)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user role not authorized)
 */
router.get('/predict-yield', predictYield);

/**
 * @swagger
 * /ml/predict-disease-pest:
 *   get:
 *     summary: Get disease/pest prediction for a crop
 *     tags: [Machine Learning (ML) Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
 *         required: true
 *         description: The crop name.
 *         example: Beans
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         required: true
 *         description: The region (district or province name).
 *         example: Nyamagabe
 *       - in: query
 *         name: weatherConditions
 *         schema:
 *           type: string
 *         description: Current/forecasted weather conditions (e.g., "High humidity").
 *         example: "High humidity"
 *       - in: query
 *         name: plantingDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The planting date (YYYY-MM-DD).
 *         example: "2025-04-10"
 *     responses:
 *       200:
 *         description: Disease/pest prediction.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     prediction: { type: string, example: "Medium Risk of Disease" }
 *                     risk_score: { type: number, format: float, example: 0.65 }
 *                     common_diseases_pests: { type: array, items: { type: string }, example: ["Aphids", "Mildew"] }
 *                     preventive_measures: { type: array, items: { type: string }, example: ["Monitor regularly", "Crop rotation"] }
 *                     message: { type: string, example: "This is a mock prediction. Actual ML model integration pending." }
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/predict-disease-pest', predictDiseasePest);

/**
 * @swagger
 * /ml/optimal-planting-window:
 *   get:
 *     summary: Get optimal planting window for a crop in a district
 *     tags: [Machine Learning (ML) Models]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
 *         required: true
 *         description: The crop name.
 *         example: Irish potatoes
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         required: true
 *         description: The district name.
 *         example: Rubavu
 *       - in: query
 *         name: weatherForecastLongTerm
 *         schema:
 *           type: string
 *         description: Long-term weather forecast summary.
 *         example: "Expected dry season in 3 months"
 *       - in: query
 *         name: soilType
 *         schema:
 *           type: string
 *         description: Soil type (e.g., "Volcanic").
 *         example: Volcanic
 *     responses:
 *       200:
 *         description: Optimal planting window recommendation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     optimal_start_date: { type: string, format: date, example: "2025-03-10" }
 *                     optimal_end_date: { type: string, format: date, example: "2025-04-15" }
 *                     rationale: { type: string, example: "Based on simulated historical weather patterns and crop requirements." }
 *                     message: { type: string, example: "This is a mock recommendation. Actual ML model integration pending." }
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/optimal-planting-window', getOptimalPlantingWindow);

module.exports = router;