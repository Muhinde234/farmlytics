const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');
const User = require('./models/User');
const analyticsService = require('./utils/analyticsService'); 


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
            console.log('Admin user seeded successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error.message);
    }
};


const startServer = async () => {
    await analyticsService.init();
    const PORT = config.port;

    app.listen(PORT, () => {
        console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
        seedAdmin(); 
    });
};

startServer(); 

process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
   
});