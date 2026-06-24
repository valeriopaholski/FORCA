
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Forca Online</title>
</head>
<body>

<h2>Forca Multiplayer</h2>
<input id="name" placeholder="Seu nome">
<input id="room" placeholder="Sala">
<button onclick="join()">Entrar</button>

<div id="game" style="display:none;">
    <input id="word" placeholder="Palavra (mestre)">
    <button onclick="setWord()">Definir Palavra</button>

    <div id="wordDisplay"></div>

    <input id="letter" maxlength="1">
    <button onclick="guess()">Chutar</button>
</div>

<script src="/socket.io/socket.io.js"></script>
<script src="app.js"></script>

</body>
</html>
