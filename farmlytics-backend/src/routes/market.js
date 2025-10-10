const express = require('express');
const {
    getMarketDemandInsights,
    findCooperatives,
    findPotentialBuyersAndProcessors,
    findExporters
} = require('../controllers/marketController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Market Connection
 *   description: Market demand analysis and business connections
 */

/**
 * @swagger
 * /market/demand:
 *   get:
 *     summary: Get market demand insights
 *     tags: [Market Connection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the district (e.g., "Gasabo") or province (e.g., "Southern Province").
 *         example: Gasabo
 *       - in: query
 *         name: location_type
 *         schema:
 *           type: string
 *           enum: [District, Province]
 *           default: District
 *         description: Specifies if location_name is a 'District' or 'Province'.
 *         example: District
 *       - in: query
 *         name: top_n
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The number of top crops to list (default is 5).
 *         example: 3
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [quantity, value]
 *           default: quantity
 *         description: How to sort the demand. 'quantity' for total weighted quantity, 'value' for total weighted value.
 *         example: quantity
 *     responses:
 *       200:
 *         description: A JSON array of market demand insights.
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
 *                       CropName: { type: string, example: "Irish potatoes" }
 *                       Total_Weighted_Consumption_Qty_Kg: { type: number, format: float, example: 1174669.0 }
 *                       Total_Weighted_Consumption_Value_Rwf: { type: number, format: float, example: 575275242.0 }
 *       400:
 *         description: Bad request (e.g., invalid location_type or sort_by)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No market demand data found for the specified location.
 */
router.get('/demand', protect, authorize('farmer', 'buyer', 'admin'), getMarketDemandInsights);

/**
 * @swagger
 * /market/cooperatives:
 *   get:
 *     summary: Find cooperatives
 *     tags: [Market Connection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location_name
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
 *         description: Specifies if location_name is a 'District' or 'Province'.
 *         example: District
 *     responses:
 *       200:
 *         description: A JSON array of cooperative characteristics.
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
 *                       ISIC_Section_Name: { type: string, example: "A: Agriculture, Forestry and Fishing" }
 *                       Total_workers: { type: number, example: 2.0 }
 *                       Annual_Turnover_2022: { type: number, example: 300000.0 }
 *                       Employed_Capital: { type: number, example: 300000.0 }
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No cooperatives found for the specified location.
 */
router.get('/cooperatives', protect, authorize('farmer', 'buyer', 'admin'), findCooperatives);

/**
 * @swagger
 * /market/buyers-processors:
 *   get:
 *     summary: Find potential buyers and food processors
 *     tags: [Market Connection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the district or province.
 *         example: Southern Province
 *       - in: query
 *         name: location_type
 *         schema:
 *           type: string
 *           enum: [District, Province]
 *           default: District
 *         description: Specifies if location_name is a 'District' or 'Province'.
 *         example: Province
 *       - in: query
 *         name: min_workers
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: 'Minimum number of total workers for an establishment (default is 5).'
 *         example: 10
 *       - in: query
 *         name: min_turnover
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *         description: 'Minimum annual turnover in RWF for an establishment (default is 1,000,000).'
 *         example: 5000000
 *     responses:
 *       200:
 *         description: 'A JSON object containing two arrays: Potential_Buyers and Food_Processors.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     Potential_Buyers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           ISIC_Section_Name: { type: string, example: "G: Wholesale and Retail Trade; Repair of Motor Vehicles and Motorcycles" }
 *                           Total_workers: { type: number, example: 18.0 }
 *                           Annual_Turnover_2022: { type: number, example: 5000000.0 }
 *                           Employed_Capital: { type: number, example: 5000000.0 }
 *                     Food_Processors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           ISIC_Section_Name: { type: string, example: "C: Manufacturing" }
 *                           Total_workers: { type: number, example: 10.0 }
 *                           Annual_Turnover_2022: { type: number, example: 5000000.0 }
 *                           Employed_Capital: { type: number, example: 5000000.0 }
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No significant buyers or processors found.
 */
router.get('/buyers-processors', protect, authorize('farmer', 'buyer', 'admin'), findPotentialBuyersAndProcessors);

/**
 * @swagger
 * /market/exporters:
 *   get:
 *     summary: Find exporters
 *     tags: [Market Connection]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the district or province.
 *         example: Eastern Province
 *       - in: query
 *         name: location_type
 *         schema:
 *           type: string
 *           enum: [District, Province]
 *           default: District
 *         description: Specifies if location_name is a 'District' or 'Province'.
 *         example: Province
 *     responses:
 *       200:
 *         description: A JSON array of exporter characteristics.
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
 *                       ISIC_Section_Name: { type: string, example: "C: Manufacturing" }
 *                       Total_workers: { type: number, example: 12.0 }
 *                       Annual_Turnover_2022: { type: number, example: 5000000.0 }
 *                       Employed_Capital: { type: number, example: 5000000.0 }
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No goods exporters found for the specified location.
 */
router.get('/exporters', protect, authorize('farmer', 'buyer', 'admin'), findExporters);

module.exports = router;