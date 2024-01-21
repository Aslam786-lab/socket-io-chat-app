const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080'
    }
})

const cors = require('cors');

app.use(cors());

const users = {}; 

io.on('connection', socket => {
    console.log('New user connected');

    socket.on('join', (userName) => {
        users[socket.id] = userName;
        console.log(`${userName} joined the chat`);
        console.log(users)
    });

    socket.on('send-message', (message) => {
        const userName = users[socket.id];

        io.emit('recieved-message', { userName, message: message.message });
    });

    socket.on('disconnect', () => {
        const userName = users[socket.id];
        console.log(`${userName} disconnected`);
        delete users[socket.id];
    });
});

http.listen(PORT, () => {
    console.log('Server listening on ' + PORT)
});
