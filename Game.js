
LawChaosGame.Game = function (game) {

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

var map;
var tileset;
var layer;
var layer2;
var cursors;

LawChaosGame.Game.prototype = {

	create: function () {

		this.physics.startSystem(Phaser.Physics.ARCADE);

    this.stage.backgroundColor = '#000000';

    map = this.add.tilemap('map3');

    map.addTilesetImage('test-tileset', 'test-tiles');

    map.setCollisionBetween(3, 4);
    map.setCollision(1);
    
    layer2 = map.createLayer('Tile Layer 2');
    
    layer = map.createLayer('Tile Layer 1');
    
    // map.collisionLayer = layer;

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    this.setupPlayer();

    this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

    // cursors = this.input.keyboard.createCursorKeys();
		
		//  Here we create our coins group
    this.orbs = this.add.group();
    this.orbs.enableBody = true;

    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    // map.createFromObjects('Object Layer 1', 7, 'testorb1', 0, true, false, this.orbs);

	},

	update: function () {
	  this.physics.arcade.collide(this.player, layer);

    // if (cursors.up.isDown)
    // {
    //     if (this.player.body.onFloor())
    //     {
    //         this.player.body.velocity.y = -200;
    //     }
    // }

    // if (cursors.left.isDown)
    // {
    //     this.player.body.velocity.x = -150;
    // }
    // else if (cursors.right.isDown)
    // {
    //     this.player.body.velocity.x = 150;
    // }
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
	
	// CREATE FUNCTIONS
	
	setupPlayer: function() {
	  
	  // Define movement constants
    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 1500; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 1000; // pixels/second/second
    this.JUMP_SPEED = -350; // pixels/second (negative y is up)
    
	  this.player = this.add.sprite(64, 64, 'player');

    this.physics.enable(this.player);

    this.physics.arcade.gravity.y = this.GRAVITY;

    // this.player.body.bounce.y = 0.2;
    // this.player.body.linearDamping = 1;
    this.player.body.collideWorldBounds = true;
    
    // Set player minimum and maximum movement speed
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.player.body.drag.setTo(this.DRAG, 0); // x, y
    
    // Set a flag for tracking if we've double jumped
    this.canDoubleJump = true;

    // Set a flag for tracking if the player can adjust their jump height
    this.canVariableJump = true;
    
    
	},
	
	// UPDATE FUNCTIONS
	
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
	
	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
