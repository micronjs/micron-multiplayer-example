var debug = require('debug')('micronexample:gameserver');
var app = require('./server');
var initPrimus = require('./primus.init');


function GameServer(primus) {
    this.primus = primus;
    this.players = {};
}

GameServer.prototype.initialize = function () {
    var scope = this;

    this.primus.on('connection', function (spark) {
        debug('CONNECTION');

        spark.on('data', function (message) {
            var playerId, gameName;

            debug('Incoming message:' + message.type);

            if (message.type === 'myposition') {
                playerId = spark.id;

                scope.updatePosition(playerId, message.payload);
            }

        });
    });

    this.primus.on('disconnection', function (spark) {
        debug('DISCONNECTION');

        var playerId = spark.id;
        scope.disconnect(playerId);
    });
};

GameServer.prototype.updatePosition = function (playerId, position) {
    this.players[playerId] = this.players[playerId] || {};
    this.players[playerId].position = position;

    this.primus.write({
        type: 'players',
        payload: this.players
    });
};

GameServer.prototype.disconnect = function (playerId) {
    delete this.players[playerId];
};

exports.startServer = function (port) {
    port = port || 3000;

    var primus = initPrimus(app.getServer());

    var gameServer = new GameServer(primus);
    gameServer.initialize();

    console.log('Listening on ', port);
    app.start(port);
};
