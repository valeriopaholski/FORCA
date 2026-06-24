
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

function guessLetter(){
 socket.emit('guessLetter',{roomId:room,letter:document.getElementById('letter').value});
}

function guessWord(){
 socket.emit('guessWord',{roomId:room,word:document.getElementById('wordGuess').value});
}

socket.on('state',(data)=>{
 document.getElementById('players').innerText='Jogadores: '+data.players.length;

 let readyCount=Object.values(data.ready).filter(v=>v).length;
 document.getElementById('status').innerText = readyCount===data.players.length ? 'JOGO ATIVO' : 'Aguardando palavras...';

 let html='';
 data.players.forEach(p=>{
  if(p.id!==socket.id && data.words[p.id]){
    let w='';
    data.words[p.id].split('').forEach(l=>{
      w+=data.guesses[p.id].includes(l)?l:'_';
      w+=' ';
    });
    html+=`<div class='card'><b>${p.name}</b><br>${w}<br>Erros: ${data.errors[p.id]}/6</div>`;
  }
 });
 document.getElementById('boards').innerHTML=html;

 let s='';
 data.players.forEach(p=>{s+=p.name+': '+data.scores[p.id]+'<br>';});
 document.getElementById('scores').innerHTML=s;
});
