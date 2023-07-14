var nodemailer = require('nodemailer');
const { appName, emailResetURL } = require('../config')
const dotenv = require('dotenv');
dotenv.config();

const sendEMail = async (email,code,userId) =>{
    try{
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: {
                name: appName,
                address: process.env.EMAIL_ADDRESS
            },
            to: email,
            subject: "Reset " + appName+ " Password",
            html: `Here is the code to reset your password: <a href="`+emailResetURL+userId+'/' + code+'">Reset</a>',
        };

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                return
            }
        });
    }catch(error){
        return error
    }
}

module.exports = sendEMail