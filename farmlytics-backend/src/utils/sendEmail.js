const nodemailer = require('nodemailer');
const config = require('../config');

const sendEmail = async (options) => {
    // 1. Create a transporter using your email service's SMTP details
    const transporter = nodemailer.createTransport({
        host: config.emailHost,
        port: config.emailPort,
        secure: config.emailPort == 465, // true for 465, false for other ports
        auth: {
            user: config.emailUser,
            pass: config.emailPass
        },
        tls: {
            rejectUnauthorized: false // This can be helpful for local development with self-signed certs
        }
    });

    // 2. Define email options
    const mailOptions = {
        // Use the configured sender name and no-reply email
        from: `"${config.senderName}" <${config.noReplyEmail}>`, // Sender address like "Farmlytics <no-reply@farmlytics.com>"
        to: options.email, // List of receivers
        subject: options.subject, // Subject line
        html: options.html // HTML body
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    console.log(`Email sent from "${config.senderName}" to ${options.email} with subject: "${options.subject}"`);
};

module.exports = sendEmail;