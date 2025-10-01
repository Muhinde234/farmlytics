const express = require('express');
const { getCropRecommendations } = require('../controllers/cropPlannerController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Crop Planner
 *   description: Crop recommendation and planning
 */

/**
 * @swagger
 * /crops/recommendations:
 *   get:
 *     summary: Get crop recommendations
 *     tags: [Crop Planner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: district_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the district (e.g., "Gasabo").
 *         example: Gasabo
 *       - in: query
 *         name: farm_size_ha
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: The total farm size available in hectares (e.g., 5.0). Must be a positive number.
 *         example: 5.0
 *       - in: query
 *         name: top_n
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         description: The number of top crops to recommend (default is 3).
 *         example: 3
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *           enum: [SeasonA, SeasonB, SeasonC]
 *         description: The specific agricultural season (e.g., "SeasonA"). If not provided, overall best performance is considered.
 *         example: SeasonA
 *     responses:
 *       200:
 *         description: A JSON array of recommended crop objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       CropName: { type: string, example: "Beans" }
 *                       Recommended_Area_ha: { type: number, format: float, example: 1.09 }
 *                       Estimated_Yield_Kg_per_Ha: { type: number, format: float, example: 2190.97 }
 *                       Estimated_Total_Production_Kg: { type: number, format: float, example: 2380.60 }
 *       400:
 *         description: Bad request (e.g., missing parameters, invalid farm_size_ha)
 *       401:
 *         description: Unauthorized (e.g., no token, invalid token)
 *       403:
 *         description: Forbidden (user role not authorized)
 *       404:
 *         description: No data available for the specified district or season.
 */
router.get('/recommendations', protect, authorize('farmer', 'admin'), getCropRecommendations);

module.exports = router;