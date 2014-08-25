var BalanceGame = {

    gameInfo: { levels: ['skymap5', 'map6'], startX: [64, 256], startY: [64, 64], currentLevel: 0, gotLightning: [true, false] },
    playerInfo: { health: 100, maxHealth: 100, storedLightning: 100 }
    // ,
    // originalGameInfo: BalanceGame.gameInfo,
    // originalPlayerInfo: BalanceGame.playerInfo
};

BalanceGame.Boot = function (game) {
};

BalanceGame.Boot.prototype = {

    init: function () {

    },

    create: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        //  So now let's start the real preloader going
        this.state.start('Preloader');

    }

};
