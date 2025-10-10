
// src/routes/referenceData.js
const express = require('express');
const { getProvinces, getDistricts, getCropList } = require('../controllers/referenceDataController');
const { protect, authorize } = require('../middlewares/auth'); 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reference Data
 *   description: Static lists for geographical areas and crops
 */

/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Get a list of all districts
 *     tags: [Reference Data]
 *     responses:
 *       200:
 *         description: A JSON array of districts.
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
 *                       code: { type: integer, example: 11 }
 *                       name: { type: string, example: "Nyarugenge" }
 */
router.get('/districts', getDistricts); 

/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Get a list of all provinces
 *     tags: [Reference Data]
 *     responses:
 *       200:
 *         description: A JSON array of provinces.
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
 *                       code: { type: integer, example: 1 }
 *                       name: { type: string, example: "Kigali City" }
 */
router.get('/provinces', getProvinces);

/**
 * @swagger
 * /crops/list:
 *   get:
 *     summary: Get a list of all available MVP crops with metadata
 *     tags: [Reference Data]
 *     responses:
 *       200:
 *         description: A JSON array of crops.
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
 *                       name: { type: string, example: "Maize" }
 *                       averageMaturityDays: { type: integer, example: 120 }
 */
router.get('/crops/list', getCropList); 

module.exports = router;