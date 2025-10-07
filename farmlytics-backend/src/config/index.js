require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    noReplyEmail: process.env.NOREPLY_EMAIL,
    senderName: process.env.SENDER_NAME,
    baseFrontendUrl: process.env.BASE_FRONTEND_URL,
    notificationServiceApiKey: process.env.NOTIFICATION_SERVICE_API_KEY 
};