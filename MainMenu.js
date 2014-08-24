
BalanceGame.MainMenu = function (game) {
};

BalanceGame.MainMenu.prototype = {

	create: function () {

		// this.add.sprite(0, 0, 'titlepage');
		
		this.menuGroup = this.game.add.group();
    this.menuGroup.y = -500; // Keep menuGroup out of view
 
    this.menuImage = this.game.add.sprite(0,0,'titlepage');
    this.menuButton1 = this.game.add.button(100,100,'button1',this.startGame,this,0,0,1);
 
    // add menu components to the group
    this.menuGroup.add(this.menuImage); 
    this.menuGroup.add(this.menuButton1);
 
    this.game.add.button(100, 100, 'button', this.showMenu, this, 1, 0, 1, 0);

	},

	update: function () {

		//	Do some nice funky main menu effect here
		if (this.input.keyboard.isDown(Phaser.Keyboard.X))
		{
			this.startGame();
		}
		if (this.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			this.showMenu();
		}

	},
	
	showMenu : function () {
    // brings menuGroup into view
    this.game.add.tween(this.menuGroup).to({y:0}, 2000, Phaser.Easing.Back.Out, true);
	},

	render: function () {

	},

	startGame: function (pointer) {

		this.state.start('LevelManager');

	}

};
