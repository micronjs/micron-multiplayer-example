var express = require('express');
var path = require('path');
var consolidate = require('consolidate');
var http = require('http');

var app = express();

app.engine('nunjucks', consolidate.nunjucks);
app.set('view engine', 'nunjucks');
app.set('views', __dirname + '/views');

app.use('/assets', express.static(__dirname + '/../../assets'));
app.use('/assets/lib', express.static(__dirname + '/../../lib'));
app.use('/assets/js', express.static(__dirname + '/../client'));
app.use('/assets/lib/micronjs', express.static(__dirname + '/../../node_modules/micronjs/build'));


app.get('/', function (req, res) {
    res.render('game');
});

var server = http.createServer(app);

module.exports = {
    getServer: function() {
        return server;
    },

    start: function (port) {
        server.listen(port || 3000);
    }
};
