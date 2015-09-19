var Loader = State.extend({
    draw : function()
    {
        this.callParent();

        Graphics.drawFullScreenRect(0, 0, 0, 1.0);

        Graphics.drawText('Connecting to the server...', 150, 250, 1, 1, 1, 1, 24, 'Arial');
    }
});

var FetchingGames = State.extend({
    draw : function()
    {
        this.callParent();

        Graphics.drawFullScreenRect(0, 0, 0, 1.0);

        Graphics.drawText('Fetching game list...', 150, 250, 1, 1, 1, 1, 24, 'Arial');
    }
});

var GameList = State.extend({
    list : null,
    bgr : null,
    button : null,
    constructor : function(list)
    {
        this.callParent();

        this.list = list || [];
        this.bgr = { r: 0.2, g: 0.2, b: 0.5 };

        var fadeFrom = { r: 0, g: 0, b: 0, a: 1 };
        var fadeTo = { r: 0, g: 0, b: 0, a: 0 };

        Camera.fade(fadeFrom, fadeTo, 1);

        this.button = new Button('/assets/img/empty.jpg', 500, 350, this.onNewGameClick.bind(this));
        this.button.text = new Label('New game');
    },

    onNewGameClick: function () {
        console.log('CLICK');
    },

    updateList: function (list) {
        this.list = list;
    },

    draw : function()
    {
        this.callParent();

        Graphics.drawFullScreenRect(this.bgr.r, this.bgr.g, this.bgr.b, 1.0);
        this.drawGameList();

        this.button.draw();
    },

    drawGameList: function () {
        Graphics.drawText('List of games:', 50, 50, 1, 1, 1, 1, 24, 'Arial');

        var name;
        for (var i = 0; i < this.list.length; i++) {
            name = this.list[i].name;

            Graphics.drawText(name, 80, 50 + (i + 1) * 30, 1, 1, 1, 1, 24, 'Arial');
        }
    }
});

Core.init(640, 480);
Core.setState(new Loader());
Core.addAsset([	'empty', '/assets/img/empty.jpg' ]);
Core.loadAndRun();

var primus = Primus.connect();
var gamesLoaded;

primus.on('open', function (spark) {
    Core.setState(new FetchingGames());

    gamesLoaded = false;

    primus.write({
        type: 'getListOfGames'
    });
});

primus.on('data', function (message) {
   if (message.type === 'games') {
       if (!gamesLoaded) {
           gamesLoaded = true;

           Core.setState(new GameList(message.payload));
       } else if (Core.currentState instanceof GameList){
           Core.currentState.updateList(message.payload);
       }
   }
});
