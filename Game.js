
BalanceGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    

};

BalanceGame.Game.prototype = {

	create: function () {

		this.physics.startSystem(Phaser.Physics.ARCADE);

    this.stage.backgroundColor = '#000000';

    this.map = this.add.tilemap(BalanceGame.gameInfo.levels[BalanceGame.gameInfo.currentLevel]);

    this.map.addTilesetImage('test-tileset', 'test-tiles');
    
    this.setupBackgroundLayers();
    
    this.setupCollisionLayer();

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    this.layerC.resizeWorld();
    
    this.doors = this.add.group();
    this.doors.enableBody = true;
    this.doors.setAll('anchor.x', 0);
    this.doors.setAll('anchor.y', 1);
    
    this.map.createFromObjects('Object Layer 1', 33, 'door1', 0, true, false, this.doors);
		
		//  Here we create our coins group
    this.orbs = this.add.group();
    this.orbs.enableBody = true;
    
    this.map.createFromObjects('Object Layer 1', 7, 'testorb1', 0, true, false, this.orbs);
    
    this.setupPlayer();
    
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    
    this.setupForegroundLayers();
    
    this.clouds = this.add.group();
    this.clouds.enableBody = true;
    this.clouds.physicsBodyType = Phaser.Physics.ARCADE;
    
    this.clouds.createMultiple(50, 'cloud1');
    this.clouds.setAll('anchor.x', 0.5);
    this.clouds.setAll('anchor.y', 0.5);
    this.clouds.setAll('outOfBoundsKill', true);
    this.clouds.setAll('checkWorldBounds', true);
    
    // This triggers the clouds
    // this.time.events.repeat(Phaser.Timer.SECOND * 3, 10, this.addCloud, this);
    
    this.setupMagic();
    
    this.drawGUI();
    
    
	},

	update: function () {
	  this.game.physics.arcade.collide(this.player, this.layerC);
	  this.game.physics.arcade.collide(this.orbs, this.layerC);
	  this.game.physics.arcade.collide(this.doors, this.layerC);
	  this.game.physics.arcade.overlap(this.player, this.orbs, this.collectOrb, null, this);
	  this.game.physics.arcade.overlap(this.player, this.doors, this.finishLevel, null, this);
	 //this.game.physics.arcade.collide(this.player, this.doors);
    
    this.movePlayer();
    
    if (BalanceGame.playerInfo.health === 0)
    {
      this.finishLevel(0);;
    }
    
    if (this.input.keyboard.isDown(Phaser.Keyboard.L))
		{
			this.finishLevel(1);
		}
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.K))
		{
		// 	this.gui.x -= 10000;
		}
		
		if (this.input.keyboard.isDown((Phaser.Keyboard.A)))
		{
		  if (BalanceGame.playerInfo.health > 0)
		  {
		    BalanceGame.playerInfo.health -= 1;
		  }
		}
		
		if (this.game.input.activePointer.justPressed(20))
		{
		  this.summonLightning();
		}
		
		this.updateGUI();
		
		if(this.input.keyboard.isDown((Phaser.Keyboard.P)))
    {
        this.game.paused = true;
        // console.log('Paused');
    }
	},
	
	pauseUpdate: function () {
	  // this is a seperate update the ticks when game.paused = true
    // call an input to unpause in phaser here
    if(this.input.keyboard.isDown((Phaser.Keyboard.U)))
    {
        this.game.paused = false;
        // console.log('Unpaused');
    }

	},
	
	// CREATE FUNCTIONS
	
	setupPlayer: function() {
	  
	  // Define movement constants
    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 1500; // pixels/second/second
    this.DRAG = 1000; // pixels/second
    this.GRAVITY = 1000; // pixels/second/second
    this.JUMP_SPEED = -350; // pixels/second (remember negative y is up)
    
	  this.player = this.add.sprite(64, 64, 'player');

    this.physics.enable(this.player);

    this.physics.arcade.gravity.y = this.GRAVITY;

    // this.player.body.bounce.y = 0.2;
    // this.player.body.linearDamping = 1;
    this.player.body.collideWorldBounds = true;
    
    // Set player minimum and maximum movement speed to increase control and lower collision errors
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.player.body.drag.setTo(this.DRAG, 0); // x, y
    
    this.canDoubleJump = true;
    this.canVariableJump = true;
	},
	
	setupBackgroundLayers: function () {
	  this.layerB2 = this.map.createLayer('Background2');
    this.layerB1 = this.map.createLayer('Background1');
	},
	
	setupCollisionLayer: function () {
	  this.layerC = this.map.createLayer('Collision');
    this.map.setCollisionBetween(3, 4, true, this.layerC);
    this.map.setCollision(1, true, this.layerC);
    this.map.setCollision(9, true, this.layerC);
	},
	
	setupForegroundLayers: function () {
	  this.layerF1 = this.map.createLayer('Foreground1');
    this.layerF2 = this.map.createLayer('Foreground2');
	},
	
	// UPDATE FUNCTIONS
	
	movePlayer: function () {
	  if (this.leftInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.player.body.acceleration.x = -this.ACCELERATION;
    } else if (this.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.acceleration.x = this.ACCELERATION;
    } else {
        this.player.body.acceleration.x = 0;
    }
    
    // Set a variable that is true when the player is touching the ground
    // var onTheGround = this.player.body.touching.down;
    var onTheGround = this.player.body.onFloor();
    if (onTheGround) { this.canDoubleJump = true; }

    if (this.upInputIsActive(5)) {
        // Allow the player to adjust his jump height by holding the jump button
        if (this.canDoubleJump) { this.canVariableJump = true; }

        if (this.canDoubleJump || onTheGround) {
            // Jump when the player is touching the ground or they can double jump
            this.player.body.velocity.y = this.JUMP_SPEED;

            // Disable ability to double jump if the player is jumping in the air
            if (!onTheGround) { this.canDoubleJump = false; }
        }
    }

    // Keep y velocity constant while the jump button is held for up to 150 ms
    if (this.canVariableJump && this.upInputIsActive(150)) {
        this.player.body.velocity.y = this.JUMP_SPEED;
    }

    // Don't allow variable jump height after the jump button is released
    if (!this.upInputIsActive()) {
        this.canVariableJump = false;
    }
	},
	
	collectOrb: function (player, orb) {
	  BalanceGame.playerInfo.maxWood++;
	  BalanceGame.playerInfo.wood++;
	 // this.woodOrb.scale.setTo(0.5,0.5);
	  orb.destroy();
	},
	
	// GUI FUNCTIONS
	
	drawGUI: function() {
	  this.gui = this.add.group();
	  this.guiBackOrbs = this.add.group();
	  for (var i = 0; i < 5; i++)
	  {
	    var b = this.add.sprite(((i + 1) * 256) - 128, 585, 'guiCircle00');
	   // b.anchor.x = 0.5;
	   // b.anchor.y = 0.5;
	    this.guiBackOrbs.add(b);
	  }
	  
	  this.guiOrbs = this.add.group();
	 
	  // TODO: simplify these numbers
	  this.woodOrb = this.add.sprite(((0 + 1) * 256) - 128, 585, 'guiCircleWood');
	  this.fireOrb = this.add.sprite(((1 + 1) * 256) - 128, 585, 'guiCircleFire');
	  this.earthOrb = this.add.sprite(((2 + 1) * 256) - 128, 585, 'guiCircleEarth');
	  this.metalOrb = this.add.sprite(((3 + 1) * 256) - 128, 585, 'guiCircleMetal');
	  this.waterOrb = this.add.sprite(((4 + 1) * 256) - 128, 585, 'guiCircleWater');
	  
	  this.guiOrbs.add(this.woodOrb);
	  this.guiOrbs.add(this.fireOrb);
	  this.guiOrbs.add(this.earthOrb);
	  this.guiOrbs.add(this.metalOrb);
	  this.guiOrbs.add(this.waterOrb);
	  
	  this.healthBar = this.add.sprite(640, 16, 'healthBar');
	  this.healthBar.anchor.setTo(0.5, 0.5);
	  
	  this.gui.add(this.healthBar);
	  this.gui.add(this.guiBackOrbs);
	  this.gui.add(this.guiOrbs);
	  
	  this.guiBackOrbs.setAll('anchor.x', 0.5);
	  this.guiBackOrbs.setAll('anchor.y', 0.5);
	  this.guiOrbs.setAll('anchor.x', 0.5);
	  this.guiOrbs.setAll('anchor.y', 0.5);
	  this.gui.fixedToCamera = true;
	  
	  var style = { font: "65px Arial", fill: "#000000", align: "center" };
	  
    this.woodOrb.text = this.add.text(this.woodOrb.x, this.woodOrb.y, "", style);
    this.woodOrb.text.anchor.set(0.5);
    this.woodOrb.text.fixedToCamera = true;
    
    this.fireOrb.text = this.add.text(this.fireOrb.x, this.fireOrb.y, "", style);
    this.fireOrb.text.anchor.set(0.5);
    this.fireOrb.text.fixedToCamera = true;
    
    this.earthOrb.text = this.add.text(this.earthOrb.x, this.earthOrb.y, "", style);
    this.earthOrb.text.anchor.set(0.5);
    this.earthOrb.text.fixedToCamera = true;
    
    this.metalOrb.text = this.add.text(this.metalOrb.x, this.metalOrb.y, "", style);
    this.metalOrb.text.anchor.set(0.5);
    this.metalOrb.text.fixedToCamera = true;
    
    this.waterOrb.text = this.add.text(this.waterOrb.x, this.waterOrb.y, "", style);
    this.waterOrb.text.anchor.set(0.5);
    this.waterOrb.text.fixedToCamera = true;
	  
	  
	 // this.graphics = this.add.graphics(0, 0);
    
  //   // health
  //   this.graphics.beginFill(0x00FF00);
  //   this.graphics.lineStyle(1, 0x000000, 1);
  //   this.graphics.drawRect(32, 16, 1216, 20);
    
    
  //   this.graphics.fixedToCamera = true;
	},
	
	updateGUI: function () {
	  // wood gui update
	  if (BalanceGame.playerInfo.maxWood <= 0)
	  {
	    this.woodOrb.scale.setTo(0, 0);
	  } else {
	    this.woodOrb.scale.setTo(
	    BalanceGame.playerInfo.wood/BalanceGame.playerInfo.maxWood, 
	    BalanceGame.playerInfo.wood/BalanceGame.playerInfo.maxWood
	    );
	    if (BalanceGame.playerInfo.currentWoodSpell === 1)
	    {
	      this.woodOrb.text.text = 'I';
	    }
	    else if (BalanceGame.playerInfo.currentWoodSpell === 2)
	    {
	      this.woodOrb.text.text = 'II';
	    }
	    else if (BalanceGame.playerInfo.currentWoodSpell === 3)
	    {
	      this.woodOrb.text.text = 'III';
	    }
	    else if (BalanceGame.playerInfo.currentWoodSpell === 4)
	    {
	      this.woodOrb.text.text = 'IV';
	    }
	    else if (BalanceGame.playerInfo.currentWoodSpell === 5)
	    {
	      this.woodOrb.text.text = 'V';
	    }
	  }
		
		// fire gui update
	  if (BalanceGame.playerInfo.maxfire <= 0)
	  {
	    this.fireOrb.scale.setTo(0, 0);
	  } else {
	    this.fireOrb.scale.setTo(
	    BalanceGame.playerInfo.fire/BalanceGame.playerInfo.maxFire, 
	    BalanceGame.playerInfo.fire/BalanceGame.playerInfo.maxFire
	    );
	    if (BalanceGame.playerInfo.currentFireSpell === 1)
	    {
	      this.fireOrb.text.text = 'I';
	    }
	    else if (BalanceGame.playerInfo.currentFireSpell === 2)
	    {
	      this.fireOrb.text.text = 'II';
	    }
	    else if (BalanceGame.playerInfo.currentFireSpell === 3)
	    {
	      this.fireOrb.text.text = 'III';
	    }
	    else if (BalanceGame.playerInfo.currentFireSpell === 4)
	    {
	      this.fireOrb.text.text = 'IV';
	    }
	    else if (BalanceGame.playerInfo.currentFireSpell === 5)
	    {
	      this.fireOrb.text.text = 'V';
	    }
	  }
		
		// earth gui update
	  if (BalanceGame.playerInfo.maxearth <= 0)
	  {
	    this.earthOrb.scale.setTo(0, 0);
	  } else {
	    this.earthOrb.scale.setTo(
	    BalanceGame.playerInfo.earth/BalanceGame.playerInfo.maxEarth, 
	    BalanceGame.playerInfo.earth/BalanceGame.playerInfo.maxEarth
	    );
	    if (BalanceGame.playerInfo.currentEarthSpell === 1)
	    {
	      this.earthOrb.text.text = 'I';
	    }
	    else if (BalanceGame.playerInfo.currentEarthSpell === 2)
	    {
	      this.earthOrb.text.text = 'II';
	    }
	    else if (BalanceGame.playerInfo.currentEarthSpell === 3)
	    {
	      this.earthOrb.text.text = 'III';
	    }
	    else if (BalanceGame.playerInfo.currentEarthSpell === 4)
	    {
	      this.earthOrb.text.text = 'IV';
	    }
	    else if (BalanceGame.playerInfo.currentEarthSpell === 5)
	    {
	      this.earthOrb.text.text = 'V';
	    }
	  }
		
		// metal gui update
	  if (BalanceGame.playerInfo.maxmetal <= 0)
	  {
	    this.metalOrb.scale.setTo(0, 0);
	  } else {
	    this.metalOrb.scale.setTo(
	    BalanceGame.playerInfo.metal/BalanceGame.playerInfo.maxMetal, 
	    BalanceGame.playerInfo.metal/BalanceGame.playerInfo.maxMetal
	    );
	    if (BalanceGame.playerInfo.currentMetalSpell === 1)
	    {
	      this.metalOrb.text.text = 'I';
	    }
	    else if (BalanceGame.playerInfo.currentMetalSpell === 2)
	    {
	      this.metalOrb.text.text = 'II';
	    }
	    else if (BalanceGame.playerInfo.currentMetalSpell === 3)
	    {
	      this.metalOrb.text.text = 'III';
	    }
	    else if (BalanceGame.playerInfo.currentMetalSpell === 4)
	    {
	      this.metalOrb.text.text = 'IV';
	    }
	    else if (BalanceGame.playerInfo.currentMetalSpell === 5)
	    {
	      this.metalOrb.text.text = 'V';
	    }
	  }
		
		// water gui update
	  if (BalanceGame.playerInfo.maxwater <= 0)
	  {
	    this.waterOrb.scale.setTo(0, 0);
	  } else {
	    this.waterOrb.scale.setTo(
	    BalanceGame.playerInfo.water/BalanceGame.playerInfo.maxEater, 
	    BalanceGame.playerInfo.water/BalanceGame.playerInfo.maxEater
	    );
	    if (BalanceGame.playerInfo.currentWaterSpell === 1)
	    {
	      this.waterOrb.text.text = 'I';
	    }
	    else if (BalanceGame.playerInfo.currentWaterSpell === 2)
	    {
	      this.waterOrb.text.text = 'II';
	    }
	    else if (BalanceGame.playerInfo.currentWaterSpell === 3)
	    {
	      this.waterOrb.text.text = 'III';
	    }
	    else if (BalanceGame.playerInfo.currentWaterSpell === 4)
	    {
	      this.waterOrb.text.text = 'IV';
	    }
	    else if (BalanceGame.playerInfo.currentWaterSpell === 5)
	    {
	      this.waterOrb.text.text = 'V';
	    }
	  }
	  
	  this.healthBar.scale.setTo(
	    BalanceGame.playerInfo.health/BalanceGame.playerInfo.maxHealth, 1);
	    
	  
	},
	
	// CONTROL FUNCTIONS
	leftInputIsActive: function () {
	  var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    // isActive |= (this.game.input.activePointer.isDown &&
    //     this.game.input.activePointer.x < this.game.width/4);

    return isActive;
	},
	
	rightInputIsActive: function () {
	  var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    // isActive |= (this.game.input.activePointer.isDown &&
    //     this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
	},
	
	upInputIsActive: function (duration) {
	  var isActive = false;

    isActive = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration);
    // isActive |= (this.game.input.activePointer.justPressed(duration + 1000/60) &&
    //     this.game.input.activePointer.x > this.game.width/4 &&
    //     this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

    return isActive;
	},
	
	downInputIsActive: function () {
	  var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.DOWN);
    // isActive |= (this.game.input.activePointer.isDown &&
    //     this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
	},
	
	selectInputIsActive: function () {
	  var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.SPACE);
    // isActive |= (this.game.input.activePointer.isDown &&
    //     this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
	},
	
	pauseInputIsActive: function () {
	  var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.P);
    // isActive |= (this.game.input.activePointer.isDown &&
    //     this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
	},
	
	unpauseInputIsActive: function () {
	  var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.U);
    // isActive |= (this.game.input.activePointer.isDown &&
    //     this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
	},
	
	// MAGIC FUNCTIONS
	
	setupMagic: function () {
	 // // Lightning
	  
  //   this.explosionGroup = this.game.add.group();

  //   // Create a bitmap for the lightning bolt texture
  //   this.lightningBitmap = this.game.add.bitmapData(200, 1000);

  //   // Create a sprite to hold the lightning bolt texture
  //   this.lightning = this.game.add.image(this.game.width/2, 80, this.lightningBitmap);

  //   // Browser must support WebGL
  //   this.lightning.filters = [ this.game.add.filter('Glow') ];
  //   this.lightning.anchor.setTo(0.5, 0);

  //   // Create a white rectangle that we'll use to represent the flash
  //   this.flash = this.game.add.graphics(0, 0);
  //   this.flash.beginFill(0xffffff, 1);
  //   this.flash.drawRect(0, 0, this.game.width, this.game.height);
  //   this.flash.endFill();
  //   this.flash.alpha = 0;
	},
	
	summonLightning: function () {
	 // // Rotate the lightning sprite so it goes in the
  //       // direction of the pointer
  //       this.lightning.rotation =
  //           this.game.math.angleBetween(
  //               this.lightning.x, this.lightning.y,
  //               this.game.input.activePointer.x, this.game.input.activePointer.y
  //           ) - Math.PI/2;

  //       // Calculate the distance from the lightning source to the pointer
  //       var distance = this.game.math.distance(
  //               this.lightning.x, this.lightning.y,
  //               this.game.input.activePointer.x, this.game.input.activePointer.y
  //           );

  //       // Create the lightning texture
  //       this.createLightningTexture(this.lightningBitmap.width/2, 0, 20, 3, false, distance);

  //       // Make the lightning sprite visible
  //       this.lightning.alpha = 1;

  //       // Fade out the lightning sprite using a tween on the alpha property.
  //       // Check out the "Easing function" examples for more info.
  //       this.game.add.tween(this.lightning)
  //           .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
  //           .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
  //           .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
  //           .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
  //           .to({ alpha: 0 }, 250, Phaser.Easing.Cubic.In)
  //           .start();

  //       // Create the flash
  //       this.flash.alpha = 1;
  //       this.game.add.tween(this.flash)
  //           .to({ alpha: 0 }, 100, Phaser.Easing.Cubic.In)
  //           .start();

  //       // Shake the camera by moving it up and down 5 times really fast
  //       this.game.camera.y = 0;
  //       this.game.add.tween(this.game.camera)
  //           .to({ y: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
  //           .start();
  //   }
	},
	
	// WEATHER FUNCTIONS
	
	addCloud: function () {
	  if (this.clouds.countDead() === 0)
	  {
	    return;
	  }
	  
	  var cloud = this.clouds.getFirstExists(false);
	  
	  cloud.reset(this.world.width+200, Math.random() * 100);
	  
	  
	  cloud.body.allowGravity = false;
	  cloud.body.velocity.x = -25;
	},
	
	// LEVEL SWITCHING FUNCTIONS
	
	finishLevel: function (door) {
	  BalanceGame.gameInfo.currentLevel++;
	  this.state.start('LevelManager', this, door);
	},
	
	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
