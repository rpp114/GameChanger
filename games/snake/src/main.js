// head out in global scope for testing purposes
$(document).ready(function() {
  var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
  var socket = io(qs);
  socket.emit('obj', obj);
  head = new Head($('#board'), 0.50);
  var apple = new Apple($('#board'), 0.50);
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
