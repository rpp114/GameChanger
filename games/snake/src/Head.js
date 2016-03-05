// var variables = require('./')
var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
console.log(qs)
var socket = io(qs);

var that;
socket.on('changeVariable', function(e) {

  that.SPEED = e;
  console.log("speed changed to: ", e);
});

function Head($el, size) {
  this.node = $('<div id="head"></div>');
  this.node.css({'width': 50 * size, 'height': 50 * size});
  this.currentDirection = 'right';
  that = this;
  this.SPEED = localStorage.getItem('speed') || 200;

  $el.append(this.node);
  this.x = 0;
  this.y = 0;
  this.next = null;
  this.tail = this;
  this.render();

  setTimeout(this.realMove.bind(this), this.SPEED);

}

Head.prototype.realMove = function() {
  return this.move(0.50);
};
//
// socket.on('changeVariable', function(e) {
//
//   that.SPEED = e;
//   console.log("speed changed to: ", e);
// })


//change
Head.prototype.move = function(size) {
  console.log('speed: ', this.SPEED);
  var direction = this.currentDirection;
  var position = this.position;
  var x = this.x;
  var y = this.y;
  this.moveBody(x, y, size);
  this.moveHead(direction, size);
  if (this.checkBorder(size)) {
    this.checkBody(size);

    this.checkApple(size);
    this.render();

    setTimeout(this.realMove.bind(this), this.SPEED);
  } else {
    this.die();
  }
};

Head.prototype.checkBody = function() {
  var head_x = this.x;
  var head_y = this.y;

  for (var node = this.next; node; node = node.next) {
    if (head_x === node.x && head_y === node.y)
      this.die();
  }
};

Head.prototype.die = function() {
  localStorage.setItem('speed', this.SPEED);
  location.reload();

};


Head.prototype.checkBorder = function(size) {

  if (this.x > 10 - size || this.x < 0 || this.y > 10 - size || this.y < 0) {
    return false;
  } else {
    return true;
  }

};

Head.prototype.addBody = function(size) {
  var bodyPart = new Body($('#board'), this.x, this.y, size);
  this.tail.next = bodyPart;
  this.tail = this.tail.next;
};

Head.prototype.checkApple = function(size) {
  if (this.apple.x === this.x && this.apple.y === this.y) {
    this.apple.eat();
    this.apple = new Apple($('#board'), size);
    this.addBody(size);
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


//change
Head.prototype.render = function() {
  this.node.offset({
    top: (50 * this.y) + 9,
    left: (50 * this.x) + 9
  });
};


Head.prototype.moveHead = function(direction, size) {

  // console.log(this.x, this.y);
  if (direction === 'right') {
    this.x += size;
  }
  if (direction === 'left') {
    this.x -= size;
  }
  if (direction === 'up') {
    this.y -= size;
  }
  if (direction === 'down') {
    this.y += size;
  }
};
