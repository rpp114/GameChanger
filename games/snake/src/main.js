$(document).ready(function() {

  function startGame() {
    console.log(localStorage.getItem('scale'), localStorage.getItem('snakeSize'))
    var scale = localStorage.getItem('scale') || 1;
    var snakeSize = localStorage.getItem('snakeSize') || 0.5;
    var gridSize = localStorage.getItem('gridSize') || 500;
    const sizeOfConstant = 50;
    $('#board').css({
      'height': (gridSize - 1 + (snakeSize * sizeOfConstant) - (gridSize % (snakeSize * sizeOfConstant))) * scale,
      'width': (gridSize - 1 + (snakeSize * sizeOfConstant) - (gridSize % (snakeSize * sizeOfConstant))) * scale
    });

    //allows for dynamic scaling and grid size on start of new game
    $('#gameBoard').width(gridSize * scale + 20);
    $('#gameBoard').height(gridSize * scale + 20);
    this.size = (sizeOfConstant * snakeSize * scale);
    head = new Head($('#board'), sizeOfConstant * snakeSize * scale);
    var apple = new Apple($('#board'), sizeOfConstant * snakeSize * scale);
    head.apple = apple;
    console.log(head.node.position())
    head.node.css({
      'height': this.size,
      'width': this.size
    });
    head.startGame = startGame;
    head.counter = 0;
  }

  startGame();

  // function currentGame() {
  //   var scale = localStorage.getItem('scale') || 1;
  //   var snakeSize = localStorage.getItem('snakeSize') || 0.5;
  //   var gridSize = localStorage.getItem('gridSize') || 500;
  //   const size = 50;
  //   $('#board').css({
  //     'height': (gridSize - 1 + (snakeSize * size) - (gridSize % (snakeSize * size))) * scale,
  //     'width': (gridSize - 1 + (snakeSize * size) - (gridSize % (snakeSize * size))) * scale
  //   });
  //
  //   //allows for dynamic scaling and grid size on start of new game
  //   $('#gameBoard').width(gridSize * scale + 20);
  //   $('#gameBoard').height(gridSize * scale + 20);
  //   head.size = (size * snakeSize * scale);
  //   head.apple.size = (size * snakeSize * scale);
  //   // var apple = new Apple($('#board'), size * snakeSize * scale);
  //   // head.apple = apple;
  //   head.currentGame = currentGame;
  //   // head.counter = 0;
  // }

  $('body').on('keydown', function(e) {
    head.counter++;
    if(e.keyCode != 32){

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
      if (e.keyCode === 38  && head.currentDirection !== 'down') {
        console.log('pressed up');
        head.currentDirection = 'up';
        // head.moveHead('up')
      }
    }
    else {head.isPaused = !head.isPaused; console.log('hi'), head.move();}
    // if (e.keyCode === 32) {
    //   head.currentDirection = 'still';
    //   // head.moveHead('still');
    // }
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

  // setInterval(drawPic, 300);

});
