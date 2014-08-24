
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
		this.load.image('guiCircleWood', 'assets/guiCircleWood.png');
		this.load.image('guiCircleFire', 'assets/guiCircleFire.png');
		this.load.image('guiCircleEarth', 'assets/guiCircleEarth.png');
		this.load.image('guiCircleMetal', 'assets/guiCircleMetal.png');
		this.load.image('guiCircleWater', 'assets/guiCircleWater.png');
		this.load.image('healthBar', 'assets/healthBar.png');
		

	},

	create: function () {

		this.state.start('MainMenu');

	},

	render: function () {

	}

};
