const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    socket.on("moveBird", (birdCoordinate) => {
        io.emit("movedBird", birdCoordinate)
    })
});


server.listen(port, () => {
    console.log('http://localhost:3000/');
});