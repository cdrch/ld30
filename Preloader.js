
LawChaosGame.Preloader = function (game) {

};

LawChaosGame.Preloader.prototype = {

	preload: function () {

		this.load.image('titlepage', 'kof.png');
		this.load.tilemap('map1', 'assets/testmap1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('map2', 'assets/testmap2a.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('map3', 'assets/testmap3.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('test-tiles', 'assets/test-tileset.png');
		this.load.image('player', 'assets/testplayer.png');
		this.load.image('testorb1', 'assets/testorb1.png')
		
		this.load.image('button1','assets/button1.png');

	},

	create: function () {

		this.state.start('MainMenu');

	},

	render: function () {

	},

};
