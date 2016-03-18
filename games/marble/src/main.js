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
//attempt to lock the screen  https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation

// var orientataion = 'portrait-primary';
// window.screen.lockOrientation(orientation);



var ball;
var w;
var h;
var socket = io();

function init() {
  var ctrlObj = {
    gameName: 'marble',
    controllers: {
    ballSize: {
      type: 'range',
      min: 30,
      max: 250,
      step: 10,
      value: 100
    },
    holeSize: {
      type: 'range',
      min: 30,
      max: 500,
      step: 10,
      value: 150
    },
    sensitivity: {
      type: 'range',
      min: 0.05,
      max: 5,
      step: 0.10,
      value: 1
    }
  }
  }

  socket.emit('obj', ctrlObj);
  console.log(ctrlObj);

  $('#board').append('<div id="ball"></div>');
  $('#board').append('<div id="hole"></div>');
  ball = $('#ball').get()[0];
  hole = $('#hole').get()[0];

  ball.sensitivity = ctrlObj.controllers.sensitivity.value;
  ball.ballSize = ctrlObj.controllers.ballSize.value;
  ball.holeSize = ctrlObj.controllers.holeSize.value;

  ball.counter = 0;


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
  //     ball.velocity.x -= ball.sensitivity * 10
  //   }
  //   if (e.keyCode === 39) {
  //     console.log('pressed right');
  //     ball.velocity.x += ball.sensitivity * 10
  //   }
  //   if (e.keyCode === 40) {
  //     console.log('pressed down');
  //     ball.velocity.y += ball.sensitivity * 10
  //   }
  //   if (e.keyCode === 38) {
  //     console.log('pressed up');
  //     ball.velocity.y -= ball.sensitivity * 10
  //   }
  // });
  //
  if (window.DeviceOrientationEvent) {

  window.addEventListener("deviceorientation", function(event)
  {
  	ball.velocity.y = ball.sensitivity * Math.round(event.beta);

  	ball.velocity.x = ball.sensitivity * Math.round(event.gamma);
      }
                             )
  };

  update();
}

function drawPic() {
  var board = $('#gameBoard').get(0)
  domtoimage.toPng(board)
    .then(function(dataUrl) {
      socket.emit('image', dataUrl);
    })
    .catch(function(error) {
      console.error('oops, something went wrong!', error);
    });
}

setTimeout(drawPic, 1000);  //need to figure out a better way to screen cast


socket.on('changeVariable', arr => {
  ball[arr[0]] = arr[1];
  // console.log('heard: ', arr);
})


function update() {

  $('#ball').css({
    'height': ball.ballSize,
    'width': ball.ballSize
  })
  $('#hole').css({
    'height': ball.holeSize,
    'width': ball.holeSize
  })

  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;
  var distance = Math.sqrt(Math.pow((ball.position.x - hole.position.left), 2) + Math.pow((ball.position.y - hole.position.top), 2));
  if (distance <= ($('#hole').width() - $('#ball').width())) {
    console.log('You win!!');
    var holeWidth = $('#hole').width()
    renderHole(holeWidth);
  }

  if (ball.position.x > (w - 100) && ball.velocity.x > 0) {
     ball.position.x = w-100;
    // ball.velocity.x = -ball.velocity.x;
  }

  if (ball.position.x < 0 && ball.velocity.x < 0) {
    ball.position.x = 0;
    // ball.velocity.x = -ball.velocity.x;
  }

  if (ball.position.y > (h - 100) && ball.velocity.y > 0) {
     ball.position.y = h-100;
    // ball.velocity.y = -ball.velocity.y;
  }

  if (ball.position.y < 0 && ball.velocity.y < 0) {
     ball.position.y = 0;
    // ball.velocity.y = -ball.velocity.y;
  }
  console.log('distance: ', distance);
  if (ball.counter % 10 === 0) {
    socket.emit('chartData', {
      'Distance': distance
    })
  }
  ball.style.top = ball.position.y + "px"
  ball.style.left = ball.position.x + "px"
  ball.counter++;
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
