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

  shapesOnBoard[shape].push(newShape);
  $('#board').append(newShape.node);

  $('#' + newShape.id).on('drag',dragging);

  // var y = $('#' + newShape.id).position()

  // $('#' + newHole.id).css('left', x, 'top', y)

  $('#' + newShape.id).fadeIn(1000);

  setTimeout(() => {
    $('#board').append(newHole.node)
    var shapeTop = $('#' + newShape.id).offset().top;
    var shapeLeft = $('#' + newShape.id).offset().left;

    $('#' + newHole.id).css({
      'top': shapeTop,
      'left': shapeLeft
    });

    $('#' + newHole.id).fadeIn(200);

    holesOnBoard[shape].push(newHole);

    var angle = Math.random() * (2 * Math.PI)
    var boardWidth = $('#board').width() - w;
    var boardHeight = $('#board').height() - h;
    var distance = Math.random() * 300

    var newTop  = shapeTop + (Math.sin(angle) * distance);
    var newLeft = shapeLeft + (Math.cos(angle) * distance);
    console.log(newTop, newLeft);

    if (newTop >= boardHeight || newTop <= 0) {
      newTop = shapeTop - (Math.sin(angle) * distance);
    }
    if (newLeft >= boardWidth || newLeft <= 0) {
      newLeft = shapeLeft - (Math.cos(angle) * distance);
    }


    console.log(newTop, newLeft);

    $('#' + newShape.id).draggable()
    $('#' + newShape.id).animate({
      top: newTop + 'px',
      left: newLeft + 'px'
    });
  }, 1100);


}

function dragging(e)  {
  console.log('x: ', e.clientX, 'y: ', e.clientY);
}


//creates new shapes and holes

function Shape(shape, h, w, hole) {
  var boardWidth = $('#board').width() - w
  var boardHeight = $('#board').height() - h
  this.xPosition = Math.floor(Math.random() * boardWidth);
  this.yPosition = Math.floor(Math.random() * boardHeight);

  if (hole) {
    this.color = 'black';
    this.id = shape + shapesOnBoard[shape].length + 'Hole';
    this.display = '';
    this.class = shape + ' hole';
    this.z = 0;
  } else {
    this.color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')'
    this.id = shape + shapesOnBoard[shape].length;
    this.display = 'display:none;'
    this.class = shape + ' shape';
    this.z = 1;
  }



  this.shape = shape;
  this.height = h;
  this.width = w;
  this.node;

  if (shape === 'square') {
    this.node = '<div class="' + this.class + '" id="' + this.id + '" style="display: none;position: absolute;width: ' + this.width + 'px; height: ' + this.height + 'px;top:' + this.yPosition + 'px; left:' + this.xPosition + 'px; background-color:' + this.color + '; border:3px solid black;"></div>'
  }
  if (shape === 'circle') {
    this.node = '<div class="' + this.class + '" id="' + this.id + '" style="display: none; position: absolute; width: ' + this.width + 'px; height: ' + this.height + 'px;top:' + this.yPosition + 'px; left:' + this.xPosition + 'px; border-radius: 50%; background-color:' + this.color + '; border:3px solid black;"></div>'
  }

}
