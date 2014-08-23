
BasicGame.Preloader = function (game) {

};

BasicGame.Preloader.prototype = {

	preload: function () {

		this.load.image('titlepage', 'kof.png');

	},

	create: function () {

		this.state.start('MainMenu');

	},

	render: function () {

		//  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
	    BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);

	},

};
