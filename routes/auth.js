const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuid_v4 } = require('uuid');
const { secret } = require('../config')
const {resetEmail,verifyEmail,magicEmail} = require("../middleware/mailer")
var Users = require("../models/users.model");

module.exports = (app) => {


    app.post('/signup', async (req, res) => {
        let user = await Users.exists({
            email: req.body.email
        })
        if(user){return res.status(400).send({ message: "User Exists" })}

        let verfiyCode = uuid_v4()

        const newUser = await Users.create({
            email:req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            verificationCode: verfiyCode
        })
        if(!newUser){
            res.status(500).send({ error: 'Something went wrong' })
        }
        await verifyEmail(req.body.email,verfiyCode,newUser._id)
        res.status(200).send({message:'User Created'})
    });



    app.post('/signin', async  (req, res)=> {
        const user = await Users.findOne({
            email: req.body.email
        })
        if (!user) {return res.status(401).send({ message: "Invalid credentials" })}
        
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {return res.status(401).send({error: "Invalid credentials"});}
        if(!user.verified){
            return res.status(401).send({ message: "Not Verfified" })
        }

        await Users.findOneAndUpdate({_id:user._id},{
            lastLogin:Date.now()
        })
        var token = jwt.sign({ id: user._id}, secret,{});
        res.status(200).send({ token: token, userId: user._id })
    });

    app.post('/magic-link', async  (req, res)=> {
        const linkCode = uuid_v4()
        const user = await Users.findOneAndUpdate({email:req.body.email},{
            magicLink:linkCode
        })
        await magicEmail(req.body.email,linkCode,user._id)
        res.status(200).send({ message:"Link Sent!" })
    });


    app.post('/magic-signin/:id/:code', async  (req, res)=> {
        const user = await Users.findOne({
            _id: req.params.id,
            magicLink:req.params.code
        })
        if (!user) {return res.status(401).send({ message: "Invalid credentials" })}

        if(!user.verified){
            return res.status(401).send({ message: "Not Verfified" })
        }

        await Users.findOneAndUpdate({_id:user._id},{
            lastLogin:Date.now(),
            magicLink:''
        })
        var token = jwt.sign({ id: user._id}, secret,{});
        res.status(200).send({ token: token, userId: user._id })
    });




    app.get('/verfiy/:id/:code', async (req, res) =>{
        let user = await Users.findOneAndUpdate({
            _id: req.params.id,
            verificationCode: req.params.code
        },
        {
            verified: true,
            verificationCode:''
        }
        )
        if(user){
            res.send({message:'Verfied!'})
        }else{
            return res.status(401).send({ message: "Invalid credentials" })
        }
    })


    
    app.post('/sendVerification', async (req, res) => {

        let user = await Users.findOne({
            email: req.body.email
        },'_id, verificationCode')
        if(!user){return res.status(404).send({ message: "User not found" })}
        if(!user.verificationCode){
           return  res.status(200).send({message:'User already verified'})
        }
        await verifyEmail(req.body.email,user.verificationCode,user._id)
        res.status(200).send({message:'Email sent'})
    });



    app.post('/reset', async (req, res, next) =>{

        let newResetCode = uuid_v4()
        const user = await Users.findOneAndUpdate(
            { email: req.body.email },
            {
                resetCode: newResetCode
            }
            );
        if (!user) {return res.status(401).send({ message: "Invalid credentials" })}
     
        await resetEmail(user.email,newResetCode,user._id)
        res.status(200).send({ message: "Check your email"})

    });



    app.get('/reset/:id/:code', async (req, res, next) =>{
        const user = await Users.findOne({ _id: req.params.id });
        if (!user) {return res.status(400).send({ message: "Invalid link" })}
        if(user.resetCode===req.params.code){
            res.status(200).send({ message: "Code matches! You can reset.", code: user.resetCode})
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
            }
            );
        if (!user) {return res.status(401).send({ message: "Invalid credentials" })}
        res.status(200).send({ message: "Updated" })
    });

    

}