
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let rooms = {};

io.on('connection', (socket) => {

socket.on('joinRoom', ({roomId, name}) => {
 if (!rooms[roomId]){
   rooms[roomId]={players:[],words:{},guesses:{},errors:{},scores:{},turn:0};
 }
 let room=rooms[roomId];
 if(room.players.length>=4) return;

 socket.join(roomId);
 room.players.push({id:socket.id,name});
 room.scores[socket.id]=0;
 room.errors[socket.id]=0;
 room.guesses[socket.id]=[];

 io.to(roomId).emit('state',room);
});

socket.on('setWord',({roomId,word})=>{
 let room=rooms[roomId]; if(!room) return;
 room.words[socket.id]=word.toLowerCase();
 io.to(roomId).emit('state',room);
});

socket.on('guess',({roomId,letter})=>{
 let room=rooms[roomId]; if(!room) return;
 let current=room.players[room.turn];
 if(current.id!==socket.id) return;

 letter = letter.toLowerCase();

 room.players.forEach(p=>{
  if(p.id!==socket.id && room.words[p.id]){
    if(!room.guesses[p.id].includes(letter)){
      room.guesses[p.id].push(letter);
      if(room.words[p.id].includes(letter)){
        room.scores[socket.id]+=10;
      } else {
        room.errors[p.id]++;
      }
    }
  }
 });

 room.turn=(room.turn+1)%room.players.length;
 io.to(roomId).emit('state',room);
});

});

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>console.log('v8 rodando'));
