// var variables = require('./')
var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
console.log(qs)
var socket = io(qs);

var that;
socket.on('changeVariable', function(e) {

  that.SPEED = e;
  console.log("speed changed to: ", e);
})
function Head($el) {
  this.node = $('<div id="head"></div>');
  this.currentDirection = 'right';
  that = this;
  this.SPEED = localStorage.getItem('speed') || 250;

  $el.append(this.node);
  this.x = 0;
  this.y = 0;
  this.next = null;
  this.tail = this;
  this.render()

  setTimeout(this.move.bind(this), this.SPEED);

}
//
// socket.on('changeVariable', function(e) {
//
//   that.SPEED = e;
//   console.log("speed changed to: ", e);
// })

Head.prototype.move = function() {
  console.log('speed: ', this.SPEED);
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

    setTimeout(this.move.bind(this), this.SPEED);
  } else {
    this.die()
  }
}

Head.prototype.checkBody = function() {
  var head_x = this.x;
  var head_y = this.y;

  for (var node = this.next; node; node = node.next) {
    if (head_x === node.x && head_y === node.y)
      this.die();
  }
}

Head.prototype.die = function() {
  localStorage.setItem('speed', this.SPEED);
  location.reload();

}

Head.prototype.checkBorder = function() {
  if (this.x > 13 || this.x < 0 || this.y > 13 || this.y < 0) {
    return false
  } else {
    return true
  }

}

Head.prototype.addBody = function() {
  var bodyPart = new Body($('#board'), this.x, this.y);
  this.tail.next = bodyPart;
  this.tail = this.tail.next;
}

Head.prototype.checkApple = function() {
  if (this.apple.x === this.x && this.apple.y === this.y) {
    this.apple.eat();
    this.apple = new Apple($('#board'));
    this.addBody();
  }
}

Head.prototype.moveBody = function(x, y) {
  var temp_x, temp_y;
  for (var node = this.next; node; node = node.next) {
    temp_x = node.x;
    temp_y = node.y;
    node.x = x;
    node.y = y;
    x = temp_x;
    y = temp_y;
    node.render()
  }
}


Head.prototype.render = function() {
  this.node.offset({
    top: (50 * this.y) + 9,
    left: (50 * this.x) + 9
  })
}


Head.prototype.moveHead = function(direction) {

  // console.log(this.x, this.y);
  if (direction === 'right') {
    this.x++;
  }
  if (direction === 'left') {
    this.x--;
  }
  if (direction === 'up') {
    this.y--;
  }
  if (direction === 'down') {
    this.y++;
  }
}
