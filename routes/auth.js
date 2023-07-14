const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuid_v4 } = require('uuid');
const { secret, db } = require('../config')
const {sendMail} = require("../middleware/mailer")
const { MongoClient } = require("mongodb");
const uri = db;
const client = new MongoClient(uri);
const databaseName ='polstart'

module.exports = (app) => {

    app.post('/signup', async function (req, res, next) {
        try {
            const database = client.db(databaseName);
            const users = database.collection('users');
            const user = await users.findOne({ email: req.body.email });

            if (user) {
                return res.send({ message: "User Exists" })
            }

            const newUser = await users.insertOne({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8)
            })

            res.send(newUser)

        } catch (error) {
            res.send({ message: error })
        }
    });


    app.post('/signin', async function (req, res, next) {

        try {
            const database = client.db(databaseName);
            const users = database.collection('users');
            const user = await users.findOne({ email: req.body.email });
            
            if (!user) {
                return res.send({ message: "Invalid credentials" })
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(500).send({error: "Invalid credentials"});
            }
            var token = jwt.sign({ id: user._id }, secret,{});

            res.send({ token: token, userId: user._id })

        } catch (error) {
            res.send({ message: error })
        }

    });

    app.post('/reset', async function (req, res, next) {

        try {
            const database = client.db(databaseName);
            const users = database.collection('users');
            const user = await users.findOne({ email: req.body.email });
            
            if (!user) {
                return res.send({ message: "Invalid credentials" })
            }

            let resetCode = uuid_v4()

            const updateDoc ={
                $set: {
                  resetCode: resetCode
                },
            };

            const result = await users.updateOne({_id:user._id}, updateDoc, { upsert: true })

            sendMail(user.email,resetCode)

            res.send({ message: "Check your email"})

        } catch (error) {
            console.log("error");
            console.log(error);
            res.send({ message: error })
        }

    });


}