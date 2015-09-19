var debug = require('debug')('micronexample:gameserver');
var app = require('./server');
var initPrimus = require('./primus.init');


function GameServer(primus) {
    this.primus = primus;
    this.games = [];

    this.createGame('Ala');
    this.createGame('ma kota');
}

GameServer.prototype.initialize = function () {
    var scope = this;

    this.primus.on('connection', function (spark) {
        debug('CONNECTION');

        spark.on('data', function (message) {
            debug('Incoming message:' + message.type);

            if (message.type === 'getListOfGames') {
                spark.write({
                    type: 'games',
                    payload: scope.games
                })
            }
        });
    });

    this.primus.on('disconnection', function (spark) {
        debug('DISCONNECTION');
    });
};

GameServer.prototype.createGame = function (name) {
    this.games.push({ name: name });
};

exports.startServer = function (port) {
    port = port || 3000;

    var primus = initPrimus(app.getServer());

    var gameServer = new GameServer(primus);
    gameServer.initialize();

    console.log('Listening on ', port);
    app.start(port);
};
