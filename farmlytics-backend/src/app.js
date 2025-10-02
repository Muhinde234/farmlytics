const express = require('express');
const app = express();
const config = require('./config');
const errorHandler = require('./middlewares/error');
const cors = require('cors');

 require('colors'); 

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
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
                url: `http://localhost:${config.port}/api/v1`,
                description: 'Development server'
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
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john.doe@example.com' },
                        role: { type: 'string', enum: ['admin', 'farmer', 'buyer'], example: 'farmer' },
                        isVerified: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                CropPlan: { // Define the CropPlan schema for Swagger
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
    apis: ['./src/routes/*.js', './src/models/*.js', './src/controllers/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(cors());



app.use(express.json());

// Mount routers
const authRoutes = require('./routes/auth');
const cropPlannerRoutes = require('./routes/cropPlanner'); 
const marketRoutes = require('./routes/market');
const trackerRoutes = require('./routes/tracker');
const cropPlanRoutes = require('./routes/cropPlan'); 

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/crops', cropPlannerRoutes); 
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/tracker', trackerRoutes);
app.use('/api/v1/crop-plans', cropPlanRoutes); 


app.get('/', (req, res) => {
    res.send('Farmlytics API is running...');
});


app.use(errorHandler);

module.exports = app;