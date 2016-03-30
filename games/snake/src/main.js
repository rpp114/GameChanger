var qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4);
var socket = io(qs);
$(document).ready(function() {
    socket.on('changeGame', () => {
      console.log('changedGame');
      location.reload();
    })
    var ctrlObj = {
      gameName: 'snake',
      controllers: {
        speed: {
          type: 'range',
          min: 50,
          max: 500,
          step: 10,
          value: 250
        },
        scale: {
          type: 'range',
          min: 0.5,
          max: 2,
          step: 0.1,
          value: 0.8
        },
        snakeSize: {
          type: 'range',
          min: 0.2,
          max: 1,
          step: 0.05,
          value: 0.5
        },
        gridSize: {
          type: 'range',
          min: 100,
          max: 1000,
          step: 100,
          value: 500
        },
        addApple: {
          type: 'button'
        }
      }
    };
    socket.emit('obj', ctrlObj);

    function startGame() {
      var scale = localStorage.getItem('scale') || 1;
      var snakeSize = localStorage.getItem('snakeSize') || 0.5;
      var gridSize = localStorage.getItem('gridSize') || 500;
      const sizeOfConstant = 50;

      $('#board').css({
        'height': (gridSize - 1 + (snakeSize * sizeOfConstant) - (gridSize % (snakeSize * sizeOfConstant))) * scale,
        'width': (gridSize - 1 + (snakeSize * sizeOfConstant) - (gridSize % (snakeSize * sizeOfConstant))) * scale,
        'border': '1px solid black',
        'position': 'absolute',
        'top': '10px',
        'left': '10px'
      });

      //allows for dynamic scaling and grid size on start of new game
      $('#gameBoard').width(gridSize * scale + 20);
      $('#gameBoard').height(gridSize * scale + 20);

      this.size = (sizeOfConstant * snakeSize * scale);
      head = new Head($('#board'), sizeOfConstant * snakeSize * scale);
      var apple = new Apple($('#board'), sizeOfConstant * snakeSize * scale);
      head.apple = apple;

      head.node.css({
        'height': this.size,
        'width': this.size,
        'position': 'absolute',
        'background-color': 'green'
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
    function detectmob() {
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
      } else {
        return false;
      }
    }
    // if (!detectmob()) {
      $('body').on('keydown', function(e) {
        if (e.keyCode != 32) {

          if (e.keyCode === 37 && head.currentDirection !== 'right' && head.currentDirection !== 'left') {
            head.counter++;
            console.log('pressed left');
            head.currentDirection = 'left';
          }
          if (e.keyCode === 39 && head.currentDirection !== 'left' && head.currentDirection !== 'right') {
            head.counter++;
            console.log('pressed right');
            head.currentDirection = 'right';
          }
          if (e.keyCode === 40 && head.currentDirection !== 'up' && head.currentDirection !== 'down') {
            head.counter++;
            console.log('pressed down');
            head.currentDirection = 'down';
          }
          if (e.keyCode === 38 && head.currentDirection !== 'down' && head.currentDirection !== 'up') {
            head.counter++;
            console.log('pressed up');
            head.currentDirection = 'up';
            // head.moveHead('up')
          }
        } else {
          head.isPaused = !head.isPaused;
          head.move();
        }
      });
    // } else {
      window.addEventListener('load', function() {



          // document.addEventListener('touchstart', function(e) {
          //   // touchsurface.innerHTML = ''
          //   var touchobj = e.changedTouches[0]
          //   dist = 0
          //   startX = touchobj.pageX
          //   startY = touchobj.pageY
          //   startTime = new Date().getTime() // record time when finger first makes contact with surface
          //   e.preventDefault()
          // }, false)
          //
          // // document.addEventListener('touchmove', function(e) {
          // //   e.preventDefault() // prevent scrolling when inside DIV
          // // }, false)
          //
          // // document.addEventListener('touchend', function(e) {
          // //   var touchobj = e.changedTouches[0]
          // //   dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
          // //   elapsedTime = new Date().getTime() - startTime // get time elapsed
          // //     // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
          // //   // var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 100)
          // //   // handleswipe(swiperightBol)
          // //   e.preventDefault()
          // // }, false)

          function swipedetect(el, callback) {

            var touchsurface = el,
              swipedir,
              startX,
              startY,
              distX,
              distY,
              threshold = 75, //required min distance traveled to be considered swipe
              restraint = 200, // maximum distance allowed at the same time in perpendicular direction
              allowedTime = 300, // maximum time allowed to travel that distance
              elapsedTime,
              startTime
              // handleswipe = callback || function(swipedir) {}

            document.addEventListener('touchstart', function(e) {
              var touchobj = e.changedTouches[0]
              swipedir = 'none'
              dist = 0
              startX = touchobj.pageX
              startY = touchobj.pageY
              startTime = new Date().getTime() // record time when finger first makes contact with surface
              e.preventDefault()
            }, false)

            document.addEventListener('touchmove', function(e) {
              e.preventDefault() // prevent scrolling when inside DIV
            }, false)

            document.addEventListener('touchend', function(e) {

              var touchobj = e.changedTouches[0]
              var dirs = {left:'right',right:'left',down:'up',up:'down'}
              distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
              distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
              elapsedTime = new Date().getTime() - startTime // get time elapsed
              if (elapsedTime <= allowedTime) { // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                  swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                  swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                }
              } else {
                head.isPaused = !head.isPaused;
                head.move();
              }
              if(head.currentDirection !== dirs[swipedir]) {
                head.counter++;
                head.currentDirection = swipedir;
              }
              // handleswipe(swipedir)
              e.preventDefault()
            }, false)
          }
          return swipedetect($('body'));
        }, false) // end window.onload
        // })
      // }


// draws pic and emits it
function drawPic() {
  var board = document.getElementById('gameBoard')
  board.setAttribute("xmlns", "http://www.w3.org/1999/xhtml")
  var obj = {
    'h': board.offsetHeight,
    'w': board.offsetWidth,
    'html': board.outerHTML.replace(/\n/g, '')
  }
  socket.emit('image', obj);

}

setInterval(drawPic, 250);

});
