
const socket = io();
let room='';
let name='';

function createRoom(){
 room=document.getElementById('room').value;
 name=document.getElementById('name').value;
 socket.emit('createRoom',{roomId:room,name});
 document.getElementById('menu').style.display='none';
 document.getElementById('game').style.display='block';
}

function joinRoom(){
 room=document.getElementById('room').value;
 name=document.getElementById('name').value;
 socket.emit('joinRoom',{roomId:room,name});
 document.getElementById('menu').style.display='none';
 document.getElementById('game').style.display='block';
}

function setWord(){
 socket.emit('setWord',{roomId:room,word:document.getElementById('word').value});
}

function guess(){
 socket.emit('guess',{roomId:room,letter:document.getElementById('letter').value});
}

socket.on('state',(data)=>{
 let wordsHtml='';
 data.players.forEach(p=>{
  if(p.id!==socket.id && data.words[p.id]){
    let w='';
    data.words[p.id].split('').forEach(l=>{
      w += data.guesses[p.id]?.includes(l)?l:'_';
      w+=' ';
    });
    wordsHtml += p.name+': '+w+'<br>';
  }
 });
 document.getElementById('words').innerHTML=wordsHtml;

 let s='';
 data.players.forEach(p=>{
   s+=p.name+': '+data.scores[p.id]+'<br>';
 });
 document.getElementById('scores').innerHTML=s;
});
