require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use('/group-chat', express.static(path.join(__dirname, 'public')));

app.get('/group-chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('joinGroup', ({ groupName, userName }) => {
    socket.join(groupName);
    socket.to(groupName).emit('message', { user: 'System', text: `${userName} has joined the group!` });
  });

  socket.on('sendMessage', ({ groupName, userName, message }) => {
    io.to(groupName).emit('message', { user: userName, text: message });
  });

  socket.on('disconnect', () => {
    // Handle disconnect if needed
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
