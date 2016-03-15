$(document).ready(function() {

  function startGame() {
    var scale = localStorage.getItem('scale') || 1;
    var sizeScale = localStorage.getItem('sizeScale') || 0.5;
    var gridSize = localStorage.getItem('gridSize') || 500;
    var gridPositionX = 20;
    var gridPositionY = 20;
    const size = 50;
    $('#board').css({
      'height': gridSize * scale,
      'width': gridSize * scale,
      'top': gridPositionY,
      'left': gridPositionX
    });

    //allows for dynamic scaling and grid size on start of new game
    $('#gameBoard').width(gridSize * scale + 40);
    $('#gameBoard').height(gridSize * scale + 40);
    head = new Head($('#board'), size * sizeScale * scale);
    var apple = new Apple($('#board'), size * sizeScale * scale);
    head.apple = apple;
    head.startGame = startGame;
    head.counter = 0;
  }

  startGame();

  $('body').on('keydown', function(e) {
    if (e.keyCode === 37 && head.currentDirection !== 'right') {
      console.log('pressed left');
      head.currentDirection = 'left';
    }
    if (e.keyCode === 39 && head.currentDirection !== 'left') {
      console.log('pressed right');
      head.currentDirection = 'right';
    }
    if (e.keyCode === 40 && head.currentDirection !== 'up') {
      console.log('pressed down');
      head.currentDirection = 'down';
    }
    if (e.keyCode === 38 && head.currentDirection !== 'down') {
      console.log('pressed up');
      head.currentDirection = 'up';
    }
    if (e.keyCode === 32) {
      head.currentDirection = 'still';
    }
  });

  // draws pic and emits it
  function drawPic() {
    // console.log('drawing pic');
    domtoimage.toPng($('#gameBoard').get(0))
      .then(function(dataUrl) {
        socket.emit('image', dataUrl);
        // console.log('sent URL');
      })
      .catch(function(error) {
        console.error('oops, something went wrong!', error);
      });
  }

  setInterval(drawPic, 300);

});
