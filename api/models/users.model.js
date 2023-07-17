var mongoose = require('mongoose');

var users = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String },
    resetCode: { type: String },
    lastLogin: { type: Date },
    magicLink: { type: String },
    role: { type: String, default: 'user' }
}, { timestamps: true })

module.exports = mongoose.model('Users', users);