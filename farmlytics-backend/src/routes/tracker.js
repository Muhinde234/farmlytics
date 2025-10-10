const express = require('express');
const { getHarvestAndRevenueEstimates } = require('../controllers/trackerController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Harvest Tracker
 *   description: Track planted crops and estimate harvest/revenue
 */

/**
 * @swagger
 * /tracker/estimates:
 *   get:
 *     summary: Get harvest and revenue estimates
 *     tags: [Harvest Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: crop_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the crop planted (e.g., "Maize", "Beans").
 *         example: Maize
 *       - in: query
 *         name: actual_area_planted_ha
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: The actual area planted in hectares (e.g., 2.0). Must be a positive number.
 *         example: 2.0
 *       - in: query
 *         name: planting_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date the crop was planted, in "YYYY-MM-DD" format (e.g., "2025-03-15").
 *         example: 2025-03-15
 *       - in: query
 *         name: district_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the district where the crop is planted (e.g., "Gasabo").
 *         example: Gasabo
 *     responses:
 *       200:
 *         description: A JSON object with the estimated figures.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     CropName: { type: string, example: "Maize" }
 *                     Actual_Area_Planted_ha: { type: number, format: float, example: 2.00 }
 *                     Planting_Date: { type: string, format: date, example: "2025-03-15" }
 *                     Estimated_Yield_Kg_per_Ha: { type: number, format: float, example: 600.00 }
 *                     Estimated_Total_Production_Kg: { type: number, format: float, example: 1200.00 }
 *                     Estimated_Price_Per_Kg_Rwf: { type: number, format: float, example: 300.00 }
 *                     Estimated_Revenue_Rwf: { type: number, format: float, example: 360000.00 }
 *                     Estimated_Harvest_Date: { type: string, format: date, example: "2025-07-13" }
 *       400:
 *         description: Bad request (e.g., invalid date format, missing parameters, invalid area)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error (e.g., unable to estimate yield/price)
 */
router.get('/estimates', protect, authorize('farmer', 'admin'), getHarvestAndRevenueEstimates);

module.exports = router;