var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs'),
    path = require('path');


app.get('/', function(req, res) {
    res.send('<h1>Hello World</h1>')
});

io.on('connection', function(socket) {
    console.log('user connected');
    socket.on('changeVariable', function(val) {
        console.log('heard: ', val);
        io.emit('changeVariable', val)
        console.log('emitted: ', val);
    });
    socket.on('attrChange', mutation => {
        console.log('heard: ', mutation);
        io.emit('attrChange', mutation)
        console.log('emitted: ', mutation);
    });
});


app.get('/snake', function(req, res) {
    res.sendFile(path.join(__dirname, '/games/snake/snake.html'))

});

app.get('*.js', function(req, res) {
    console.log(path.join(__dirname, req.url));
    res.writeHead(200, {'content-type':'text/javascript; charset=UTF-8'})
    res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.css', function(req, res) {
    console.log(path.join(__dirname, req.url));
    res.writeHead(200, {'content-type': 'text/css; charset=UTF-8'})
    res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.jpg', function(req, res) {
    console.log(path.join(__dirname, req.url));
    res.writeHead(200, {'content-type': 'image/jpg'})
    res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('/controller', function(req, res) {
    res.sendFile(path.join(__dirname, '/controller/controller.html'));

})

http.listen(3000, function(){
    console.log('listening on port 3000');
})
