var primus = Primus.connect();

var Loader = State.extend({
    draw : function()
    {
        this.callParent();

        Graphics.drawFullScreenRect(0, 0, 0, 1.0);

        Graphics.drawText('Connecting to the server...', 150, 250, 1, 1, 1, 1, 24, 'Arial');
    }
});

var Game = State.extend({
    bgr : null,
    player: null,
    position: null,

    constructor : function(list) {
        this.callParent();

        this.player = { x: 20, y: 20 };
        this.positions = [];

        this.bgr = {r: 0.2, g: 0.2, b: 0.5};
    },

    setPlayerPositions: function (players) {
        this.positions = [];

        for (var id in players) {
            this.positions.push(players[id].position);
        }
    },

    update : function(delta)
    {
        this.callParent(delta);

        if (Input.isKeyPressed(Input.KEY_A)) {
            this.player.x -= 1;
        }

        if (Input.isKeyPressed(Input.KEY_D)) {
            this.player.x += 1;
        }

        if (Input.isKeyPressed(Input.KEY_W)) {
            this.player.y -= 1;
        }

        if (Input.isKeyPressed(Input.KEY_S)) {
            this.player.y += 1;
        }

        primus.write({
            type: 'myposition',
            payload: this.player
        });
    },

    draw : function() {
        Graphics.drawFullScreenRect(this.bgr.r, this.bgr.g, this.bgr.b, 1.0);

        var pos;
        for (var i = 0; i < this.positions.length; i++) {
            pos = this.positions[i];
            Graphics.drawRect(pos.x, pos.y, 30, 30, 1, 0, 0, 0.2);
        }

        Graphics.drawRect(this.player.x, this.player.y, 30, 30, 0, 0, 1, 0.7);
        this.callParent();
    }
});



Core.init(640, 480);
Core.setState(new Loader());
Core.addAsset([
    'empty', '/assets/img/empty.jpg',
    'button', '/assets/img/button.png'
]);
Core.loadAndRun();

primus.on('open', function (spark) {
    Core.setState(new Game());
});

primus.on('data', function (message) {
    if (message.type === 'players') {
        if (Core.currentState instanceof Game) {
            Core.currentState.setPlayerPositions(message.payload);
        }
    }
});
