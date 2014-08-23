var BasicGame = {

    pixel: { scale: 4, canvas: null, context: null, width: 0, height: 0 }

};

BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    init: function () {

        //  Hide the un-scaled game canvas
        this.game.canvas.style['display'] = 'none';
     
        //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
        BasicGame.pixel.canvas = Phaser.Canvas.create(this.game.width * BasicGame.pixel.scale, this.game.height * BasicGame.pixel.scale);
     
        //  Store a reference to the Canvas Context
        BasicGame.pixel.context = BasicGame.pixel.canvas.getContext('2d');
     
        //  Add the scaled canvas to the DOM
        Phaser.Canvas.addToDOM(BasicGame.pixel.canvas);
     
        //  Disable smoothing on the scaled canvas
        Phaser.Canvas.setSmoothingEnabled(BasicGame.pixel.context, false);
     
        //  Cache the width/height to avoid looking it up every render
        BasicGame.pixel.width = BasicGame.pixel.canvas.width;
        BasicGame.pixel.height = BasicGame.pixel.canvas.height;

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
