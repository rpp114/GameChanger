$(document).ready(function() {
  var scale = 1;
  var sizeScale = .25;
  var gridSize = 500;
  var gridPositionX = 20;
  var gridPositionY = 20;
  const size = 50;


  function startGame() {
    $('#board').css({
      'height': gridSize * scale,
      'width': gridSize * scale,
      'top': gridPositionY,
      'left': gridPositionX
    });

    //allows for dynamic scaling and grid size on start of new game
    $('#gameBoard').width(gridSize * scale + 10);
    $('#gameBoard').height(gridSize * scale + 10);
    head = new Head($('#board'), size * sizeScale * scale);
    var apple = new Apple($('#board'), size * sizeScale * scale);
    head.apple = apple;
    head.startGame = startGame;
  }

  startGame();

  $('body').on('keydown', function(e) {
    if (e.keyCode === 37) {
      console.log('pressed left');
      head.currentDirection = 'left';
    }
    if (e.keyCode === 39) {
      console.log('pressed right');
      head.currentDirection = 'right';
    }
    if (e.keyCode === 40) {
      console.log('pressed down');
      head.currentDirection = 'down';
    }
    if (e.keyCode === 38) {
      console.log('pressed up');
      head.currentDirection = 'up';
    }
  });

  // draws pic and emits it
  function drawPic() {
    console.log('drawing pic');
    domtoimage.toPng($('#gameBoard').get(0))
      .then(function(dataUrl) {
        socket.emit('image', dataUrl);
        console.log('sent URL');
      })
      .catch(function(error) {
        console.error('oops, something went wrong!', error);
      });
  }

  setInterval(drawPic, 300);

});
