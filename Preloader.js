
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
		this.load.tilemap('skymap6', 'assets/skymap6.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('skymap7', 'assets/skymap7.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('skymap8', 'assets/skymap8.json', null, Phaser.Tilemap.TILED_JSON);
		
		this.load.audio('creepySong', ['assets/creepy-reverb.mp3']);
		this.load.audio('skyLoop1', ['assets/Guitar1.mp3','assets/Guitar1.ogg']);
		
		this.load.image('testEnemy', 'assets/test-enemy.png');
		this.load.image('cloudX10', 'assets/cloudX20.png');
		
		this.load.image('blackScreen', 'assets/blackScreen.png');
		
		this.load.spritesheet('enemy1', 'assets/enemy1a.png', 48, 48);

	},

	create: function () {

		this.state.start('MainMenu');

	},
	
	fadeIn: function (time) {
    var blackScreen = this.add.sprite(0,0,'blackScreen');
	  blackScreen.fixedToCamera = true;
    blackScreen.alpha = 1;
    this.add.tween(blackScreen).to( { alpha: 0 }, time, Phaser.Easing.Linear.None, true, 0, 0, false);
	},
	
	fadeOut: function (time) {
    var blackScreen = this.add.sprite(0,0,'blackScreen');
	  blackScreen.fixedToCamera = true;
    blackScreen.alpha = 0;
    this.add.tween(blackScreen).to( { alpha: 1 }, time, Phaser.Easing.Linear.None, true, 0, 0, false);
	},

	render: function () {

	}

};
