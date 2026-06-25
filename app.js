<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Forca Online</title>
</head>
<body>
<h2>Forca Online</h2>
<div id="menu">
<input id="name" placeholder="Nome">
<input id="room" placeholder="Sala">
<button onclick="joinRoom()">Entrar</button>
</div>
<div id="game" style="display:none">
<input id="word" placeholder="Sua palavra">
<button onclick="setWord()">Salvar Palavra</button>
<div id="boards"></div>
<input id="letter" maxlength="1">
<button onclick="guessLetter()">Letra</button>
<input id="wordGuess">
<button onclick="guessWord()">Palavra</button>
</div>
<script src="/socket.io/socket.io.js"></script>
<script src="app.js"></script>
</body>
</html>