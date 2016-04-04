'use strict'; // eslint-disable-line
const express = require('express');
const app = express();
const http = require('http').Server(app); // eslint-disable-line
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoURI = 'mongodb://localhost/GameUsers';//ip-172-31-43-60.us-west-2.compute.internal';
const cors = require('cors');
const UserCtrl = require('./authenticate/userController');
const User = require('./authenticate/userModel');
const SessionCtrl = require('./authenticate/sessionController');
const Session = require('./authenticate/sessionModel');
const mongoose = require('mongoose');
const Sockets = require('./sockets');


mongoose.connect(mongoURI);
// app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/home.html'));
});

app.post('/login', UserCtrl.verify);
io.sockets.setMaxListeners(100);

app.get('/logout', (req, res) => {
  Session.remove({
    cookieId: req.cookies.SSID,
  });
  res.clearCookie('SSID');
  return res.redirect('/');
});

app.get('/gameDescriptions', (req, res) => {
  getDirectories('./games').then(files => {
    const descriptions = getDescriptions(files);
    return descriptions;
  }).then(data => {
    res.json(data);
  });
});


// get the description.json from all the game folders

function getDescriptions(games) {
  let gameDescs = {};
  let descs = [];

  games.forEach((game) => {
    var gameDesc = new Promise((resolve, reject) => {

      fs.readFile(path.join('./games/' + game + '/description.json'), 'utf8', (err, data) => {
        if (err) return reject(err);

        resolve(data);
      })
    })

    descs.push(gameDesc);

  })

  return Promise.all(descs).then(values => {
    values.forEach((value, index) => {
      gameDescs[games[index]] = JSON.parse(value)
    })
    return gameDescs;
  })

}


// find all games that exist and return array of folder names
function getDirectories(srcPath) {
  return new Promise((resolve, reject) => {
    var files = fs.readdirSync(srcPath).filter(function(file) {
      return fs.statSync(path.join(srcPath, file)).isDirectory();
    });
    resolve(files);
  });
}

app.get('/controller', (req, res) => {
  console.log(Object.keys(Sockets.roomsObj).length);
  if(Object.keys(Sockets.roomsObj).length === 0) {
    const q = `/${req.query.id}`;
    let prof = '';
    Sockets.startSocket(q, io);
    Sockets.roomsObj[q] = { gameName: 'snake' };
    User.findOne({ _id: req.query.id }, (err, doc) => {
      if (doc) {
        prof = doc.username;
      }
    }).then(() => {
      if (SessionCtrl.isLoggedIn(req, res)) {
        return res.render('./../controller/controller', {
          username: prof,
        });
      }
      return res.send('Please login');
    });
  } else {
    return res.redirect(`/game?id=${req.query.id}`)
  }
});

app.get('/game', (req, res) => {
  let nameOfGame = Sockets.roomsObj['/' + req.query.id].gameName;
  res.sendFile(path.join(__dirname, `/games/${nameOfGame}/index.html`));
});

app.get('/shapes', (req, res) => {
  res.sendFile(path.join(__dirname, '/games/shapes/index.html'));

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
