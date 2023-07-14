const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuid_v4 } = require('uuid');
const { secret, db, databaseName } = require('../config')
const sendEMail = require("../middleware/mailer")
var validator = require("email-validator");
const { MongoClient,ObjectId } = require("mongodb");
const uri = db;
const client = new MongoClient(uri);

module.exports = (app) => {

    app.post('/signup', async function (req, res, next) {
        if(!validator.validate(req.body.email)){
            return res.status(409).send({ message: "Invalid Email" })
        }
        try {
            const database = client.db(databaseName);
            const users = database.collection('users');
            const user = await users.findOne({ email: req.body.email });

            if (user) {
                return res.status(400).send({ message: "User Exists" })
            }

            const newUser = await users.insertOne({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8)
            })

            res.status(200).send(newUser)

        } catch (error) {
            res.status(500).send({ message: error })
        }
    });


    app.post('/signin', async function (req, res, next) {
        try {
            const database = client.db(databaseName);
            const users = database.collection('users');
            const user = await users.findOne({ email: req.body.email });
            
            if (!user) {
                return res.status(401).send({ message: "Invalid credentials" })
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({error: "Invalid credentials"});
            }
            var token = jwt.sign({ id: user._id }, secret,{});

            res.status(200).send({ token: token, userId: user._id })

        } catch (error) {
            res.status(500).send({ message: error })
        }

    });

    app.post('/reset', async function (req, res, next) {

        try {
            const database = client.db(databaseName);
            const users = database.collection('users');
            const user = await users.findOne({ email: req.body.email });
            
            if (!user) {
                return res.status(401).send({ message: "Invalid credentials" })
            }

            let resetCode = uuid_v4()

            const updateDoc ={
                $set: {
                  resetCode: resetCode
                },
            };

            const result = await users.updateOne({_id:user._id}, updateDoc, { upsert: true })
            await sendEMail(user.email,resetCode,user._id)
            res.status(200).send({ message: "Check your email"})

        } catch (error) {
            res.status(500).send({ message: error })
        }

    });

    app.get('/reset/:id/:code', async function (req, res, next) {
        let code = req.params.code
        let userId = req.params.id
        try {
            const database = client.db(databaseName);
            const users = database.collection('users');
            const user = await users.findOne({ _id: new ObjectId(userId) });
            
            if (!user) {
                return res.status(400).send({ message: "Invalid link" })
            }

            if(user.resetCode===code){
                //send reset code when updating ? or get from URL
                res.status(200).send({ message: "Code matches! You can reset."})
            }else{
                res.status(404).send({ message: "Invalid link"})
            }

        } catch (error) {
            res.status(500).send({ message: error })
        }
    });


    app.post('/updatePassword/', async function (req, res, next) {
        console.log(req.body.id);
        try {
            const database = client.db(databaseName);
            const users = database.collection('users');
            const user = await users.findOne({ _id: new ObjectId(req.body.id), resetCode:req.body.code });

            if (user) {
                const updateDoc ={
                    $set: {
                      resetCode: '',
                      password: bcrypt.hashSync(req.body.password, 8)
                    },
                };
    
                const result = await users.updateOne({_id: new ObjectId(req.body.id)}, updateDoc, { upsert: true })
                res.status(200).send({ message: "Updated" })
            }
            else{
                res.status(409).send({error: "Couldn't update"})
            }
  

        } catch (error) {
            res.status(500).send({ message: error })
        }
    });

}