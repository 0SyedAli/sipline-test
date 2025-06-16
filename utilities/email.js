const nodemailer = require('nodemailer');

async function sendMail(transportType, retryIfFailed, host, email_from, email, password, sendTo, subject, content)
{
    const mailOptions = {
        from: {
            name: email_from || process.env.GMAIL_FROM,
            address: email || process.env.GMAIL_HOST
        },
        to: sendTo,
        subject: subject,
        html: content
    };
    return new Promise((resolve, reject) => {
        if (transportType === 'gmail')
        {
            const gmailTransporter = nodemailer.createTransport(
                {
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.GMAIL_HOST,
                        pass: process.env.GMAIL_PASSWORD
                    }
                }
            );
            gmailTransporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log('err in sending mail...', err);
                    if (retryIfFailed) {
                        reject('err in sending mail...', err);
                    }
                }else {
                    resolve('sent');
                }
            });
        }else {
            const customTransporter = nodemailer.createTransport(
                {
                    host: host,
                    port: 465,
                    secure: true,
                    auth: {
                        user: email,
                        pass: password
                    },
                    tls: { rejectUnauthorized: true }
                }
            );
            customTransporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log('err in sending mail...', err);
                    if (retryIfFailed) {
                        setTimeout(() => {
                            sendMail(transportType, retryIfFailed, host, email_from, email, password, sendTo, subject, content);
                        }, 1000);
                    }
                }else {
                    console.log('Mail Sent');
                }
            });
        }
    })
}

module.exports = {
    sendMail: async (transportType, retryIfFailed, host, email_from, email, password, sendTo, subject, content) => await sendMail(transportType, retryIfFailed, host, email_from, email, password, sendTo, subject, content)
}