"use strict";

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const buildPic = require('./buildPic');
// const // qs = require('qs')
const mongoURI = 'mongodb://localhost/GameUsers'; // ip-172-31-43-60.us-west-2.compute.internal'
const cors = require('cors');
// const // mongoURI = 'mongodb://localhost/GameUsers',
const UserCtrl = require('./authenticate/userController');
const User = require('./authenticate/userModel');
const SessionCtrl = require('./authenticate/sessionController');
const Session = require('./authenticate/sessionModel');
const mongoose = require('mongoose');

let nameOfGame = 'snake';

mongoose.connect(mongoURI);
// app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // q = '/' + req.query.id;
  res.sendFile(path.join(__dirname, '/home.html'));
});

// app.post('/signup', UserCtrl.createUser);
app.post('/login', UserCtrl.verify);
io.sockets.setMaxListeners(100);

// initializes socket on Get request to Controller page

function startSocket(nameSpace){

  const socketClients = {};
  const nsp = io.of(nameSpace);
  nsp.max_connections = 2;
  nsp.connections = 0;

  nsp.on('connection', socket => {
    if (this.connections >= this.max_connections) {
      nsp.emit('disconnect', 'Sorry Sucka');
      socket.disconnect();
    } else {
      this.connections++;
      socketClients[socket.id] = socket;
    }

    socket.on('obj', val => {
      // console.log('received Initial Object');
      nsp.emit('obj', val);
    });


    socket.on('changeVariable', val => {
      nsp.emit('changeVariable', val);
    });

    // captures img from game and emits to controller
    socket.on('image', imgObj => {
      if (imgObj.h) {
        buildPic(imgObj, nsp);
      } else {
        nsp.emit('image', imgObj);
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
      this.connections--;
      delete socketClients[socket.id];
      socket.disconnect();
    });
  });
}

app.get('/logout', (req, res) => {
  Session.remove({
    cookieId: req.cookies.SSID,
  });
  res.clearCookie('SSID');
  return res.redirect('/');
});

app.get('/controller', (req, res) => {
  const q = '/ ${req.query.id}';
  let prof;
  startSocket(q);
  User.findOne({
    _id: req.query.id,
  }, (err, doc) => {
    prof = doc.username;
  }).then(() => {
    if (SessionCtrl.isLoggedIn(req, res)) {
      return res.render('./../controller/controller', {
        username: prof,
      });
    }
    return res.send('Please login');
  });
});


app.post('/index', (req, res) => {
  nameOfGame = req.body.gameName.toLowerCase();
  res.send('yes');
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, `/games/${nameOfGame}/index.html`));
});

app.get('/shapes', (req, res) => {
  res.sendFile(path.join(__dirname, '/games/shapes/index.html'));
  // client = 'shapes';
});

app.get('*.js', (req, res) => {
  res.writeHead(200, {
    'content-type': 'text/javascript; charset=UTF-8',
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.css', (req, res) => {
  res.writeHead(200, {
    'content-type': 'text/css; charset=UTF-8',
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.jpg', (req, res) => {
  res.writeHead(200, {
    'content-type': 'image/jpg',
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});
app.get('*.png', (req, res) => {
  res.writeHead(200, {
    'content-type': 'image/png'
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

const port = process.env.PORT || 3000;
http.listen(port);
