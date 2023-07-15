const bodyParser = require("body-parser")
const express = require('express')
const mongoose = require("mongoose");
const { db, databaseName } = require('./config')

const serverPort=8080
const app = express()
app.use(bodyParser.json());
require('./routes')(app);

var uri = db+'/'+databaseName;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
});

app.listen(serverPort, () => {
    console.log("listening to port " + serverPort);
});