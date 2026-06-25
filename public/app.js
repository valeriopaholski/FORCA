const s=io();let room='',id='';
s.on('connect',()=>id=s.id);
function joinRoom(){room=document.getElementById('room').value;s.emit('join',{room,name:document.getElementById('name').value});document.getElementById('menu').style.display='none';document.getElementById('game').style.display='block'}
function saveWord(){let el=document.getElementById('setWord');if(el.disabled)return;s.emit('word',{room,word:el.value});el.disabled=true}
function guessLetter(){s.emit('letter',{room,l:document.getElementById('letter').value})}
function guessWord(){s.emit('guess',{room,w:document.getElementById('full').value})}
function draw(e){const d=[`+---+
|   |
    |
    |
    |
=====` ,`+---+
|   |
O   |
    |
    |
=====` ,`+---+
|   |
O   |
|   |
    |
=====` ,`+---+
|   |
O   |
/|  |
    |
=====` ,`+---+
|   |
O   |
/|\ |
    |
=====` ,`+---+
|   |
O   |
/|\ |
/   |
=====` ,`+---+
|   |
O   |
/|\ |
/ \ |
=====`];return d[Math.min(e,6)]}

s.on('state',st=>{
// players
let p='Jogadores:<br>';
st.players.forEach(x=>p+=x.name+'<br>');
document.getElementById('players').innerHTML=p;

// turn
let turnTxt = st.players[st.turn]?.id===id ? "<span class='green'>SUA VEZ</span>" : "<span class='orange'>AGUARDE</span>";
document.getElementById('turn').innerHTML=turnTxt;

// word display
let w=st.words[id]||'';let g=st.guesses[id]||[];let disp='';for(let c of w){disp+=g.includes(c)?c:'_';disp+=' ';}
document.getElementById('word').innerText=disp;

// hangman
document.getElementById('hang').innerText=draw(st.errors[id]||0);
});
