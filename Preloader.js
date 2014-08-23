
LawChaosGame.Preloader = function (game) {

};

LawChaosGame.Preloader.prototype = {

	preload: function () {

		this.load.image('titlepage', 'kof.png');
		this.load.tilemap('map1', 'assets/testmap1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('test-tiles', 'assets/test-tileset.png');
		this.load.image('player', 'assets/testplayer.png');

	},

	create: function () {

		this.state.start('MainMenu');

	},

	render: function () {

	},

};
