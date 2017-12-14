let nodemailer = require('nodemailer');

let smtpConfig = null;

if(process.env.NODE_ENV !== "production"){
    smtpConfig = {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        ignoreTLS: true,
        secure: false
    };
}else{
    smtpConfig = {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: true,
        auth: {
            user:  process.env.MAILER_USER,
            pass:  process.env.MAILER_PASSWORD
        }
    };
}

module.exports = nodemailer.createTransport(smtpConfig);
