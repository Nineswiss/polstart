var mongoose = require('mongoose');

var users = mongoose.Schema({
    email : {type:String , required:true},
    password: {type:String , required: true},
    resetCode: {type:String }
},{timestamps: true })

module.exports = mongoose.model('users', users);