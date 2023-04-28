const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = new Game(canvas, ctx);

function gameLoop() {
    if(game) {
        if(game.controller)
            game.controller.doMovement();
        if(game.renderer)
            game.renderer.renderLoop();
    }
}

function startGame() {
    document.getElementById("canvas").width = document.documentElement.clientWidth;
    document.getElementById("canvas").height = document.documentElement.clientHeight;

    game.connect();

    setInterval(gameLoop, 1000 / 60);
}

function initialize() {
    // document.getElementById("canvas").width
}

startGame();