// head out in global scope for testing purposes
$(document).ready(function() {


  var scale = 0.5;
  var sizeScale = 0.75;
  var gridSize = 800;
  const size = 50;
  $('#board').css({'height': gridSize * scale, 'width': gridSize * scale});
  head = new Head($('#board'), size * sizeScale * scale);
  var apple = new Apple($('#board'), size * sizeScale * scale);
  head.apple = apple;

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
});
