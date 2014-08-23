var LawChaosGame = {

    // pixel: { scale: 4, canvas: null, context: null, width: 0, height: 0 }

};

LawChaosGame.Boot = function (game) {
};

LawChaosGame.Boot.prototype = {

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
