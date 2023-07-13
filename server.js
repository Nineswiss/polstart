const bodyParser = require("body-parser")
const express = require('express')

const serverPort=8080
const app = express()
app.use(bodyParser.json());
require('./routes')(app);

app.listen(serverPort, () => {
    console.log("listening to port " + serverPort);
});