
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let rooms = {};

io.on('connection', (socket) => {

    socket.on('joinRoom', (room, name) => {
        socket.join(room);
        if (!rooms[room]) {
            rooms[room] = { players: [], word: '', guesses: [], master: null, turn: 0 };
        }

        rooms[room].players.push({ id: socket.id, name, points: 0 });

        if (!rooms[room].master) {
            rooms[room].master = socket.id;
        }

        io.to(room).emit('updatePlayers', rooms[room]);
    });

    socket.on('setWord', (room, word) => {
        rooms[room].word = word.toLowerCase();
        rooms[room].guesses = [];
        io.to(room).emit('startGame');
    });

    socket.on('guess', (room, letter) => {
        let data = rooms[room];
        if (!data) return;

        data.guesses.push(letter);
        io.to(room).emit('updateGame', data);
    });

    socket.on('disconnect', () => {
        for (let room in rooms) {
            rooms[room].players = rooms[room].players.filter(p => p.id !== socket.id);
        }
    });
});

server.listen(3000, () => console.log('Servidor rodando'));
