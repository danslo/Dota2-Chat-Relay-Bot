var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  dota_bot = require('./dota_bot');

app.get('/', function(req, res) {
  res.sendfile('chat.html');
});
app.use(express.static('public'));

var bot = new dota_bot(io);

io.on('connection', function(socket) {
  socket.on('message', function(msg) {
    io.emit('message', msg);
    bot.sendMessage(msg.person, msg.message);
  });
});

http.listen(3000);
bot.start();
