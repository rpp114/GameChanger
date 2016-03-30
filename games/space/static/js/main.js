var GAME_WIDTH = 1000;
var GAME_HEIGHT = 700;

var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
var socket = io(qs);
var ctrlObj = {
	gameName:'space',
	controllers: {
		alienSize: {
			type: 'range',
			min:0.2,
			max:3.0,
			step:0.2,
			value: 1.0
		},
		shipSize: {
			type: 'range',
			min:0.2,
			max:3.0,
			step:0.2,
			value: 1.0
		},
		laserSize: {
			type: 'range',
			min: 0.1,
			max:1.5,
			step: 0.1,
			value: 1.0
		},
		laserSpeed: {
			type: 'range',
			min: 0.1,
			max:5,
			step: 0.25,
			value: 1.0
		},
		alienSpeed: {
			type: 'range',
			min: 0.1,
			max:5,
			step: 0.25,
			value: 1.0
		}
	}
}

socket.emit('obj', ctrlObj);

//Game Variables
var ship;
var tween1, tween2, tween3, tween4, tween5, tweenAll1, tweenAll2, tweenAll3, tweenAll4, tweenAll5;
var lasers;
var aliens1, aliens2, aliens3, aliens4, aliens5;
var mouseTouchDown = false;

// Create a Phaser game instance
var game = new Phaser.Game(
	GAME_WIDTH,
	GAME_HEIGHT,
	Phaser.AUTO,
	'container',
	{ preload: preload, create: create, update: update, init: init, render: render }
);
socket.on('changeVariable', function(e) {
	localStorage.setItem(e[0], e[1]);
})

