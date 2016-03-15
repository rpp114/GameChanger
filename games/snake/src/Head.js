// var variables = require('./')
// var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
// var socket = io(qs);
var socket = io();
var thatHead;

//alows for dynamic changing of speed
socket.on('changeVariable', function(e) {

  console.log(e[0], "changed to: ", e[1]);
  if(e[0] === 'speed')
    thatHead.SPEED = e[1];
});

socket.on('obj', function(e) {
  console.log("obj", e);
});

//head is defaulted to these settings at first start of game
function Head($el, size) {
  this.node = $('<div id="head"></div>');
  thatHead = this;
  this.node.css({
    'height': size,
    'width': size
  });

  this.currentDirection = 'right';
  this.SPEED = localStorage.getItem('speed') || 200;
  $el.append(this.node);
  this.x = 0;
  this.y = 0;
  this.next = null;
  this.tail = this;
  this.size = size;
  this.elGrid = $el.height() / size;
  var elPos = $el.position();
  this.elPosX = elPos.left;
  this.elPosY = elPos.top;
  this.render();
  setTimeout(this.move.bind(this), thatHead.SPEED);

}

Head.prototype.move = function() {
  var direction = this.currentDirection;
  var position = this.position;
  var x = this.x;
  var y = this.y;

  this.moveBody(x, y);
  this.moveHead(direction);

  if (this.checkBorder()) {

    this.checkBody();
    this.checkApple();
    this.render();
    var dist = Math.sqrt(Math.pow((this.x - this.apple.x), 2) + Math.pow((this.y - this.apple.y), 2));
    var chartData = {
      'Distance': dist,
      'Moves': this.counter
    };
    socket.emit('chartData', chartData);
    setTimeout(this.move.bind(this), this.SPEED);

  } else {
    this.die();
  }
};

//checks to see if snake is hitting itself
Head.prototype.checkBody = function() {
  var head_x = this.x;
  var head_y = this.y;

  for (var node = this.next; node; node = node.next) {
    if (head_x === node.x && head_y === node.y) this.die();
  }
};

Head.prototype.die = function() {
  $('#board').empty();
  delete this.node;
  this.startGame();
};

Head.prototype.checkBorder = function() {
  if (this.x > this.elGrid || this.x < 0 || this.y > this.elGrid || this.y < 0) return false;
  else return true;
};

Head.prototype.addBody = function() {
  var bodyPart = new Body($('#board'), this.x, this.y, this.size);
  this.tail.next = bodyPart;
  this.tail = this.tail.next;
};

Head.prototype.checkApple = function() {
  if (this.apple.x === this.x && this.apple.y === this.y) {
    this.apple.eat();
    this.counter = 0;
    this.apple = new Apple($('#board'), this.size);
    this.addBody();
  }
};

Head.prototype.moveBody = function(x, y) {
  var temp_x, temp_y;
  for (var node = this.next; node; node = node.next) {
    temp_x = node.x;
    temp_y = node.y;
    node.x = x;
    node.y = y;
    x = temp_x;
    y = temp_y;
    node.render();
  }
};


Head.prototype.render = function() {
  this.node.offset({
    top: (this.size * this.y) + head.elPosY,
    left: (this.size * this.x) + head.elPosX
  });
};


Head.prototype.moveHead = function(direction) {
  console.log('x: ' + this.x);
  console.log('y: ' + this.y);

  if (direction === 'right') this.x++;
  if (direction === 'left') this.x--;
  if (direction === 'up') this.y--;
  if (direction === 'down') this.y++;
  if (direction === 'still') return;
};
