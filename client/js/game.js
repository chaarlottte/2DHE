hiiii = () => {
    console.log("hiiii")
}

class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.controller = null;
        this.renderer = null;
    }

    gameLoop() {
        this.controller.doMovement();
        this.renderer.renderLoop();
    }

    connect() {
        this.socket = io();
        this.socket.on("initialize", (data) => {

            console.log("Fetching world");
            this.world = data.world;

            console.log("Initializing player");
            this.localPlayer = this.world.players[data.playerId];

            console.log("Initializing controller");
            this.controller = new Controller(this.localPlayer, this.socket, this.canvas, this.world);

            console.log("Initializing renderer");
            this.renderer = new Renderer(this.canvas, this.ctx, this);

            this.initializePageEvents();
            this.initializeNetworkEvents();

            // this.startGameLoop();
        });
    }

    startGameLoop() {
        setInterval(this.gameLoop(), 1000 / 60);
    }

    initializeNetworkEvents() {
        this.socket.on("playerMoved", ({ playerId, x, y, angle }) => {
            this.world.players[playerId].x = x;
            this.world.players[playerId].y = y;
            this.world.players[playerId].angle = angle;
        });

        this.socket.on("playerJoined", (newPlayer) => {
            this.world.players[newPlayer.id] = newPlayer;
        });
    
        this.socket.on("playerDisconnected", (playerId) => { delete this.world.players[playerId]; });
    }

    initializePageEvents() {
        document.addEventListener("keydown", this.controller.keyDownHandler);
        document.addEventListener("keyup", this.controller.keyUpHandler);
        this.canvas.addEventListener("mousemove", this.controller.mouseMoveHandler);
    }
}