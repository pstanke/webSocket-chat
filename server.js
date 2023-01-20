const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();
const messages = [];
const users = [];
app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000);
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    const user = { name: name, id: socket.id };
    users.push(user);
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${name} has joined the conversation!`,
    });
  });

  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    const userIndex = users.findIndex((user) => user.id === socket.id);
    if (userIndex !== -1) {
      socket.broadcast.emit('message', {
        author: 'Chat Bot',
        content: `${users[userIndex].name} has left the conversation... :(`,
      });
      users.splice(userIndex, 1);
    }
  });
});
