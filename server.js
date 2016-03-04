var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    UserCtrl = require('./authenticate/userStuff'),
    mongoose = require('mongoose'),
    mongoURI = 'mongodb://localhost/GameUsers';

mongoose.connect(mongoURI);
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '/loginsignuphtml/login.html'));
});

app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, '/loginsignuphtml/signup.html'));
});

app.post('/signup', UserCtrl.createUser);
app.post('/login', UserCtrl.verify);
var nsp = io.of('/hi')
nsp.on('connection', function(socket) {
    console.log('user connected');
    socket.on('changeVariable', function(val) {
        console.log('heard: ', val);
        nsp.emit('changeVariable', val);
        console.log('emitted: ', val);
    });

    socket.on('attrChange', mutation => {
        console.log('heard: ', mutation);
        io.emit('attrChange', mutation)
        console.log('emitted: ', mutation);

    socket.on('imready', function(val) {
      nsp.emit('imready', val);
    });
});


app.get('/snake', function(req, res) {
    res.sendFile(path.join(__dirname, '/games/snake/snake.html'));

});
app.get('/controller', function(req, res) {
    res.sendFile(path.join(__dirname, '/controller/controller.html'));

});

app.get('*.js', function(req, res) {
    console.log(path.join(__dirname, req.url));
    res.writeHead(200, {'content-type':'text/javascript; charset=UTF-8'});
    res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.css', function(req, res) {
    console.log(path.join(__dirname, req.url));
    res.writeHead(200, {'content-type': 'text/css; charset=UTF-8'});
    res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.jpg', function(req, res) {
    console.log(path.join(__dirname, req.url));
    res.writeHead(200, {'content-type': 'image/jpg'});
    res.end(fs.readFileSync(path.join(__dirname, req.url)));
});


http.listen(3000, function(){
    console.log('listening on port 3000');
});
