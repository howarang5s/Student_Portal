const nodemailer = require("nodemailer");

const sendOTPEmail = (email, otp) => {
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
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for password reset is: ${otp}. It is valid for 30 seconds.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('OTP email sent: ' + info.response);
        }
    });
};


module.exports = sendOTPEmail;
