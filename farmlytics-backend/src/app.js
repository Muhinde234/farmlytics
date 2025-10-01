const express = require('express');
const app = express();
const config = require('./config');
const errorHandler = require('./middlewares/error');
const cors = require('cors'); 
 require('colors'); 


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
                url: `http://localhost:${config.port}/api/v1`, // Ensure this is http, not https for local dev
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
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js', './src/models/*.js', './src/controllers/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Enable CORS for all routes
// For development, allow all origins. In production, restrict this.
app.use(cors()); 


// Body parser for JSON
app.use(express.json());

// Mount routers
const authRoutes = require('./routes/auth');
const cropPlannerRoutes = require('./routes/cropPlanner');
const marketRoutes = require('./routes/market');
const trackerRoutes = require('./routes/tracker');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/crops', cropPlannerRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/tracker', trackerRoutes);


app.get('/', (req, res) => {
    res.send('Farmlytics API is running...');
});


app.use(errorHandler);

module.exports = app;