
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let rooms = {};

function createRoom(id, hostId) {
  rooms[id] = {
    players: [],
    words: {}, // cada jogador define sua palavra
    guesses: {},
    scores: {},
    turn: 0
  };
}

io.on('connection', (socket) => {

socket.on('createRoom', ({roomId, name}) => {
  createRoom(roomId, socket.id);
  socket.join(roomId);

  let room = rooms[roomId];
  room.players.push({id: socket.id, name});
  room.scores[socket.id] = 0;

  io.to(roomId).emit('state', room);
});

socket.on('joinRoom', ({roomId, name}) => {
  let room = rooms[roomId];
  if (!room || room.players.length >= 4) return;

  socket.join(roomId);
  room.players.push({id: socket.id, name});
  room.scores[socket.id] = 0;

  io.to(roomId).emit('state', room);
});

socket.on('setWord', ({roomId, word}) => {
  let room = rooms[roomId]; if (!room) return;
  room.words[socket.id] = word.toLowerCase();
  room.guesses[socket.id] = [];

  io.to(roomId).emit('state', room);
});

socket.on('guess', ({roomId, letter}) => {
  let room = rooms[roomId]; if (!room) return;

  let currentPlayer = room.players[room.turn];
  if (currentPlayer.id !== socket.id) return;

  // jogador tenta adivinhar palavra dos outros
  room.players.forEach(p => {
    if (p.id !== socket.id && room.words[p.id]) {
      if (!room.guesses[p.id].includes(letter)) {
        room.guesses[p.id].push(letter);

        if (room.words[p.id].includes(letter)) {
          room.scores[socket.id] += 10;
        }
      }
    }
  });

  room.turn = (room.turn + 1) % room.players.length;

  io.to(roomId).emit('state', room);
});

});

server.listen(3000, () => console.log('v5 rodando'));
