var fs = require('fs');
var path = require('path');
var Primus = require('primus');

module.exports =  function init(server) {
    const primus = new Primus(server);

    fs.writeFile(path.join(__dirname, '..', 'lib', 'primus.generated.js'), primus.library());

    return primus;
};
