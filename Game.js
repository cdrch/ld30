
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
    this.mapisSky = false;
    
    if (BalanceGame.gameInfo.levels[BalanceGame.gameInfo.currentLevel] === 'skymap1' ||
      BalanceGame.gameInfo.levels[BalanceGame.gameInfo.currentLevel] === 'skymap2')
    {
      this.mapisSky = true;
    }
    
    if (true === false)
    {
      
    }
    else if (BalanceGame.gameInfo.levels[BalanceGame.gameInfo.currentLevel] == 'skymap3')
    {
      this.map.addTilesetImage('sky-tiles', 'sky-tiles');
    }
    else if (BalanceGame.gameInfo.levels[BalanceGame.gameInfo.currentLevel] == 'skymap5')
    {
      this.map.addTilesetImage('clouds', 'clouds');
    }
    else if (this.mapisSky === false)
    {
      this.map.addTilesetImage('test-tileset', 'test-tiles');
    }
    else
    {
      this.map.addTilesetImage('sky-tiles', 'sky-tiles');
    }

    
    
    if (this.mapisSky === false)
    {
      this.setupBackgroundLayers();
    }
    
    this.setupCollisionLayer();

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    this.layerC.resizeWorld();
    
    this.doors = this.add.group();
    this.doors.enableBody = true;
    this.doors.setAll('anchor.x', 0);
    this.doors.setAll('anchor.y', 1);
    this.doors.setAll('body.allowGravity', false);
    
    if (this.mapisSky === false)
    {
      this.map.createFromObjects('Object Layer 1', 33, 'door1', 0, true, false, this.doors);
    }
    
		//  Here we create our coins group
    this.orbs = this.add.group();
    this.orbs.enableBody = true;
    
    if (this.mapisSky === false)
    {
      this.map.createFromObjects('Object Layer 1', 7, 'testorb1', 0, true, false, this.orbs);
    }
    
    this.setupPlayer();
    
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    
    if (this.mapisSky === false)
    {
      this.setupForegroundLayers();
    }
    
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
    
    this.gotLightning = BalanceGame.gameInfo.gotLightning[BalanceGame.gameInfo.currentLevel];
    
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
    this.updateLightning();
    
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
		
		if (this.input.keyboard.isDown((Phaser.Keyboard.Y)))
		{
		  if (BalanceGame.playerInfo.health > 0)
		  {
		    BalanceGame.playerInfo.health -= 1;
		  }
		}
		
		if(this.input.keyboard.isDown((Phaser.Keyboard.ONE)))
    {
        this.player.currentMagic = 0;
        // console.log('Paused');
    } else if(this.input.keyboard.isDown((Phaser.Keyboard.TWO)))
    {
        this.player.currentMagic = 1;
        // console.log('Paused');
    }
    
    if (this.player.currentMagic === 1)
    {
      this.teleport = true;
    } else {
      this.teleport = false;
    }
		
		if (this.gotLightning)
		{
  		if (this.game.input.activePointer.justPressed(20))
  		{
  		  this.summonLightning();
  		}
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
	  this.player.animations.add('stand_right', [1], 6, true);
	  this.player.animations.add('stand_left', [0], 6, true);
	  this.player.animations.add('run_right', [4, 2, 5, 3], 6, true);
	  this.player.animations.add('run_left', [7, 9, 6, 8], 6, true);
	  this.player.animations.add('fall_right', [10], 6, true);
	  this.player.animations.add('fall_left', [11], 6, true);
	  
	  this.player.facing = 'right';
	  this.player.moving = false;
	  this.player.falling = false;
	  
	  this.player.animations.play('stand_right');

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
    
    this.player.currentMagic = 0;
	},
	
	setupBackgroundLayers: function () {
	  this.layerB2 = this.map.createLayer('Background2');
    this.layerB1 = this.map.createLayer('Background1');
	},
	
	setupCollisionLayer: function () {
	  this.layerC = this.map.createLayer('Collision');
	  if (this.mapisSky === false)
	  {
      this.map.setCollisionBetween(3, 4, true, this.layerC);
      this.map.setCollision(1, true, this.layerC);
      this.map.setCollision(9, true, this.layerC);
	  }
	  else
	  {
	    this.map.setCollision(1, true, this.layerC);
	    this.map.setCollision(2, true, this.layerC);
	    this.map.setCollision(19, true, this.layerC);
	    this.map.setCollision(20, true, this.layerC);
	  }
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
        this.player.facing = 'left';
        this.player.moving = true;
    } else if (this.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.acceleration.x = this.ACCELERATION;
        this.player.facing = 'right';
        this.player.moving = true;
    } else {
        this.player.body.acceleration.x = 0;
        this.player.moving = false;
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
    
    if (this.player.body.velocity.y >= 10)
    {
      this.player.falling = true;
    } else {
      this.player.falling = false;
    }
    
    if (this.player.falling === true)
    {
      if (this.player.facing === 'right')
      {
        this.player.animations.play('fall_right');
      } else {
        this.player.animations.play('fall_left');
      }
    } 
    else if (this.player.moving === true) 
    {
      if (this.player.facing === 'right')
      {
        this.player.animations.play('run_right');
      } else {
        this.player.animations.play('run_left');
      }
    }
    else
    {
      if (this.player.facing === 'right')
      {
        this.player.animations.play('stand_right');
      } else {
        this.player.animations.play('stand_left');
      }
    }
	},
	
	collectOrb: function (player, orb) {
	  BalanceGame.playerInfo.storedLightning += 5;
	 // this.woodOrb.scale.setTo(0.5,0.5);
	  orb.destroy();
	},
	
	// GUI FUNCTIONS
	
	drawGUI: function() {
	  this.gui = this.add.group();
	  this.guiBackOrbs = this.add.group();
	 // for (var i = 0; i < 5; i++)
	 // {
	 //   var b = this.add.sprite(((i + 1) * 256) - 128, 585, 'guiCircle00');
	 //  // b.anchor.x = 0.5;
	 //  // b.anchor.y = 0.5;
	 //   this.guiBackOrbs.add(b);
	 // }
	  
	  var b = this.add.sprite(((3) * 256) - 128, 585, 'guiCircle00');
	   // b.anchor.x = 0.5;
	   // b.anchor.y = 0.5;
	  this.guiBackOrbs.add(b);
	  
	  this.guiOrbs = this.add.group();
	 
	  // TODO: simplify these numbers
	 // this.woodOrb = this.add.sprite(((0 + 1) * 256) - 128, 585, 'guiCircleWood');
	 // this.fireOrb = this.add.sprite(((1 + 1) * 256) - 128, 585, 'guiCircleFire');
	  this.lightningOrb = this.add.sprite(((2 + 1) * 256) - 128, 585, 'guiCircleLightning');
	 // this.metalOrb = this.add.sprite(((3 + 1) * 256) - 128, 585, 'guiCircleMetal');
	 // this.waterOrb = this.add.sprite(((4 + 1) * 256) - 128, 585, 'guiCircleWater');
	  
	 // this.guiOrbs.add(this.woodOrb);
	 // this.guiOrbs.add(this.fireOrb);
	  this.guiOrbs.add(this.lightningOrb);
	 // this.guiOrbs.add(this.metalOrb);
	 // this.guiOrbs.add(this.waterOrb);
	  
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
	  
    // this.woodOrb.text = this.add.text(this.woodOrb.x, this.woodOrb.y, "", style);
    // this.woodOrb.text.anchor.set(0.5);
    // this.woodOrb.text.fixedToCamera = true;
    
    // this.fireOrb.text = this.add.text(this.fireOrb.x, this.fireOrb.y, "", style);
    // this.fireOrb.text.anchor.set(0.5);
    // this.fireOrb.text.fixedToCamera = true;
    
    this.lightningOrb.text = this.add.text(this.lightningOrb.x, this.lightningOrb.y, "", style);
    this.lightningOrb.text.anchor.set(0.5, 0.5);
    this.lightningOrb.text.fixedToCamera = true;
    
    // this.metalOrb.text = this.add.text(this.metalOrb.x, this.metalOrb.y, "", style);
    // this.metalOrb.text.anchor.set(0.5);
    // this.metalOrb.text.fixedToCamera = true;
    
    // this.waterOrb.text = this.add.text(this.waterOrb.x, this.waterOrb.y, "", style);
    // this.waterOrb.text.anchor.set(0.5);
    // this.waterOrb.text.fixedToCamera = true;
	  
	  
	 // this.graphics = this.add.graphics(0, 0);
    
  //   // health
  //   this.graphics.beginFill(0x00FF00);
  //   this.graphics.lineStyle(1, 0x000000, 1);
  //   this.graphics.drawRect(32, 16, 1216, 20);
    
    
  //   this.graphics.fixedToCamera = true;
	},
	
	updateGUI: function () {
	  // wood gui update
	 // if (BalanceGame.playerInfo.maxWood <= 0)
	 // {
	 //   this.woodOrb.scale.setTo(0, 0);
	 // } else {
	 //   this.woodOrb.scale.setTo(
	 //   BalanceGame.playerInfo.wood/BalanceGame.playerInfo.maxWood, 
	 //   BalanceGame.playerInfo.wood/BalanceGame.playerInfo.maxWood
	 //   );
	 //   if (BalanceGame.playerInfo.currentWoodSpell === 1)
	 //   {
	 //     this.woodOrb.text.text = 'I';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentWoodSpell === 2)
	 //   {
	 //     this.woodOrb.text.text = 'II';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentWoodSpell === 3)
	 //   {
	 //     this.woodOrb.text.text = 'III';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentWoodSpell === 4)
	 //   {
	 //     this.woodOrb.text.text = 'IV';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentWoodSpell === 5)
	 //   {
	 //     this.woodOrb.text.text = 'V';
	 //   }
	 // }
		
		// // fire gui update
	 // if (BalanceGame.playerInfo.maxfire <= 0)
	 // {
	 //   this.fireOrb.scale.setTo(0, 0);
	 // } else {
	 //   this.fireOrb.scale.setTo(
	 //   BalanceGame.playerInfo.fire/BalanceGame.playerInfo.maxFire, 
	 //   BalanceGame.playerInfo.fire/BalanceGame.playerInfo.maxFire
	 //   );
	 //   if (BalanceGame.playerInfo.currentFireSpell === 1)
	 //   {
	 //     this.fireOrb.text.text = 'I';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentFireSpell === 2)
	 //   {
	 //     this.fireOrb.text.text = 'II';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentFireSpell === 3)
	 //   {
	 //     this.fireOrb.text.text = 'III';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentFireSpell === 4)
	 //   {
	 //     this.fireOrb.text.text = 'IV';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentFireSpell === 5)
	 //   {
	 //     this.fireOrb.text.text = 'V';
	 //   }
	 // }
		
		// lightning gui update
	  if (BalanceGame.playerInfo.maxlightning <= 0)
	  {
	    this.lightningOrb.scale.setTo(0, 0);
	  } else {
	    this.lightningOrb.scale.setTo(
	    BalanceGame.playerInfo.storedLightning/100, 
	    BalanceGame.playerInfo.storedLightning/100
	    );
	    if (this.teleport === true)
	    {
	      this.lightningOrb.text.text = 'II';
	    }
	    else
	    {
	      this.lightningOrb.text.text = 'I';
	    }
	  }
		
		// metal gui update
	 // if (BalanceGame.playerInfo.maxmetal <= 0)
	 // {
	 //   this.metalOrb.scale.setTo(0, 0);
	 // } else {
	 //   this.metalOrb.scale.setTo(
	 //   BalanceGame.playerInfo.metal/BalanceGame.playerInfo.maxMetal, 
	 //   BalanceGame.playerInfo.metal/BalanceGame.playerInfo.maxMetal
	 //   );
	 //   if (BalanceGame.playerInfo.currentMetalSpell === 1)
	 //   {
	 //     this.metalOrb.text.text = 'I';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentMetalSpell === 2)
	 //   {
	 //     this.metalOrb.text.text = 'II';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentMetalSpell === 3)
	 //   {
	 //     this.metalOrb.text.text = 'III';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentMetalSpell === 4)
	 //   {
	 //     this.metalOrb.text.text = 'IV';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentMetalSpell === 5)
	 //   {
	 //     this.metalOrb.text.text = 'V';
	 //   }
	 // }
		
		// water gui update
	 // if (BalanceGame.playerInfo.maxwater <= 0)
	 // {
	 //   this.waterOrb.scale.setTo(0, 0);
	 // } else {
	 //   this.waterOrb.scale.setTo(
	 //   BalanceGame.playerInfo.water/BalanceGame.playerInfo.maxEater, 
	 //   BalanceGame.playerInfo.water/BalanceGame.playerInfo.maxEater
	 //   );
	 //   if (BalanceGame.playerInfo.currentWaterSpell === 1)
	 //   {
	 //     this.waterOrb.text.text = 'I';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentWaterSpell === 2)
	 //   {
	 //     this.waterOrb.text.text = 'II';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentWaterSpell === 3)
	 //   {
	 //     this.waterOrb.text.text = 'III';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentWaterSpell === 4)
	 //   {
	 //     this.waterOrb.text.text = 'IV';
	 //   }
	 //   else if (BalanceGame.playerInfo.currentWaterSpell === 5)
	 //   {
	 //     this.waterOrb.text.text = 'V';
	 //   }
	 // }
	  
	  this.healthBar.scale.setTo(
	    BalanceGame.playerInfo.health/BalanceGame.playerInfo.maxHealth, 1);
	    
	  
	},
	
	// CONTROL FUNCTIONS
	leftInputIsActive: function () {
	  var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.input.keyboard.isDown(Phaser.Keyboard.A);
    // isActive |= (this.game.input.activePointer.isDown &&
    //     this.game.input.activePointer.x < this.game.width/4);

    return isActive;
	},
	
	rightInputIsActive: function () {
	  var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.input.keyboard.isDown(Phaser.Keyboard.D);
    // isActive |= (this.game.input.activePointer.isDown &&
    //     this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
	},
	
	upInputIsActive: function (duration) {
	  var isActive = false;

    isActive = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration) || this.input.keyboard.justPressed(Phaser.Keyboard.W, duration);
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
	  // Lightning
	  
    this.explosionGroup = this.game.add.group();

    // Create a bitmap for the lightning bolt texture
    this.lightningBitmap = this.game.add.bitmapData(200, 1000);

    // Create a sprite to hold the lightning bolt texture
    // this.lightning = this.game.add.image(this.game.width/2, 80, this.lightningBitmap);
    this.lightning = this.game.add.image(this.player.x, this.player.y, this.lightningBitmap);

    // Browser must support WebGL
    this.lightning.filters = [ this.game.add.filter('Glow') ];
    this.lightning.anchor.setTo(0.5, 0);

    // Create a white rectangle that we'll use to represent the flash
    this.flash = this.game.add.graphics(0, 0);
    this.flash.beginFill(0xffffff, 1);
    this.flash.drawRect(0, 0, this.game.width, this.game.height);
    this.flash.endFill();
    this.flash.alpha = 0;
    this.flash.fixedToCamera = true;
    
    this.boltReady = true;
    this.teleport = true;
    this.infinite = false;
	},
	
	updateLightning: function () {
	  if (this.boltReady === true)
	  {
	    this.lightning.x = this.player.x + this.player.width/2;
	    this.lightning.y = this.player.y + this.player.height/2;
	  }
	  else
	  {
	    // do nothing
	  }
	},
	
	resetLightningTimer: function () {
	  this.boltReady = true;
	},
	
	resetGravity: function () {
	  this.player.body.allowGravity = true;
	},
	
	summonLightning: function () {
	  if(this.boltReady === false)
	  {
	    return;
	  }
	  
	  if (this.infinite) {
	    // no energy used!
	  } else if (BalanceGame.playerInfo.storedLightning < 10) {
	    // out of power
	    return;
	  } else {
	    // uses up 10 power, so 10 shots total
	    BalanceGame.playerInfo.storedLightning -= 10;
	  }
	  
	 // this.nextBoltAt = this.time.now + this.shotDelay;
	  
	  this.time.events.add(3000, this.resetLightningTimer, this);
	  // Rotate the lightning sprite so it goes in the
    // direction of the pointer
    this.lightning.rotation =
        this.game.math.angleBetween(
            this.lightning.x, this.lightning.y,
            this.game.input.activePointer.x, this.game.input.activePointer.y
        ) - Math.PI/2;

    // Calculate the distance from the lightning source to the pointer
    var distance = this.game.math.distance(
            this.lightning.x, this.lightning.y,
            this.game.input.activePointer.x, this.game.input.activePointer.y
        );

    // Create the lightning texture
    this.createLightningTexture(this.lightningBitmap.width/2, 0, 20, 3, false, distance);

    // Make the lightning sprite visible
    this.lightning.alpha = 1;

    // Fade out the lightning sprite using a tween on the alpha property.
    // Check out the "Easing function" examples for more info.
    this.game.add.tween(this.lightning)
        .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
        .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
        .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
        .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
        .to({ alpha: 0 }, 250, Phaser.Easing.Cubic.In)
        .start();

    // Create the flash
    this.flash.alpha = 1;
    this.game.add.tween(this.flash)
        .to({ alpha: 0 }, 100, Phaser.Easing.Cubic.In)
        .start();

    // Shake the camera by moving it up and down 5 times really fast
    // this.game.camera.y = 0;
    // this.game.add.tween(this.game.camera)
    //     .to({ y: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
    //     .start();
    
    if(this.teleport === true)
    {
      this.player.body.allowGravity = false;
      this.player.x = this.game.input.activePointer.x;
      this.player.y = this.game.input.activePointer.y;
      // this.player.body.applyForce([
      //   this.game.input.activePointer.x - this.player.x,
      //   this.game.input.activePointer.y - this.player.y
      //   ], this.player.x, this.player.y);
      // this.player.body.velocity.x = (this.game.input.activePointer.x - this.player.x) * 1000;
      // this.player.body.velocity.y = (this.game.input.activePointer.y - this.player.y) * 1000;
      
      this.time.events.add(500, this.resetGravity, this);
    }
    else
    {
      
    }
    
	  this.boltReady = false;
	},
	
	getExplosion: function () {
	  
	},
	
	createLightningTexture: function (x, y, segments, boltWidth, branch, distance) {
	  // Get the canvas drawing context for the lightningBitmap
    var ctx = this.lightningBitmap.context;
    var width = this.lightningBitmap.width;
    var height = this.lightningBitmap.height;

    // Our lightning will be made up of several line segments starting at
    // the center of the top edge of the bitmap and ending at the target.

    // Clear the canvas
    if (!branch) ctx.clearRect(0, 0, width, height);

    // Draw each of the segments
    for(var i = 0; i < segments; i++) {
        // Set the lightning color and bolt width
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.lineWidth = boltWidth;

        ctx.beginPath();
        ctx.moveTo(x, y);

        // Calculate an x offset from the end of the last line segment and
        // keep it within the bounds of the bitmap
        if (branch) {
            // For a branch
            x += this.game.rnd.integerInRange(-10, 10);
        } else {
            // For the main bolt
            x += this.game.rnd.integerInRange(-30, 30);
        }
        if (x <= 10) x = 10;
        if (x >= width-10) x = width-10;

        // Calculate a y offset from the end of the last line segment.
        // When we've reached the target or there are no more segments left,
        // set the y position to the distance to the target. For branches, we
        // don't care if they reach the target so don't set the last coordinate
        // to the target if it's hanging in the air.
        if (branch) {
            // For a branch
            y += this.game.rnd.integerInRange(10, 20);
        } else {
            // For the main bolt
            y += this.game.rnd.integerInRange(20, distance/segments);
        }
        if ((!branch && i == segments - 1) || y > distance) {
            // This causes the bolt to always terminate at the center
            // lightning bolt bounding box at the correct distance to
            // the target. Because of the way the lightning sprite is
            // rotated, this causes this point to be exactly where the
            // player clicked or tapped.
            y = distance;
            if (!branch) x = width/2;
        }

        // Draw the line segment
        ctx.lineTo(x, y);
        ctx.stroke();

        // Quit when we've reached the target
        if (y >= distance) break;

        // Draw a branch 20% of the time off the main bolt only
        if (!branch) {
            if (this.game.math.chanceRoll(20)) {
                // Draws another, thinner, bolt starting from this position
                this.createLightningTexture(x, y, 10, 1, true, distance);
            }
        }
    }

    // This just tells the engine it should update the texture cache
    this.lightningBitmap.dirty = true;
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

Phaser.Filter.Glow = function (game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
        "precision lowp float;",
        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",
        'uniform sampler2D uSampler;',

        'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -4; xx <= 4; xx++) {',
                'for(int yy = -3; yy <= 3; yy++) {',
                    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                    'float factor = 0.0;',
                    'if (dist == 0.0) {',
                        'factor = 2.0;',
                    '} else {',
                        'factor = 2.0/abs(float(dist));',
                    '}',
                    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
                '}',
            '}',
            'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
        '}'
    ];
};

Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;
