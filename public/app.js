
const socket=io();
let room='';

function joinRoom(){
 room=document.getElementById('room').value;
 socket.emit('joinRoom',{roomId:room,name:document.getElementById('name').value});
 document.getElementById('menu').style.display='none';
 document.getElementById('game').style.display='block';
}

function setWord(){
 let w=document.getElementById('word').value.toLowerCase();
 socket.emit('setWord',{roomId:room,word:w});
}

function guess(){
 let l=document.getElementById('letter').value.toLowerCase();
 socket.emit('guess',{roomId:room,letter:l});
}

function drawHangman(errors){
 return `<svg viewBox="0 0 100 120">
 <line x1="10" y1="110" x2="90" y2="110" stroke="black"/>
 <line x1="30" y1="110" x2="30" y2="10" stroke="black"/>
 <line x1="30" y1="10" x2="60" y2="10" stroke="black"/>
 <line x1="60" y1="10" x2="60" y2="20" stroke="black"/>
 ${errors>0?'<circle cx="60" cy="30" r="10" stroke="black" fill="none"/>':''}
 ${errors>1?'<line x1="60" y1="40" x2="60" y2="70" stroke="black"/>':''}
 ${errors>2?'<line x1="60" y1="50" x2="45" y2="60" stroke="black"/>':''}
 ${errors>3?'<line x1="60" y1="50" x2="75" y2="60" stroke="black"/>':''}
 ${errors>4?'<line x1="60" y1="70" x2="45" y2="90" stroke="black"/>':''}
 ${errors>5?'<line x1="60" y1="70" x2="75" y2="90" stroke="black"/>':''}
 </svg>`;
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
      ${drawHangman(errors)}
      <br>${w}<br>
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
