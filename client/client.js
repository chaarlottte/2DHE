const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

document.getElementById("canvas").width = document.documentElement.clientWidth;
document.getElementById("canvas").height = document.documentElement.clientHeight;

const game = new Game(canvas, ctx);
game.connect();

function gameLoop() {
    game.controller.doMovement();
    game.renderer.renderLoop();
}

setInterval(gameLoop, 1000 / 60);