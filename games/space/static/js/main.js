var GAME_WIDTH = 1000;
var GAME_HEIGHT = 700;

//Game Variables
var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
var socket = io(qs);
var ship;
var tween1, tween2;
var lasers;
var aliens;
var mouseTouchDown = false;

// Create a Phaser game instance
var game = new Phaser.Game(
	GAME_WIDTH,
	GAME_HEIGHT,
	Phaser.AUTO,
	'container',
	{ preload: preload, create: create, update: update, init: init, render: render }
);
// game.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

// Preload assets
function preload() {
	game.canvas.id = 'canvas';
	var dir = '/games/Phaser-Groups/static/img/assets/';
	game.load.image('ship', dir + 'playerShip1_red.png');
	game.load.image('laser', dir + 'laserBlue02.png');
	game.load.image('ufo', dir + 'ufo.png', 32, 32);
}

// Init
function init() {
	// Listen to space & enter keys
	var keys = [Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.ENTER];
	// Create Phaser.Key objects for listening to the state
	phaserKeys = game.input.keyboard.addKeys(keys);
	// Capture these keys to stop the browser from receiving this event
	game.input.keyboard.addKeyCapture(keys);
}

// Assets are available in create
function create() {

	// Create the group using the group factory
	lasers = game.add.group();
	// To move the sprites later on, we have to enable the body
	lasers.enableBody = true;
	// We're going to set the body type to the ARCADE physics, since we don't need any advanced physics
	lasers.physicsBodyType = Phaser.Physics.ARCADE;
	/*

		This will create 20 sprites and add it to the stage. They're inactive and invisible, but they're there for later use.
		We only have 20 laser bullets available, and will 'clean' and reset they're off the screen.
		This way we save on precious resources by not constantly adding & removing new sprites to the stage

	*/
	lasers.createMultiple(20, 'laser');

	aliens = game.add.group();
	aliens.enableBody = true;
	aliens.physicsBodyType = Phaser.Physics.ARCADE;
	// aliens.createMultiple(20, 'alien');
	for(var i = 0; i < 8; i ++) {
		for(var j = 0; j < 5; j++) {
			if(j % 2 === 0) {
				var alien = aliens.create(i * 48, j * 50, 'ufo');
        alien.anchor.setTo(0.5, 0.5);
        // alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
        // alien.play('fly');
        alien.body.moves = false;
				alien.width = 50;
				alien.height = 50;
				tween1 = game.add.tween(alien).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
			} else {
				var alien = aliens.create((i * 48) + 15, (j * 50), 'ufo');
        alien.anchor.setTo(0.5, 0.5);
        // alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
        // alien.play('fly');
        alien.body.moves = false;
				alien.width = 50;
				alien.height = 50;
				tween2 = game.add.tween(alien).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
			}
		}
	}
	aliens.x = 450;
	aliens.y = 100;
	console.log(aliens);
	// var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween1.onLoop.add(function () {aliens.y -= 10;},this);
    tween2.onLoop.add(function () {aliens.y += 10;},this);

	/*
		Create a ship using the sprite factory
		game.add is an instance of Phaser.GameObjectFactory, and helps us to quickly create common game objects.
		The sprite is already added to the stage
	*/
	ship = game.add.sprite(500, 650, 'ship');
	game.physics.enable(ship, Phaser.Physics.ARCADE);
	// Set the anchorpoint to the middle
	ship.anchor.setTo(0.5, 0.5);

	/*

		Behind the scenes, this will call the following function on all lasers:
			- events.onOutOfBounds.add(resetLaser)
		Every sprite has an 'events' property, where you can add callbacks to specific events.
		Instead of looping over every sprite in the group manually, this function will do it for us.

	*/
	lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetLaser);
	// Same as above, set the anchor of every sprite to 0.5, 1.0
	lasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);

	// This will set 'checkWorldBounds' to true on all sprites in the group
	lasers.setAll('checkWorldBounds', true);
	cursors = game.input.keyboard.createCursorKeys();
}

function resetLaser(laser) {
	laser.kill();
}

// Update
function update() {

	ship.body.velocity.setTo(0, 0);

	if (cursors.left.isDown && ship.body.right-100 >= game.world.bounds.left) {
			ship.body.velocity.x = -200
	}
	else if (cursors.right.isDown && ship.body.right < game.world.bounds.right)
	{
			ship.body.velocity.x = 200;
	}
	// Loop over the keys
	for (var index in phaserKeys) {
		// Save a reference to the current key
		var key = phaserKeys[index];
		// If the key was just pressed, fire a laser
		if (key.justDown) {
			fireLaser();
		}
	}

	// Game.input.activePointer is either the first finger touched, or the mouse
	if (game.input.activePointer.isDown) {
		// We'll manually keep track if the pointer wasn't already down
		if (!mouseTouchDown) {
			touchDown();
		}
	} else {
		if (mouseTouchDown) {
			touchUp();
		}
	}

}

function touchDown() {
	// Set touchDown to true, so we only trigger this once
	mouseTouchDown = true;
	fireLaser();
}

function touchUp() {
	// Set touchDown to false, so we can trigger touchDown on the next click
	mouseTouchDown = false;
}

function fireLaser() {
	// Get the first laser that's inactive, by passing 'false' as a parameter
	var laser = lasers.getFirstExists(false);
	if (laser) {
		// If we have a laser, set it to the starting position
		laser.reset(ship.x, ship.y - 20);
		// Give it a velocity of -500 so it starts shooting
		laser.body.velocity.y = -500;
	}

}
function drawPic() {
  var board = document.getElementById('canvas');
	var ctx = board.getContext('webgl', {preserveDrawingBuffer: true});
	// console.log(board.getContext, board.getContext('webgl'));
// 	ctx.fillStyle = "rgb(200,0,0)";
// ctx.fillRect(40,60,20,20);

	var obj = board.toDataURL("image/png");

	// window.open(obj)
	// console.log(obj)
  socket.emit('image', obj);

}


setInterval(drawPic, 250); //need to figure out a better way to screen cast

// Render some debug text on screen
function render() {
	game.debug.text('CodeCaptain Shooting Demo', 10, 30);
	game.debug.text('Click or press space / enter to shoot', 10, 55);
}
