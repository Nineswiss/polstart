const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { secret, db } = require('../config')
const { MongoClient } = require("mongodb");
const uri = db;
const client = new MongoClient(uri);

module.exports = (app) => {

    app.post('/signup', async function (req, res, next) {
        try {
            const database = client.db('meaner');
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
            const database = client.db('meaner');
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

            var token = jwt.sign({ id: user.id }, secret,{});

            res.send({ token: token, id: user._id })

        } catch (error) {
            res.send({ message: error })
        }

    });
}