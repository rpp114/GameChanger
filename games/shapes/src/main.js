var shapesOnBoard = {};
var holesOnBoard = {};

function init() {

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  $("#board").width(windowWidth * .9);
  $("#board").height(windowHeight * .9);
  $("#board").css('background-color', '#32c9d6');

  $('#board').append('<button id="addSquare" onclick="buildShape(\'square\', 50, 50)">Add Square</button>');
  $('#board').append('<button id="addCircle" onclick="buildShape(\'circle\', 50, 50)">Add Circle</button>');

}

function buildShape(shape, h, w) {
  if (!shapesOnBoard[shape]) {
    shapesOnBoard[shape] = []
  };

  if (!holesOnBoard[shape]) {
    holesOnBoard[shape] = []
  };

  var newShape = new Shape(shape, h, w, false);
  var newHole = new Shape(shape, h, w, true);
  // var y = $('#' + newShape.id)
  console.log('newShape.id', newShape.id);
  console.log('newhole.id', newHole.id);

  shapesOnBoard[shape].push(newShape);
  $('#board').append(newShape.node);

  // var y = $('#' + newShape.id).position()

  // $('#' + newHole.id).css('left', x, 'top', y)

  $('#' + newShape.id).fadeIn(1000);
  $('#board').append(newHole.node);
  $('#' + newHole.id).css('top', newShape.yPosition, 'left', newShape.xPosition)

  holesOnBoard[shape].push(newHole);

  var angle = Math.random() * (2 *Math.PI)

  console.log(angle);

  $('#' + newShape.id).animate({
    top: (newShape.yPosition + (Math.sin(angle) * 150)) + 'px',
    left: (newShape.xPosition + (Math.cos(angle) * 150)) + 'px'
  });

  console.log(shapesOnBoard);
  console.log(holesOnBoard);

}


function Shape(shape, h, w, hole) {
  var colors = ['blue', 'green', 'yellow', 'red', 'white', 'purple'];
  var boardWidth = $('#board').width() - w
  var boardHeight = $('#board').height() - h
  this.xPosition = Math.floor(Math.random() * boardWidth);
  this.yPosition = Math.floor(Math.random() * boardHeight);

  if (hole) {
    this.color = 'black';
    this.id = shape + shapesOnBoard[shape].length + 'Hole';
    this.display = '';
  } else {
    this.color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
    this.id = shape + shapesOnBoard[shape].length;
    this.display = 'display:none;'
  }



  this.shape = shape;
  this.height = h;
  this.width = w;
  this.class = shape;
  this.node;

  if (shape === 'square') {
    this.node = '<div class="' + shape + '" id="' + this.id + '" style="' + this.display + ' position: absolute; width: ' + this.width + 'px; height: ' + this.height + 'px;top:' + this.yPosition + 'px; left:' + this.xPosition + 'px; background-color:' + this.color + '; border:3px solid black;"></div>'
  }
  if (shape === 'circle') {
    this.node = '<div class="' + shape + '" id="' + this.id + '" style="' + this.display + ' position: absolute; width: ' + this.width + 'px; height: ' + this.height + 'px;top:' + this.yPosition + 'px; left:' + this.xPosition + 'px; border-radius: 50%; background-color:' + this.color + '; border:3px solid black;"></div>'
  }

}
