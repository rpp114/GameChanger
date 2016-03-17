if (!window.requestAnimationFrame) {

  window.requestAnimationFrame = (function() {

    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

        window.setTimeout(callback, 1000 / 60);

      };

  })();

}



var ball;
var w;
var h;
var socket = io();
function init() {
  $('#board').append('<div id="ball"></div>');
  $('#board').append('<div id="hole"></div>');
  ball = $('#ball').get()[0];
  hole = $('#hole').get()[0];

  w = window.innerWidth;
  h = window.innerHeight;
  $('#board').height(h);
  $('#board').width(w);

  console.log('w: ', w);
  console.log('h: ', h);
  var holeSize = 100 * (1 + 0.5);
  $('#hole').css({
    "width": holeSize + 'px',
    "height": holeSize + 'px'
  })


  ball.style.left = (w / 2) - 50 + "px";
  ball.style.top = (h / 2) - 50 + "px";
  ball.velocity = {
    x: 0,
    y: 0
  }
  ball.position = {
    x: 0,
    y: 0
  }

  hole.position = {

  }
  renderHole(holeSize);
  //
  // $(window).on('keydown', function(e) {
  //   if (e.keyCode === 37) {
  //     console.log('pressed left');
  //     ball.velocity.x -= 10
  //   }
  //   if (e.keyCode === 39) {
  //     console.log('pressed right');
  //     ball.velocity.x += 10
  //   }
  //   if (e.keyCode === 40) {
  //     console.log('pressed down');
  //     ball.velocity.y += 10
  //   }
  //   if (e.keyCode === 38) {
  //     console.log('pressed up');
  //     ball.velocity.y -= 10
  //   }
  // });

  if (window.DeviceOrientationEvent) {

  window.addEventListener("deviceorientation", function(event)
  {
  	ball.velocity.y = Math.round(event.beta);
  	ball.velocity.x = Math.round(event.gamma);
      }
                             )
  };

  update();
}

function drawPic() {
  var board = $('#gameBoard').get(0)
  console.log('board height: ', $('#gameBoard'));
  console.log('drawing pic', board);
  domtoimage.toPng(board)
  .then(function(dataUrl) {
    console.log('sent URL', dataUrl);
    socket.emit('image', dataUrl);
  })
  .catch(function(error) {
    console.error('oops, something went wrong!', error);
  });
}

setInterval(drawPic, 1000);

function update() {


  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;
  var distance = Math.sqrt(Math.pow((ball.position.x - hole.position.left), 2) + Math.pow((ball.position.y - hole.position.top), 2));
  console.log(distance)
  if (distance <= ($('#hole').width() - $('#ball').width())) {
    console.log('YOu win!!');
    var holeWidth = $('#hole').width()
    renderHole(holeWidth);
  }

  if (ball.position.x > (w - 100) && ball.velocity.x > 0) {
    //  ball.position.x = w-100;
    ball.velocity.x = -ball.velocity.x;
  }

  if (ball.position.x < 0 && ball.velocity.x < 0) {
    // ball.position.x = 0;
    ball.velocity.x = -ball.velocity.x;
  }

  if (ball.position.y > (h - 100) && ball.velocity.y > 0) {
    //  ball.position.y = h-100;
    ball.velocity.y = -ball.velocity.y;
  }

  if (ball.position.y < 0 && ball.velocity.y < 0) {
    //  ball.position.y = 0;
    ball.velocity.y = -ball.velocity.y;
  }

  ball.style.top = ball.position.y + "px"
  ball.style.left = ball.position.x + "px"

  requestAnimationFrame(update); //KEEP ANIMATING
}

function renderHole(size) {
  var node = $('#hole').get()[0];

  node.position = {
    left: Math.floor(Math.random() * (w - size)),
    top: Math.floor(Math.random() * (h - size))
  };
  node.style.top = node.position.top + 'px'
  node.style.left = node.position.left + 'px'
}
