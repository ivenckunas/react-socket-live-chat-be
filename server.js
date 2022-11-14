const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app)
const socketIo = require('socket.io')

const io = socketIo(http, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

const users = [];
const messages = [];

const getUsername = (id) => {
  return users.find((user) => user.id === id).name
}

io.on('connect', socket => {

  socket.on('setName', name => {
    users.push({
      name,
      id: socket.id
    })
  });

  socket.on('setMessages', message => {
    messages.push({
      message,
      username: getUsername(socket.id)
    })

    io.emit('allMessages', messages)
  })

  socket.on('history', () => socket.emit('messageHistory', messages))

});

http.listen(4001, console.log('server is running'));