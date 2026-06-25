
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let rooms = {};

function getRoom(roomId){
 if(!rooms[roomId]){
  rooms[roomId]={players:[],words:{},guesses:{},errors:{},scores:{},ready:{},turn:0};
 }
 return rooms[roomId];
}

io.on('connection',(socket)=>{

socket.on('joinRoom',({roomId,name})=>{
 let room=getRoom(roomId);
 socket.join(roomId);

 if(!room.players.find(p=>p.id===socket.id)){
  room.players.push({id:socket.id,name});
  room.scores[socket.id]=0;
  room.errors[socket.id]=0;
  room.guesses[socket.id]=[];
  room.ready[socket.id]=false;
 }

 io.to(roomId).emit('state',room);
});

socket.on('setWord',({roomId,word})=>{
 let room=getRoom(roomId);
 room.words[socket.id]=word.toLowerCase();
 room.ready[socket.id]=true;
 io.to(roomId).emit('state',room);
});

socket.on('guessLetter',({roomId,letter})=>{
 let room=getRoom(roomId);
 if(Object.values(room.ready).includes(false)) return;

 let current=room.players[room.turn];
 if(!current || current.id!==socket.id) return;

 letter=letter.toLowerCase();

 room.players.forEach(p=>{
  if(p.id!==socket.id && room.words[p.id]){
    if(!room.guesses[p.id].includes(letter)){
      room.guesses[p.id].push(letter);
      if(room.words[p.id].includes(letter)){
        room.scores[socket.id]+=10;
      }else{
        room.errors[p.id]++;
      }
    }
  }
 });

 room.turn=(room.turn+1)%room.players.length;
 io.to(roomId).emit('state',room);
});

socket.on('guessWord',({roomId,word})=>{
 let room=getRoom(roomId);
 if(Object.values(room.ready).includes(false)) return;

 let current=room.players[room.turn];
 if(!current || current.id!==socket.id) return;

 word=word.toLowerCase();

 room.players.forEach(p=>{
  if(p.id!==socket.id && room.words[p.id]){
    if(word===room.words[p.id]){
      room.scores[socket.id]+=100;
      room.words[p.id]='';
    }else{
      room.errors[p.id]=6;
    }
  }
 });

 room.turn=(room.turn+1)%room.players.length;
 io.to(roomId).emit('state',room);
});

});

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>console.log('v12 rodando'));
