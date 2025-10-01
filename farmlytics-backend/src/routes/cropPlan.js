const express = require('express');
const {
    getCropPlans,
    getCropPlan,
    createCropPlan,
    updateCropPlan,
    deleteCropPlan
} = require('../controllers/cropPlanController'); 
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Crop Plans
 *   description: Manage farmer's crop planting plans and estimates
 */

router.use(protect); 
/**
 * @swagger
 * /crop-plans:
 *   get:
 *     summary: Get all crop plans for the authenticated user (or by userId for admin)
 *     tags: [Crop Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: (Admin only) Filter plans by a specific user ID.
 *         example: 60c72b2f9c1e4b001c8e4d3a
 *     responses:
 *       200:
 *         description: A list of crop plans.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 1 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CropPlan'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route('/')
    .get(authorize('farmer', 'admin'), getCropPlans)
    /**
     * @swagger
     * /crop-plans:
     *   post:
     *     summary: Create a new crop plan
     *     tags: [Crop Plans]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - cropName
     *               - districtName
     *               - actualAreaPlantedHa
     *               - plantingDate
     *             properties:
     *               cropName:
     *                 type: string
     *                 enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
     *                 example: Maize
     *               districtName:
     *                 type: string
     *                 example: Gasabo
     *               actualAreaPlantedHa:
     *                 type: number
     *                 format: float
     *                 minimum: 0.01
     *                 example: 2.5
     *               plantingDate:
     *                 type: string
     *                 format: date
     *                 example: 2025-05-01
     *               status:
     *                 type: string
     *                 enum: [Planned, Planted, Harvested, Completed, Cancelled]
     *                 default: Planted
     *                 example: Planted
     *     responses:
     *       201:
     *         description: Crop plan created successfully. Estimates are automatically generated.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/CropPlan'
 *       400:
 *         description: Bad request (e.g., validation error, missing fields)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only farmers/admin can create plans)
 *       500:
 *         description: Error generating estimates or server error
 */
    .post(authorize('farmer', 'admin'), createCropPlan);

/**
 * @swagger
 * /crop-plans/{id}:
 *   get:
 *     summary: Get a single crop plan by ID
 *     tags: [Crop Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the crop plan to retrieve.
 *     responses:
 *       200:
 *         description: Crop plan data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/CropPlan'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user does not own this plan)
 *       404:
 *         description: Crop plan not found
 *   put:
 *     summary: Update a crop plan by ID
 *     tags: [Crop Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the crop plan to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cropName:
 *                 type: string
 *                 enum: [Maize, Beans, Irish potatoes, Cassava, Tomatoes]
 *                 example: Beans
 *               districtName:
 *                 type: string
 *                 example: Nyamagabe
 *               actualAreaPlantedHa:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 example: 3.0
 *               plantingDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-10
 *               status:
 *                 type: string
 *                 enum: [Planned, Planted, Harvested, Completed, Cancelled]
 *                 example: Harvested
 *     responses:
 *       200:
 *         description: Crop plan updated successfully. Estimates are automatically re-generated if relevant fields change.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/CropPlan'
 *       400:
 *         description: Bad request (e.g., validation error)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user does not own this plan)
 *       404:
 *         description: Crop plan not found
 *       500:
 *         description: Error regenerating estimates or server error
 *   delete:
 *     summary: Delete a crop plan by ID
 *     tags: [Crop Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the crop plan to delete.
 *     responses:
 *       200:
 *         description: Crop plan deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object, example: {} }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user does not own this plan)
 *       404:
 *         description: Crop plan not found
 */
router.route('/:id')
    .get(authorize('farmer', 'admin'), getCropPlan)
    .put(authorize('farmer', 'admin'), updateCropPlan)
    .delete(authorize('farmer', 'admin'), deleteCropPlan);

module.exports = router;