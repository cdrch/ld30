
BalanceGame.Preloader = function (game) {

};

BalanceGame.Preloader.prototype = {

	preload: function () {

		this.load.image('titlepage', 'kof.png');
		this.load.tilemap('map1', 'assets/testmap1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('map2', 'assets/testmap2a.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('map3', 'assets/testmap3.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('map4', 'assets/testmap4.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('map5', 'assets/testmap5.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('map6', 'assets/testmap6b.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('test-tiles', 'assets/test-tileset2.png');
		this.load.image('testPlayer', 'assets/testplayer.png');
		this.load.spritesheet('player', 'assets/finalchar.png', 44, 38);
		this.load.image('testorb1', 'assets/testorb1.png')
		
		this.load.image('button1','assets/button1.png');
		
		this.load.image('cloud1', 'assets/testcloud1.png');
		this.load.image('cloud2', 'assets/cloudcover1.png');
		
		this.load.image('door1', 'assets/door.png');
		
		this.load.image('guiCircle00', 'assets/guiCircle00.png');
		this.load.image('guiCircleLightning', 'assets/guiCircleLightning.png');
		this.load.image('healthBar', 'assets/healthBar.png');
		
		this.load.image('sky-tiles', 'assets/sky-tiles.png');
		this.load.image('clouds', 'assets/clouds.png');
		this.load.tilemap('skymap1', 'assets/skymap1a.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('skymap2', 'assets/skymap2a.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('skymap3', 'assets/skymap3a.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('skymap5', 'assets/skymap5.json', null, Phaser.Tilemap.TILED_JSON);
		
		this.load.audio('creepySong', ['creepy-reverb.mp3']);
		

	},

	create: function () {

		this.state.start('MainMenu');

	},

	render: function () {

	}

};
