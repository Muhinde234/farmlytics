const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');
const User = require('./models/User');
const analyticsService = require('./utils/analyticsService');
const logger = require('./config/winston');
// REMOVED: const { emailQueue } = require('./config/queue');
// REMOVED: const emailWorker = require('./workers/emailWorker');

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
            logger.info('Admin user seeded successfully.');
        } else {
            logger.info('Admin user already exists.');
        }
    } catch (error) {
        logger.error(`Error seeding admin user: ${error.message}`);
    }
};

// Start the server and initialize services
const startServer = async () => {
    try {
        await analyticsService.init(); // Initialize analytics services first
        // await connectRedis();       // Skipping Redis caching for now
        // REMOVED: emailWorker; // No worker to start if feature is skipped

        const PORT = config.port;

        app.listen(PORT, () => {
            logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
            seedAdmin(); // Seed admin after server starts
        });
    } catch (error) {
        logger.error(`CRITICAL SERVER ERROR: Failed to initialize services or start server: ${error.message}`, { stack: error.stack });
        process.exit(1); // Exit process with failure
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Unhandled Rejection Error: ${err.message}`, { stack: err.stack });
    // server.close(() => process.exit(1)); 
});