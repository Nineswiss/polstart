const bodyParser = require("body-parser")
const prettier = require('prettier');
const express = require('express')
const cors = require("cors");
var fs = require('fs');
const app = express()
const serverPort = 8081

var corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3030"]
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.listen(serverPort, () => {
    console.log("Listening to port " + serverPort);
});

app.get('/schemas', (req, res) => {
    let schemas = []
    fs.readdirSync(__dirname + '/../../api/models').forEach(function (file) {
        let found = file.search('.schema')
        if (found === -1) { return }
        const data = fs.readFileSync(__dirname + '/../../api/models/' + file, 'utf8')
        schemas.push({
            'name': file.replace('.schema.json', ''),
            schema: JSON.parse(data)
        })
    });
    res.send(schemas)

})

app.post('/schema', async (req, res) => {
    let name = req.body.data.name
    let schema = req.body.data.schema
    let model = `
   var mongoose = require('mongoose');
   const schemaNew = require('./${name}.schema.json')
   var ${name} = mongoose.Schema
   (
       schemaNew[0]
   )
   module.exports = mongoose.model('${name.charAt(0).toUpperCase() + name.slice(1)}', ${name});`

    model = await prettier.format(model, { semi: false, parser: "babel" });
    schema = await prettier.format(JSON.stringify(schema), { semi: false, parser: "json" });
    
    fs.writeFileSync(__dirname + '/../../api/models/' + name + '.schema.json', schema);
    fs.writeFileSync(__dirname + '/../../api/models/' + name + '.model.js', model);
    res.send('done')

})