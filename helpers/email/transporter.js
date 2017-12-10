var nodemailer = require('nodemailer');

if(process.env.NODE_ENV != "production"){
    var smtpConfig = {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        ignoreTLS: true,
        secure: false
    };
}else{
    var smtpConfig = {
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
