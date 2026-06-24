
const socket=io();
let room='';

function joinRoom(){
 room=document.getElementById('room').value;
 socket.emit('joinRoom',{roomId:room,name:document.getElementById('name').value});
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
 document.getElementById('players').innerText = 'Jogadores online: '+data.players.length;

 let html='';
 data.players.forEach(p=>{
  if(p.id!==socket.id && data.words[p.id]){
    let w='';
    data.words[p.id].split('').forEach(l=>{
      w+=data.guesses[p.id].includes(l)?l:'_';
      w+=' ';
    });

    let errors=data.errors[p.id]||0;

    html+=`<div class='card'>
      <b>${p.name}</b><br>
      ${w}<br>
      Letras: ${data.words[p.id].length}<br>
      Erros: ${errors}/6
    </div>`;
  }
 });
 document.getElementById('boards').innerHTML=html;

 let s='';
 data.players.forEach(p=>{
   s+=p.name+': '+data.scores[p.id]+'<br>';
 });
 document.getElementById('scores').innerHTML=s;
});
