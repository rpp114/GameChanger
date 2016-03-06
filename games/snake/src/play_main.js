
// head out in global scope for testing purposes

$(document).ready(function() {
  var scale = 1;
  var sizeScale = 0.25;
  var gridSize = 200;
  var gridPositionX = 9;
  var gridPositionY = 9;
  const size = 50;

  $('#board').css({
    'height': gridSize * scale,
    'width': gridSize * scale,
    'top': gridPositionY,
    'left': gridPositionX
  })




  function startGame() {
    head = new Head($('#board'), size * sizeScale * scale);


    var apple = new Apple($('#board'), size * sizeScale * scale, true);

    head.apple = apple;
    head.player = true;
    socket.emit('startController', 'start');
    head.startGame = startGame;
  }


  startGame()


  $('body').on('keydown', function(e) {
    if (e.keyCode === 37) {
      console.log('pressed left');
      head.currentDirection = 'left';
      socket.emit('directionChange', 'left')
    }
    if (e.keyCode === 39) {
      console.log('pressed right');
      head.currentDirection = 'right';
      socket.emit('directionChange', 'right')
    }
    if (e.keyCode === 40) {
      console.log('pressed down');
      head.currentDirection = 'down';
      socket.emit('directionChange', 'down')
    }
    if (e.keyCode === 38) {
      console.log('pressed up');
      head.currentDirection = 'up';
      socket.emit('directionChange', 'up')
    }
  });
});
