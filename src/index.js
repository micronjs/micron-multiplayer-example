var app = require('./server');
var initPrimus = require('./primus.init');
var GameServer = require('./gameserver');

exports.startServer = function (port) {
    port = port || 3000;

    var primus = initPrimus(app.getServer());

    var gameServer = new GameServer(primus);
    gameServer.initialize();

    console.log('Listening on ', port);
    app.start(port);
};
