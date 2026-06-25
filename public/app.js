const s=io();let room='',id='';
s.on('connect',()=>id=s.id);
function join(){room=document.getElementById('room').value;s.emit('join',{room,name:document.getElementById('name').value});document.getElementById('menu').style.display='none';}
function draw(ctx,e){ctx.clearRect(0,0,120,120);
ctx.beginPath();ctx.moveTo(10,110);ctx.lineTo(110,110);ctx.moveTo(20,110);ctx.lineTo(20,10);ctx.lineTo(70,10);ctx.lineTo(70,25);ctx.stroke();
if(e>0){ctx.beginPath();ctx.arc(70,40,10,0,6.28);ctx.stroke();}
if(e>1){ctx.beginPath();ctx.moveTo(70,50);ctx.lineTo(70,80);ctx.stroke();}
if(e>2){ctx.beginPath();ctx.moveTo(70,60);ctx.lineTo(55,70);ctx.stroke();}
if(e>3){ctx.beginPath();ctx.moveTo(70,60);ctx.lineTo(85,70);ctx.stroke();}
if(e>4){ctx.beginPath();ctx.moveTo(70,80);ctx.lineTo(55,100);ctx.stroke();}
if(e>5){ctx.beginPath();ctx.moveTo(70,80);ctx.lineTo(85,100);ctx.stroke();}}

function act(l){s.emit('letter',{room,l});}

s.on('state',st=>{
let html='';
let score='Pontos:<br>';
st.players.forEach(p=>{score+=p.name+': '+(st.scores[p.id]||0)+'<br>';});
html+=`<div>${score}</div>`;

st.players.forEach(p=>{
let me = p.id===id;
let w=st.words[p.id]||'';let g=st.guesses[p.id]||[];
let disp='';for(let c of w){disp+=g.includes(c)?c:'_';disp+=' ';}
html+=`<div class='player ${me?'me':''}'>${p.name}${me?' (VOCE)':''}<br>
<canvas id='c_${p.id}' width=120 height=120></canvas>
<div>${disp}</div></div>`;
});

html+=`<div><input id='l' maxlength=1><button onclick="act(document.getElementById('l').value)">Letra</button></div>`;

document.getElementById('game').innerHTML=html;

st.players.forEach(p=>{let ctx=document.getElementById('c_'+p.id).getContext('2d');draw(ctx,st.errors[p.id]||0);});
});