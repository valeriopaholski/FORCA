const e=require('express');const h=require('http');const {Server}=require('socket.io');
const app=e(),srv=h.createServer(app),io=new Server(srv);
app.use(e.static('public'));
let rooms={};
function R(r){if(!rooms[r])rooms[r]={players:[],words:{},guesses:{},errors:{},scores:{}};return rooms[r]}
io.on('connection',s=>{
s.on('join',({room,name})=>{let r=R(room);s.join(room);r.players.push({id:s.id,name});r.words[s.id]='teste';r.guesses[s.id]=[];r.errors[s.id]=0;r.scores[s.id]=0;io.to(room).emit('state',r)});
s.on('letter',({room,l})=>{let r=R(room);r.players.forEach(p=>{if(!r.guesses[p.id].includes(l)){r.guesses[p.id].push(l);if(!r.words[p.id].includes(l))r.errors[p.id]++; else r.scores[s.id]+=10;}});io.to(room).emit('state',r)});
});
srv.listen(3000);