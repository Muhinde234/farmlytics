require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,

   
    sendGridApiKey: process.env.SENDGRID_API_KEY, 

   
    noReplyEmail: process.env.NOREPLY_EMAIL, 
    senderName: process.env.SENDER_NAME,

    baseFrontendUrl: process.env.BASE_FRONTEND_URL,
    notificationServiceApiKey: process.env.NOTIFICATION_SERVICE_API_KEY
};