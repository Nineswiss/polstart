const {verifyToken} = require("../middleware/authJwt")
var Users = require("../models/users.model");

module.exports = (app) => {

  //GET ALL USERS
  app.get('/users',[verifyToken], async function (req, res) {
    if(req.role!=='admin'){
      return res.status(401).send({message:" Unauthorized"})
    }
    let users = await Users.find({}
      ,'email')
    if(!users){res.status(500).send({error:'No users'})}
    res.status(200).send(users)
  });

  //GET LOGGED IN USER
  app.get('/user',[verifyToken], async function (req, res) {
    if(!req.userId){
      return res.status(401).send({message:" Unauthorized"})
    }
    let user = await Users.findById(req.userId,'email _id')
    if(!user){return res.status(500).send({error:'User not found'})}
    res.status(200).send(user)
  });

  //UPDATE LOGGED IN USER
  app.put('/user',[verifyToken], function (req, res) {
    if(!req.userId){
      return res.status(401).send({message:" Unauthorized"})
    }
    res.send("Trying to update? Your ID: " + req.userId)
  });

  // DELETE USER
  app.delete('/user',[verifyToken], function (req, res) {
    if(!req.userId){
      return res.status(401).send({message:" Unauthorized"})
    }
    res.send("Trying to delete user:  " + req.userId)
  });


}