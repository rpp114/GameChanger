var express = require('express'),
  app = express(),
  minty = require ('minty'),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  fs = require('fs'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
<<<<<<< HEAD
  buildPic = require('./buildPic'),
  qs = require('qs');
  // mongoURI = 'mongodb://localhost/GameUsers';
  // UserCtrl = require('./authenticate/userStuff'),
  // mongoose = require('mongoose'),

var q;

// mongoose.connect(mongoURI);
=======
  qs = require('qs'),
  mongoURI = 'mongodb://localhost/GameUsers',
  UserCtrl = require('./authenticate/userController'),
  SessionCtrl = require('./authenticate/sessionController')
  mongoose = require('mongoose');
var q = '';
minty.file(path.join(__filename))

mongoose.connect(mongoURI);
>>>>>>> 8c5fb00ae5b862d3ab90ee47fd28bc56e5341e4d
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// app.get('/*', function(req, res, next) {
//   // console.log('get: ', req.query.id)
//
//   next();
// });

app.get('/', function(req, res) {
  q = '/' + req.query.id;
  res.sendFile(path.join(__dirname, '/home.html'));
});

app.get('/welcome', function(req, res) {
  res.sendFile(path.join(__dirname, '/welcome.html'));
});


// app.post('/signup', UserCtrl.createUser);
app.post('/login', UserCtrl.verify);
io.sockets.setMaxListeners(100);

io.on('connection', function(socket) {
  // q = '/hi';
  // q = '/' + req.query.id;
  var nsp = io.of(q);
  nsp.on('connection', function(socket) {
    // console.log(q)

    socket.on('obj', function(val) {
      console.log('hello');
      nsp.emit('obj', val);
    });


    console.log('user connected');
    socket.on('changeVariable', function(val) {
      // console.log('heard: ', val);
      nsp.emit('changeVariable', val);
      // console.log('emitted: ', val);
    });

    //captures img from game and emits to controller
    socket.on('image', imgObj => {
      // need to figure out how to get controller to join room to listen from emits
      console.log('imgObj: ', imgObj);
      buildPic(imgObj, nsp);
    });

    socket.on('chartData', data => {
      // need to figure out how to get controller to join room to listen from emits
      console.log(data);
      nsp.emit('chartData', data);
    });
  });
});
app.get('/controller', function(req, res) {
  if(SessionCtrl.isLoggedIn(req,res)){
    q = '/' + req.query.id;
    return res.sendFile(path.join(__dirname, '/controller/controller.html'));
  }
  return res.send('Please login')
  // res.render('./controller/controller');
});

app.get('/snake', function(req, res) {
  res.sendFile(path.join(__dirname, '/games/snake/snake.html'));

});

app.get('/marble', function(req, res) {
  res.sendFile(path.join(__dirname, '/games/marble/index.html'));

});

app.get('*.js', function(req, res) {
  res.writeHead(200, {
    'content-type': 'text/javascript; charset=UTF-8'
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.css', function(req, res) {
  res.writeHead(200, {
    'content-type': 'text/css; charset=UTF-8'
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.jpg', function(req, res) {
  res.writeHead(200, {
    'content-type': 'image/jpg'
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});
app.get('*.png', function(req, res) {
  res.writeHead(200, {
    'content-type': 'image/png'
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

var port = process.env.PORT || 3000
http.listen(port, function() {
  console.log('I\'m listening!!');
});
