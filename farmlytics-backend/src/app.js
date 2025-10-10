const express = require('express');
const app = express();
const config = require('./config');
const errorHandler = require('./middlewares/error');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./config/winston');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.set('trust proxy', 1);


app.use(helmet()); 


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(morgan('combined', { stream: logger.stream })); 


// Allow all origins for CORS (IMPORTANT: RESTRICT IN PRODUCTION!)
app.use(cors({ 
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'] 
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
})); 

app.use(express.json());

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Farmlytics API',
            version: '1.0.0',
            description: 'API documentation for the Farmlytics application, providing crop planning, market insights, and harvest tracking.',
            contact: {
                name: 'Farmlytics Support',
                email: 'support@farmlytics.com'
            }
        },
        servers: [
            {
                url: `${config.nodeEnv === 'production' ? 'https' : 'http'}://${process.env.RENDER_EXTERNAL_HOSTNAME || `localhost:${config.port}`}/api/v1`,
                // CRITICAL FIX: Dynamically determine protocol and host for Swagger base URL
                // Use HTTPS if RENDER_EXTERNAL_HOSTNAME is present (meaning deployed on Render)
                // Otherwise, default to HTTP localhost for local development
                url: `${process.env.RENDER_EXTERNAL_HOSTNAME ? 'https' : 'http'}://${process.env.RENDER_EXTERNAL_HOSTNAME || `localhost:${config.port}`}/api/v1`,
                description: 'Deployment / Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60c72b2f9c1e4b001c8e4d3a' },
                        name: { type: 'string', example: 'Aline KIM' },
                        email: { type: 'string', example: 'kim.aline@gmail.com' },
                        role: { type: 'string', enum: ['admin', 'farmer', 'buyer'], example: 'farmer' },
                        isVerified: { type: 'boolean', example: true },
                        preferredDistrictName: { type: 'string', example: "Gasabo", nullable: true },
                        preferredProvinceName: { type: 'string', example: "Kigali City", nullable: true },
                        preferredLanguage: { type: 'string', enum: ['en', 'fr', 'rw'], example: "en" },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                CropPlan: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60c72b2f9c1e4b001c8e4d3b' },
                        user: { type: 'string', example: '60c72b2f9c1e4b001c8e4d3a', description: 'ID of the farmer who owns this plan' },
                        cropName: { type: 'string', enum: ['Maize', 'Beans', 'Irish potatoes', 'Cassava', 'Tomatoes'], example: 'Maize' },
                        districtName: { type: 'string', example: 'Gasabo' },
                        actualAreaPlantedHa: { type: 'number', format: 'float', example: 2.5 },
                        plantingDate: { type: 'string', format: 'date', example: '2025-05-01' },
                        estimatedHarvestDate: { type: 'string', format: 'date', example: '2025-09-01' },
                        estimatedYieldKgPerHa: { type: 'number', format: 'float', example: 600.0 },
                        estimatedTotalProductionKg: { type: 'number', format: 'float', example: 1500.0 },
                        estimatedPricePerKgRwf: { type: 'number', format: 'float', example: 350.0 },
                        estimatedRevenueRwf: { type: 'number', format: 'float', example: 525000.0 },
                        actualHarvestDate: { type: 'string', format: 'date', example: '2025-09-15', nullable: true },
                        actualYieldKgPerHa: { type: 'number', format: 'float', example: 580.0, nullable: true },
                        actualTotalProductionKg: { type: 'number', format: 'float', example: 1450.0, nullable: true },
                        actualSellingPricePerKgRwf: { type: 'number', format: 'float', example: 370.0, nullable: true },
                        actualRevenueRwf: { type: 'number', format: 'float', example: 536500.0, nullable: true },
                        harvestNotes: { type: 'string', example: 'Good yield, slightly above average.', nullable: true },
                        status: { type: 'string', enum: ['Planned', 'Planted', 'Harvested', 'Completed', 'Cancelled'], example: 'Planted' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js', './src/models/*.js', './src/controllers/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const authRoutes = require('./routes/auth');
const cropPlannerRoutes = require('./routes/cropPlanner');
const marketRoutes = require('./routes/market');
const trackerRoutes = require('./routes/tracker');
const cropPlanRoutes = require('./routes/cropPlan');
const referenceDataRoutes = require('./routes/referenceData');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const mlRoutes = require('./routes/ml');
const notificationRoutes = require('./routes/notifications');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/crops', cropPlannerRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/tracker', trackerRoutes);
app.use('/api/v1/crop-plans', cropPlanRoutes);
app.use('/api/v1', referenceDataRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ml', mlRoutes);
app.use('/api/v1/notifications', notificationRoutes);


app.get('/', (req, res) => {
    res.send('Farmlytics API is running...');
});

app.use(errorHandler);

module.exports = app;
