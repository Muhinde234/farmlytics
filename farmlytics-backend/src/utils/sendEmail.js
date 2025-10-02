const nodemailer = require('nodemailer');
const config = require('../config');

const sendEmail = async (options) => {
    
    const transporter = nodemailer.createTransport({
        host: config.emailHost,
        port: config.emailPort,
        secure: config.emailPort == 465, 
        auth: {
            user: config.emailUser,
            pass: config.emailPass
        },
        tls: {
            rejectUnauthorized: false 
        }
    });


    const mailOptions = {
        
        from: `"${config.senderName}" <${config.noReplyEmail}>`, 
        to: options.email, 
        subject: options.subject, 
        html: options.html 
    };


    await transporter.sendMail(mailOptions);

    console.log(`Email sent from "${config.senderName}" to ${options.email} with subject: "${options.subject}"`);
};

module.exports = sendEmail;