var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  fs = require('fs'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  qs = require('qs');
  // mongoURI = 'mongodb://localhost/GameUsers';
  // UserCtrl = require('./authenticate/userStuff'),
  // mongoose = require('mongoose'),

var q;

// mongoose.connect(mongoURI);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.get('/*', function(req, res, next) {
  q = '/' + req.query.id;
  next();
});
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '/loginsignuphtml/login.html'));
});

app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname, '/home.html'));
});

app.get('/welcome', function(req, res) {
  res.sendFile(path.join(__dirname, '/welcome.html'));
});

app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, '/loginsignuphtml/signup.html'));
});

// app.post('/signup', UserCtrl.createUser);
// app.post('/login', UserCtrl.verify);
io.sockets.setMaxListeners(100);

io.on('connection', function(socket) {
  socket.on('obj', function(val) {
    // console.log('hello');
    socket.broadcast.emit('obj', val);
  });

  // q = '/hi';
  // var nsp = io.of(q);
  // nsp.on('connection', function(socket) {

    console.log('user connected');
    socket.on('changeVariable', function(val) {
      // console.log('heard: ', val);
      socket.broadcast.emit('changeVariable', val);
      // console.log('emitted: ', val);
    });

    //captures img from game and emits to controller
    socket.on('image', url => {
      // need to figure out how to get controller to join room to listen from emits
      socket.broadcast.emit('image', url);
      // console.log('server emitted URL');
    });

    socket.on('chartData', data => {
     // need to figure out how to get controller to join room to listen from emits
     socket.broadcast.emit('chartData', data);
     console.log('emitted data: ', data);
   });
    socket.on('obj', ctrlObj => {
     // need to figure out how to get controller to join room to listen from emits
     socket.broadcast.emit('obj', ctrlObj);
     console.log('emitted data: ', ctrlObj);
   });
  // });
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

app.get('/controller', function(req, res) {
    res.sendFile(path.join(__dirname, '/controller/controller.html'));

});
var port = process.env.PORT || 3000
http.listen(port, function() {
  console.log('I\'m listening!!');
});
