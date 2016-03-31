var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  fs = require('fs'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  buildPic = require('./buildPic'),
  qs = require('qs'),
  mongoURI = 'mongodb://localhost/GameUsers', //ip-172-31-43-60.us-west-2.compute.internal', //localhost/GameUsers'
  cors = require('cors'),
  mongoURI = 'mongodb://localhost/GameUsers',
  UserCtrl = require('./authenticate/userController'),
  SessionCtrl = require('./authenticate/sessionController'),
  Session = require('./authenticate/sessionModel'),
mongoose = require('mongoose');
var q = '';
var nameOfGame = 'snake';

mongoose.connect(mongoURI);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// app.get('/*', function(req, res, next) {
//   // console.log('get: ', req.query.id)
//
//   next();
// });

app.get('/', function(req, res) {
  // q = '/' + req.query.id;
  res.sendFile(path.join(__dirname, '/home.html'));
});

app.get('/welcome', function(req, res) {
  res.sendFile(path.join(__dirname, '/welcome.html'));
});

app.get('/phaser', function(req,res) {
  res.sendFile(path.join(__dirname, '/games/space/shoot.html'))
})

// app.post('/signup', UserCtrl.createUser);
app.post('/login', UserCtrl.verify);
io.sockets.setMaxListeners(100);

var socketClients = {};
// initializes socket on Get request to Controller page
function startSocket(nameSpace) {

  var nsp = io.of(nameSpace);
  nsp.max_connections = 2;
  nsp.connections = 0;

  nsp.on('connection', function(socket) {
    if( this.connections >= this.max_connections) {
      nsp.emit('disconnect', 'Sorry Sucka');
      console.log('Too Many Connections');
      socket.disconnect()
    }else {
      this.connections++;
      socketClients[socket.id] = socket;
    }
    console.log(Object.keys(socketClients));
    console.log(this.connections);
    // console.log('users connected: ', socketCount);

    socket.on('obj', function(val) {
      // console.log('received Initial Object');
      nsp.emit('obj', val);
    });


    socket.on('changeVariable', function(val) {
      nsp.emit('changeVariable', val);
    });

    //captures img from game and emits to controller
    socket.on('image', imgObj => {
      if(imgObj.h)
        buildPic(imgObj, nsp);
      else{
        nsp.emit('image', imgObj)
      }
    });

    socket.on('chartData', data => {
      // need to figure out how to get controller to join room to listen from emits
      nsp.emit('chartData', data);
    });

    socket.on('changeGame', (e) => {
      nsp.emit('changeGame', e);
    });

    socket.on('disconnect', () => {
      console.log('disconnect and remove');
      this.connections--;
      delete socketClients[socket.id];
      socket.disconnect();
      console.log(this.connections);
    });
  });
}

app.get('/logout', function(req, res) {
  Session.remove({cookieId: req.cookies.SSID});
  res.clearCookie('SSID');
  return res.redirect('/');
  // debugger;
})

app.get('/controller', function(req, res) {
  if (SessionCtrl.isLoggedIn(req, res)) {
    q = '/' + req.query.id;
    startSocket(q);
    return res.sendFile(path.join(__dirname, '/controller/controller.html'));
  }
  return res.send('Please login');
});

app.get('/controller3', function(req, res) {
  q = '/' + req.query.id;
  res.sendFile(path.join(__dirname, '/controller/controller3.html'));
  // res.render('./controller/controller');
});

app.post('/index', function(req, res) {
  nameOfGame = req.body.gameName.toLowerCase();
  res.send('yes');
});

app.get('/game', function(req, res) {
  res.sendFile(path.join(__dirname, '/games/' + nameOfGame + '/index.html'));
});

app.get('/marble', function(req, res) {
  res.sendFile(path.join(__dirname, '/games/marble/index.html'));
  client = 'marble';
});
app.get('/snake', function(req, res) {
  res.sendFile(path.join(__dirname, '/games/snake/index.html'));
  client = 'snake';
});

app.get('/shapes', function(req, res) {
  res.sendFile(path.join(__dirname, '/games/shapes/index.html'));
  client = 'shapes';
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

var port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log('I\'m listening!!');
});
