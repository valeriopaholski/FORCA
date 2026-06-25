
const socket=io();
let room='';

function joinRoom(){
 room=document.getElementById('room').value;
 socket.emit('joinRoom',{roomId:room,name:document.getElementById('name').value});
 document.getElementById('menu').style.display='none';
 document.getElementById('game').style.display='block';
}
function setWord(){socket.emit('setWord',{roomId:room,word:document.getElementById('word').value});}
function guessLetter(){socket.emit('guessLetter',{roomId:room,letter:document.getElementById('letter').value});}
function guessWord(){socket.emit('guessWord',{roomId:room,word:document.getElementById('wordGuess').value});}

function drawHangman(e){
const s=[
` +---+
 |   |
     |
     |
     |
=====`,
` +---+
 |   |
 O   |
     |
     |
=====`,
` +---+
 |   |
 O   |
 |   |
     |
=====`,
` +---+
 |   |
 O   |
/|   |
     |
=====`,
` +---+
 |   |
 O   |
/|\\  |
     |
=====`,
` +---+
 |   |
 O   |
/|\\  |
/    |
=====`,
` +---+
 |   |
 O   |
/|\\  |
/ \\  |
=====`];
return s[Math.min(e,6)];
}

socket.on('state',(data)=>{
 let html='';
 data.players.forEach(p=>{
   if(data.errors[p.id]!==undefined){
      html+=`<pre>${drawHangman(data.errors[p.id])}</pre>`;
   }
 });
 document.getElementById('boards').innerHTML=html;
});
