var nodemailer = require('nodemailer');
const { appURL } = require('../config')
const dotenv = require('dotenv');
dotenv.config();

const sendEMail = async (email,code,userId) =>{
    try{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: {
                name:'Polstart',
                address: process.env.EMAIL_ADDRESS
            },
            to: email,
            subject: "Reset Polstart Password",
            html: `Here is the code to reset your password: <a href="`+appURL+'/reset/'+userId+'/' + code+'">Reset</a>',
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