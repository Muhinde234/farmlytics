const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../config/winston'); 

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
            rejectUnauthorized: false
        },
        
        logger: true,
        debug: true   
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
        throw error; 
    }
};

module.exports = sendEmail;
