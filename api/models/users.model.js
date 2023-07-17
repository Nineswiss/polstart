var mongoose = require('mongoose');

var users = mongoose.Schema({
    email: { type: String, required: true , index: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String },
    authType:{type: String, default:'email'},
    resetCode: { type: String },
    lastLogin: { type: Date },
    magicLink: { type: String },
    role: { type: String, default: 'user' }
}, { timestamps: true })

module.exports = mongoose.model('Users', users);