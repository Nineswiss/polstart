var fs = require('fs');
module.exports = function (app) {
    fs.readdirSync(__dirname).forEach(function (file) {
        let found = file.search('.route')
        if (found === -1) { return }
        require('./' + file)(app);
    });
}