var mongoose = require("mongoose")
const schemaNew = require("./snipes.schema.json")
var snipes = mongoose.Schema(schemaNew[0])
module.exports = mongoose.model("Snipes", snipes)
