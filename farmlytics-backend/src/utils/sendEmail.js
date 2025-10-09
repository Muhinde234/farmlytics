const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../config/winston'); // Import Winston logger

const sendEmail = async (options) => {
    
    const transporter = nodemailer.createTransport({
        host: config.emailHost,
        port: config.emailPort,
        secure: false,
        auth: {
            user: config.emailUser,
            pass: config.emailPass
        },
        tls: {
            rejectUnauthorized: false // Keep for now, as it's the most permissive TLS setting
        },
        // NEW: Enable Nodemailer debugging for verbose output
        logger: true, // Directs Nodemailer's internal logs to our Winston logger
        debug: true   // Enables verbose debug messages from Nodemailer
    });

    const mailOptions = {
        from: `"${config.senderName}" <${config.noReplyEmail}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email sent from "${config.senderName}" via Nodemailer to ${options.email} with subject: "${options.subject}"`);
    } catch (error) {
        logger.error(`Failed to send email via Nodemailer to ${options.email}: ${error.message}`, { subject: options.subject, stack: error.stack });
        throw error; // Re-throw the error for the caller to catch
    }
};

module.exports = sendEmail;
