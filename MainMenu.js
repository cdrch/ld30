
LawChaosGame.MainMenu = function (game) {
};

LawChaosGame.MainMenu.prototype = {

	create: function () {

		this.add.sprite(0, 0, 'titlepage');

	},

	update: function () {

		//	Do some nice funky main menu effect here
		if (this.input.keyboard.isDown(Phaser.Keyboard.X))
		{
			this.startGame();
		}
		if (this.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			this.add.sprite(0, 0, 'player');
		}

	},

	render: function () {

	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};
