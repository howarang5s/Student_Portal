const nodemailer = require("nodemailer");

const sendMail = (email, emailToken) => {
    console.log('Congrats on entering in send mail function');

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: '"Your Company" <your-email@gmail.com>',
        to: email,
        subject: 'Please verify your email...',
        text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email:
           http://localhost:5000/api/verify/${emailToken} 
           Thanks`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendMail;
