const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuid_v4 } = require('uuid');
const { secret } = require('../config')
const sendEMail = require("../middleware/mailer")
var Users = require("../models/users.model");

module.exports = (app) => {

    app.post('/signup', async (req, res, next) => {

        let user = await Users.exists({
            email: req.body.email
        })
        if(user){return res.status(400).send({ message: "User Exists" })}
        const newUser = await Users.create({
            email:req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        })
        if(!newUser){
            res.status(500).send({ error: 'Something went wrong' })
        }
        res.status(200).send(newUser)

    });


    app.post('/signin', async  (req, res, next)=> {

        const user = await Users.findOne({
            email: req.body.email
        })
        if (!user) {return res.status(401).send({ message: "Invalid credentials" })}
   
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {return res.status(401).send({error: "Invalid credentials"});}
        var token = jwt.sign({ id: user._id }, secret,{});
        res.status(200).send({ token: token, userId: user._id })

    });

    app.post('/reset', async (req, res, next) =>{

        let newResetCode = uuid_v4()
        const user = await Users.findOneAndUpdate(
            { email: req.body.email },
            {
                resetCode: newResetCode
            },
            { returnOriginal: false}
            );
        if (!user) {return res.status(401).send({ message: "Invalid credentials" })}
        await sendEMail(user.email,newResetCode,user._id)
        res.status(200).send({ message: "Check your email"})

    });

    app.get('/reset/:id/:code', async (req, res, next) =>{

        const user = await Users.findOne({ _id: req.params.id });
        if (!user) {return res.status(400).send({ message: "Invalid link" })}
        if(user.resetCode===req.params.code){
            //send reset code when updating ? or get from URL
            res.status(200).send({ message: "Code matches! You can reset."})
        }else{
            res.status(404).send({ message: "Invalid link"})
        }
    });


    app.post('/updatePassword/', async (req, res, next)=> {
        const user = await Users.findOneAndUpdate(
            { 
                _id: req.body.id, 
                resetCode:req.body.code 
            },
            {
                resetCode: '',
                password: bcrypt.hashSync(req.body.password, 8)
            },
            { returnOriginal: false}
            );
        if (!user) {return res.status(401).send({ message: "Invalid credentials" })}
        res.status(200).send({ message: "Updated" })
    });

}