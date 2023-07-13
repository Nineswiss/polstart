const {verifyToken} = require("../middleware/authJwt")
const {secret, db} = require('../config')
const { MongoClient } = require("mongodb");
const uri = db;
const client = new MongoClient(uri);

module.exports = (app) => {

  //GET ALL USERS
  app.get('/users', function (req, res) {
    res.send("Hello from ALL USERS")
  });

  //GET LOGGED IN USER
  app.get('/user',[verifyToken], function (req, res) {
    res.send("Hello, you are logged in. Your ID: " + req.userId)
  });

  //UPDATE LOGGED IN USER
  app.post('/user',[verifyToken], function (req, res) {
    res.send("Hello, you are logged in! Your ID: " + req.userId)
  });


}