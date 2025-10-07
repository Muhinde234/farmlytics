const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');
const User = require('./models/User');
const analyticsService = require('./utils/analyticsService');
const logger = require('./config/winston'); // NEW: Import Winston logger

// Connect to database
connectDB();

// Function to seed admin user
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: config.adminEmail });
        if (!adminExists) {
            await User.create({
                name: 'Farmlytics Admin',
                email: config.adminEmail,
                password: config.adminPassword,
                role: 'admin'
            });
            logger.info('Admin user seeded successfully.'); // Use logger
        } else {
            logger.info('Admin user already exists.'); // Use logger
        }
    } catch (error) {
        logger.error(`Error seeding admin user: ${error.message}`); // Use logger
    }
};

// Start the server and initialize analytics services
const startServer = async () => {
    try {
        await analyticsService.init(); // Initialize analytics services first

        const PORT = config.port;

        app.listen(PORT, () => {
            logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`); // Use logger
            seedAdmin(); // Seed admin after server starts
        });
    } catch (error) {
        logger.error(`CRITICAL SERVER ERROR: Failed to initialize analytics services or start server: ${error.message}`); // Use logger
        process.exit(1); // Exit process with failure
    }
};

startServer(); // Call the async function to start the server

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Unhandled Rejection Error: ${err.message}`, { stack: err.stack }); // Use logger, include stack
    // Close server & exit process
    // server.close(() => process.exit(1)); // Uncomment if you want to gracefully shut down the server
});