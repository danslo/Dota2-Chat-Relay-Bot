$(document).ready(function() {

  var username = prompt('Please enter your username');
  var socket = io();

  $('.messagebox').keyup(function(event) {
    if (event.keyCode == 13) {
      var message = $(this).val();
      socket.emit('message', {
        person: username,
        message: $.trim(message)
      });
      $(this).val('');
    }
  });

  socket.on('message', function(msg) {
    if (msg && msg.message) {
      var messages = $('.messages');
      messages.append('<li class="person">' + msg.person + '</li>');
      messages.append('<li class="message">' + msg.message + '</li>');
      messages.scrollTop(messages.prop('scrollHeight'));
    }
  });

});
