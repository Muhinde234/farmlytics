// utils/sendEmail.js
const sgMail = require('@sendgrid/mail');
const config = require('../config'); 


sgMail.setApiKey(config.sendGridApiKey);


const sendEmail = async (options) => {
   
    const msg = {
        to: options.email,
        from: {
            email: config.noReplyEmail, 
            name: config.senderName    
        },
        subject: options.subject,
        html: options.html,
        
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent from "${config.senderName}" to ${options.email} with subject: "${options.subject}" using SendGrid.`);
    } catch (error) {
        console.error('Error sending email with SendGrid:', error);

        if (error.response && error.response.body && error.response.body.errors) {
            console.error('SendGrid API Errors:', error.response.body.errors);
        } else if (error.response) {
            console.error('SendGrid API Response:', error.response.body);
        }

        
        throw new Error('Failed to send email via SendGrid.');
    }
};

module.exports = sendEmail;