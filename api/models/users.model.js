var mongoose = require('mongoose');
const schemaNew = require('./users.schema.json')

var users = mongoose.Schema
(
    schemaNew[0]
)

module.exports = mongoose.model('Users', users);