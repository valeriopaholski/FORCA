const s=io();let room='',id='';s.on('connect',()=>id=s.id);
function joinRoom(){room=document.getElementById('room').value;s.emit('join',{room,name:document.getElementById('name').value});document.getElementById('menu').style.display='none';document.getElementById('game').style.display='block'}

function draw(ctx,e){ctx.clearRect(0,0,150,150);ctx.lineWidth=2;
ctx.beginPath();ctx.moveTo(10,140);ctx.lineTo(140,140);ctx.moveTo(30,140);ctx.lineTo(30,10);ctx.lineTo(80,10);ctx.lineTo(80,25);ctx.stroke();
if(e>0){ctx.beginPath();ctx.arc(80,40,15,0,Math.PI*2);ctx.stroke();}
if(e>1){ctx.beginPath();ctx.moveTo(80,55);ctx.lineTo(80,95);ctx.stroke();}
if(e>2){ctx.beginPath();ctx.moveTo(80,65);ctx.lineTo(60,80);ctx.stroke();}
if(e>3){ctx.beginPath();ctx.moveTo(80,65);ctx.lineTo(100,80);ctx.stroke();}
if(e>4){ctx.beginPath();ctx.moveTo(80,95);ctx.lineTo(60,120);ctx.stroke();}
if(e>5){ctx.beginPath();ctx.moveTo(80,95);ctx.lineTo(100,120);ctx.stroke();}
}

function guessLetter(){s.emit('letter',{room,l:document.getElementById('l').value})}
function guessWord(){s.emit('guess',{room,w:document.getElementById('w').value})}
function saveWord(){let el=document.getElementById('set');if(el.disabled)return;s.emit('word',{room,word:el.value});el.disabled=true}

s.on('state',st=>{
let html='';
st.players.forEach(p=>{
 let isMe = p.id===id;
 let word=st.words[p.id]||'';
 let guesses=st.guesses[p.id]||[];
 let disp='';
 for(let c of word){disp+=guesses.includes(c)?c:'_';disp+=' ';}
 html+=`<div class='player ${isMe?'me':''}'>
 <b>${p.name}${isMe?' (VOCÊ)':''}</b><br>
 <canvas id='c_${p.id}' width='150' height='150'></canvas>
 <div class='word'>${disp}</div>
 </div>`;
});

document.getElementById('game').innerHTML = html + `
<div class='card'>
<input id='set' placeholder='Sua palavra'><button onclick='saveWord()'>Salvar</button><br>
<input id='l' maxlength='1'><button onclick='guessLetter()'>Letra</button>
<input id='w'><button onclick='guessWord()'>Palavra</button>
</div>`;

// draw all
st.players.forEach(p=>{
 let ctx=document.getElementById('c_'+p.id).getContext('2d');
 draw(ctx, st.errors[p.id]||0);
});
});
