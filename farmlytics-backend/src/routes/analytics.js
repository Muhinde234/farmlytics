const express = require('express');
const { 
    getYieldTrends, 
    getDemandTrends,
    getMyYieldPerformance,
    getMyRevenueTrends
} = require('../controllers/analyticsController');
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
 *         description: Start year for the trend data (e.g., 2020). Defaults to 3 years ago.
 *         example: 2020
 *       - in: query
 *         name: year_end
 *         schema:
 *           type: integer
 *         description: End year for the trend data (e.g., 2024). Defaults to current year.
 *         example: 2024
 *     responses:
 *       200:
 *         description: Historical yield trend data from SAS production data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Historical yield trend data from SAS production data." }
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
 *         description: Invalid district or crop, or no data found.
 */
router.get('/yield-trends', authorize('farmer', 'admin', 'buyer'), getYieldTrends);

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
 *         description: Start year for the trend data (e.g., 2017). Defaults to 3 years ago.
 *         example: 2017
 *       - in: query
 *         name: year_end
 *         schema:
 *           type: integer
 *         description: End year for the trend data (e.g., 2020). Defaults to current year.
 *         example: 2020
 *     responses:
 *       200:
 *         description: Historical demand trend data from EICV consumption data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Historical demand trend data from EICV consumption data." }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year: { type: integer, example: 2017 }
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
 *         description: Invalid location or crop, or no data found.
 */
router.get('/demand-trends', authorize('farmer', 'admin', 'buyer'), getDemandTrends);

/**
 * @swagger
 * /analytics/my-yield-performance:
 *   get:
 *     summary: Get logged-in user's personal yield performance trends 
 *     tags: [Analytics & Reporting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
 *         description: Filter by specific crop.
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
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: (Admin only) Filter by a specific user ID.
 *         example: 60c72b2f9c1e4b001c8e4d3a
 *     responses:
 *       200:
 *         description: User's personal yield performance from their recorded crop plans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Personal yield performance data from your recorded crop plans." }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: object
 *                         properties:
 *                           year: { type: integer, example: 2024 }
 *                           crop: { type: string, example: "Maize" }
 *                       avgEstimatedYieldKgPerHa: { type: number, format: float, example: 700.0 }
 *                       avgActualYieldKgPerHa: { type: number, format: float, example: 650.0 }
 *                       totalEstimatedProductionKg: { type: number, format: float, example: 1400.0 }
 *                       totalActualProductionKg: { type: number, format: float, example: 1300.0 }
 *                       count: { type: integer, example: 2 }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/my-yield-performance', authorize('farmer', 'admin'), getMyYieldPerformance);

/**
 * @swagger
 * /analytics/my-revenue-trends:
 *   get:
 *     summary: Get logged-in user's personal revenue trends 
 *     tags: [Analytics & Reporting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
 *         description: Filter by specific crop.
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
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: (Admin only) Filter by a specific user ID.
 *         example: 60c72b2f9c1e4b001c8e4d3a
 *     responses:
 *       200:
 *         description: User's personal revenue performance from their recorded crop plans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Personal revenue performance data from your recorded crop plans." }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: object
 *                         properties:
 *                           year: { type: integer, example: 2024 }
 *                           crop: { type: string, example: "Maize" }
 *                       avgEstimatedRevenueRwf: { type: number, format: float, example: 420000.0 }
 *                       avgActualRevenueRwf: { type: number, format: float, example: 390000.0 }
 *                       totalEstimatedRevenueRwf: { type: number, format: float, example: 840000.0 }
 *                       totalActualRevenueRwf: { type: number, format: float, example: 780000.0 }
 *                       count: { type: integer, example: 2 }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/my-revenue-trends', authorize('farmer', 'admin'), getMyRevenueTrends);

module.exports = router;