// Preload assets
function preload() {
	game.canvas.id = 'canvas';
	var dir = '/games/space/static/img/';
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
	lasers.createMultiple(40, 'laser');

	aliens1 = game.add.group();
	aliens1.enableBody = true;
	aliens1.physicsBodyType = Phaser.Physics.ARCADE;
	for(var i = 0; i < 8; i++) {
		var alien = aliens1.create(i*48, 50, 'ufo');
		alien.anchor.setTo(0.5, 0.5);
		alien.body.moves = false;
		alien.width = 40;
		alien.height = 40;
	}
	aliens1.x = 450;
	aliens1.y = 100;
	tween1 = game.add.tween(aliens1).to( { x: 200 }, 2000*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 1, 1000, true);
	tween1.onLoop.add(function () {aliens1.x += 10;},this);
	aliens2 = game.add.group();
	aliens2.enableBody = true;
	aliens2.physicsBodyType = Phaser.Physics.ARCADE;
	for(var i = 0; i < 8; i++) {
		var alien = aliens2.create(i*48, 100, 'ufo');
		alien.anchor.setTo(0.5, 0.5);
		alien.body.moves = false;
		alien.width = 40;
		alien.height = 40;
	}
	aliens2.x = 450;
	aliens2.y = 100;
	tween2 = game.add.tween(aliens2).to( { x: 200 }, 1500*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 0, 2000, true);
	tween2.onLoop.add(function () {aliens2.x += 10;},this);
	aliens3 = game.add.group();
	aliens3.enableBody = true;
	aliens3.physicsBodyType = Phaser.Physics.ARCADE;
	for(var i = 0; i < 8; i++) {
		var alien = aliens3.create(i*48, 150, 'ufo');
		alien.anchor.setTo(0.5, 0.5);
		alien.body.moves = false;
		alien.width = 40;
		alien.height = 40;
	}
	aliens3.x = 450;
	aliens3.y = 100;
	tween3 = game.add.tween(aliens3).to( { x: 200 }, 1800*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 150, 2000, true);
	tween3.onLoop.add(function () {aliens3.x += 10;},this);
	aliens4 = game.add.group();
	aliens4.enableBody = true;
	aliens4.physicsBodyType = Phaser.Physics.ARCADE;
	for(var i = 0; i < 8; i++) {
		var alien = aliens4.create(i*48, 200, 'ufo');
		alien.anchor.setTo(0.5, 0.5);
		alien.body.moves = false;
		alien.width = 40;
		alien.height = 40;
	}
	aliens4.x = 450;
	aliens4.y = 100;
	tween4 = game.add.tween(aliens4).to( { x: 200 }, 1300*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 100, 2000, true);
	tween4.onLoop.add(function () {aliens4.x += 10;},this);
	aliens5 = game.add.group();
	aliens5.enableBody = true;
	aliens5.physicsBodyType = Phaser.Physics.ARCADE;
	for(var i = 0; i < 8; i++) {
		var alien = aliens5.create(i*48, 250, 'ufo');
		alien.anchor.setTo(0.5, 0.5);
		alien.body.moves = false;
		alien.width = 40;
		alien.height = 40;
	}
	aliens5.x = 450;
	aliens5.y = 100;
	tween5 = game.add.tween(aliens5).to( { x: 200 }, 1000*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 50, 2000, true);
	tween5.onLoop.add(function () {aliens5.x += 10;},this);
	tweenAll1 = game.add.tween(aliens1).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false )
	tweenAll2 = game.add.tween(aliens2).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false )
	tweenAll3 = game.add.tween(aliens3).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false )
	tweenAll4 = game.add.tween(aliens4).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false )
	tweenAll5 = game.add.tween(aliens5).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false )
	tweenAll1.onLoop.add(function () {aliens1.y+=10}, this);
	tweenAll2.onLoop.add(function () {aliens2.y+=10}, this);
	tweenAll3.onLoop.add(function () {aliens3.y+=10}, this);
	tweenAll4.onLoop.add(function () {aliens4.y+=10}, this);
	tweenAll5.onLoop.add(function () {aliens5.y+=10}, this);
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
	aliens1.scale.set(localStorage.getItem('alienSize'))
	aliens2.scale.set(localStorage.getItem('alienSize'))
	aliens3.scale.set(localStorage.getItem('alienSize'))
	aliens4.scale.set(localStorage.getItem('alienSize'))
	aliens5.scale.set(localStorage.getItem('alienSize'))

	ship.scale.set(localStorage.getItem('shipSize'))

	tween1.updateTweenData('duration', 2000/localStorage.getItem('alienSpeed'))
	tween2.updateTweenData('duration', 1500/localStorage.getItem('alienSpeed'))
	tween3.updateTweenData('duration', 1800/localStorage.getItem('alienSpeed'))
	tween4.updateTweenData('duration', 1300/localStorage.getItem('alienSpeed'))
	tween5.updateTweenData('duration', 1000/localStorage.getItem('alienSpeed'))

	lasers.scale.set(localStorage.getItem('laserSize'))

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
	game.physics.arcade.collide(lasers, aliens1, killAliens)
	game.physics.arcade.collide(lasers, aliens2, killAliens)
	game.physics.arcade.collide(lasers, aliens3, killAliens)
	game.physics.arcade.collide(lasers, aliens4, killAliens)
	game.physics.arcade.collide(lasers, aliens5, killAliens)
	game.physics.arcade.collide(aliens1, ship, youLose)
	game.physics.arcade.collide(aliens2, ship, youLose)
	game.physics.arcade.collide(aliens3, ship, youLose)
	game.physics.arcade.collide(aliens4, ship, youLose)
	game.physics.arcade.collide(aliens5, ship, youLose)


}
function youLose(alien, ship) {
	alert('you Lose');
	setTimeout(function(){location.reload();}, 1000);
}
function killAliens(laser,alien) {
	laser.kill();
	alien.kill();
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
		laser.reset(ship.x/localStorage.getItem('laserSize'), (ship.y - 20)/localStorage.getItem('laserSize'));
		// Give it a velocity of -500 so it starts shooting
		laser.body.velocity.y = -500/localStorage.getItem('laserSpeed');
	}

}
function drawPic() {
  var board = document.getElementById('canvas');
	var ctx = board.getContext('webgl', {preserveDrawingBuffer: true});

	var obj = board.toDataURL("image/png");
  socket.emit('image', obj);

}


setInterval(drawPic, 250); 
socket.on('changeGame', (e) => {
  console.log('changedGame');
  localStorage.setItem('gameName', e)
  location.reload();
})
// Render some debug text on screen
function render() {
	game.debug.text('CodeCaptain Shooting Demo', 10, 30);
	game.debug.text('Click or press space / enter to shoot', 10, 55);
}
