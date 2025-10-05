// src/routes/analytics.js
const express = require('express');
const { getYieldTrends, getDemandTrends } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics & Reporting
 *   description: Historical data trends for visualization
 */

// All analytics routes require authentication
router.use(protect);

/**
 * @swagger
 * /analytics/yield-trends:
 *   get:
 *     summary: Get historical yield trends for a crop in a district
 *     tags: [Analytics & Reporting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the district (e.g., "Gasabo").
 *         example: Gasabo
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
 *         required: true
 *         description: The name of the crop.
 *         example: Maize
 *       - in: query
 *         name: year_start
 *         schema:
 *           type: integer
 *         description: Start year for the trend data (e.g., 2022). Defaults to 3 years ago.
 *         example: 2022
 *       - in: query
 *         name: year_end
 *         schema:
 *           type: integer
 *         description: End year for the trend data (e.g., 2025). Defaults to current year.
 *         example: 2025
 *     responses:
 *       200:
 *         description: Mock historical yield trend data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "This is mock historical yield trend data. Full implementation requires historical data sources." }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year: { type: integer, example: 2023 }
 *                       district: { type: string, example: "Gasabo" }
 *                       crop: { type: string, example: "Maize" }
 *                       average_yield_kg_per_ha: { type: number, format: float, example: 1250.75 }
 *                       total_production_kg: { type: number, format: float, example: 500000.00 }
 *       400:
 *         description: Bad request (e.g., missing parameters)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Invalid district or crop.
 */
router.get('/yield-trends', authorize('farmer', 'admin'), getYieldTrends);

/**
 * @swagger
 * /analytics/demand-trends:
 *   get:
 *     summary: Get historical demand trends for a crop in a location
 *     tags: [Analytics & Reporting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the district (e.g., "Gasabo") or province (e.g., "Kigali City").
 *         example: Gasabo
 *       - in: query
 *         name: location_type
 *         schema:
 *           type: string
 *           enum: [District, Province]
 *           default: District
 *         description: Specifies if location is a "District" or "Province".
 *         example: District
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
 *         required: true
 *         description: The name of the crop.
 *         example: Beans
 *       - in: query
 *         name: year_start
 *         schema:
 *           type: integer
 *         description: Start year for the trend data (e.g., 2022). Defaults to 3 years ago.
 *         example: 2022
 *       - in: query
 *         name: year_end
 *         schema:
 *           type: integer
 *         description: End year for the trend data (e.g., 2025). Defaults to current year.
 *         example: 2025
 *     responses:
 *       200:
 *         description: Mock historical demand trend data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "This is mock historical demand trend data. Full implementation requires historical data sources." }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year: { type: integer, example: 2023 }
 *                       location: { type: string, example: "Gasabo" }
 *                       location_type: { type: string, example: "District" }
 *                       crop: { type: string, example: "Beans" }
 *                       total_weighted_consumption_qty_kg: { type: number, format: float, example: 150000.00 }
 *                       total_weighted_consumption_value_rwf: { type: number, format: float, example: 75000000.00 }
 *       400:
 *         description: Bad request (e.g., missing parameters)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Invalid location or crop.
 */
router.get('/demand-trends', authorize('farmer', 'buyer', 'admin'), getDemandTrends);

module.exports = router;