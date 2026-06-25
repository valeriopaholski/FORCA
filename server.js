const e=require('express');const h=require('http');const {Server}=require('socket.io');const p=require('path');
const app=e(),srv=h.createServer(app),io=new Server(srv);
app.use(e.static(p.join(__dirname,'public')));
let rooms={};
function R(r){if(!rooms[r])rooms[r]={players:[],words:{},guesses:{},errors:{},turn:0,ready:{}};return rooms[r]}
io.on('connection',sk=>{
sk.on('join',({room,name})=>{let r=R(room);sk.join(room);r.players.push({id:sk.id,name});r.guesses[sk.id]=[];r.errors[sk.id]=0;r.ready[sk.id]=false;io.to(room).emit('state',r)});
sk.on('word',({room,word})=>{let r=R(room);if(r.ready[sk.id])return;r.words[sk.id]=word.toLowerCase();r.ready[sk.id]=true;io.to(room).emit('state',r)});
sk.on('letter',({room,l})=>{let r=R(room);l=l.toLowerCase();r.players.forEach(p=>{if(p.id!==sk.id){if(!r.guesses[p.id].includes(l)){r.guesses[p.id].push(l);if(!r.words[p.id].includes(l))r.errors[p.id]++}}});io.to(room).emit('state',r)});
sk.on('guess',({room,w})=>{let r=R(room);w=w.toLowerCase();r.players.forEach(p=>{if(p.id!==sk.id){if(w!==r.words[p.id])r.errors[p.id]=6}});io.to(room).emit('state',r)});
});
srv.listen(3000);
