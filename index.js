const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const clientLocations = {};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('send-location', (data) => {
        clientLocations[socket.id] = data;
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        delete clientLocations[socket.id];
        io.emit('user disconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
