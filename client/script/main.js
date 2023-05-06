const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = new Game(canvas, ctx);

function gameLoop() {
    if(game) {
        if(game.renderer)
            game.renderer.renderLoop();
    }
}

function inputLoop() {
    if(game)
        if(game.controller)
            game.controller.doMovement();
}

function startGame() {
    document.getElementById("canvas").width = document.documentElement.clientWidth;
    document.getElementById("canvas").height = document.documentElement.clientHeight;

    game.connect();

    setInterval(gameLoop, 1000 / 120);
    setInterval(inputLoop, 1000 / 30);
}

startGame();