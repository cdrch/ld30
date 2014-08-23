
BasicGame.MainMenu = function (game) {
};

BasicGame.MainMenu.prototype = {

	create: function () {

		this.add.sprite(0, 0, 'titlepage');

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	render: function () {

		//  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
	    BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);

	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};
