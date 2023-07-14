var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

function sendMail(email,code) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Reset Polstart Password",
        text: `Here is the code to reset your password: ` + code,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return
        }
    });
}

module.exports = { sendMail }