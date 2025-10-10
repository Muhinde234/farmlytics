const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');
const User = require('./models/User');
const analyticsService = require('./utils/analyticsService');
const logger = require('./config/winston');



connectDB();


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


const startServer = async () => {
    try {
        await analyticsService.init(); 
        

        const PORT = config.port;

        app.listen(PORT, () => {
            logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
            seedAdmin(); 
        });
    } catch (error) {
        logger.error(`CRITICAL SERVER ERROR: Failed to initialize services or start server: ${error.message}`, { stack: error.stack });
        process.exit(1); 
    }
};

startServer();


process.on('unhandledRejection', (err, promise) => {
    logger.error(`Unhandled Rejection Error: ${err.message}`, { stack: err.stack });
    
});