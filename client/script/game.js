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
        let username = "test";
        let shape = "triangle";

        username = window.prompt("Username: ", "");
        shape = window.prompt("Shape: ", "square, triangle, circle, cat");
        while(!["triangle", "square", "circle", "cat"].includes(shape)) {
            shape = window.prompt("Shape: ", "square, triangle, circle, cat");
        }
        this.socket = io();
        this.socket.emit("setUserData", { username: username, shape: shape })
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

        this.socket.on("kicked", (data) => {
            alert(`Kicked: ${data.reason}`);
            this.socket.disconnect();
        });

        this.socket.on("worldUpdate", (data) => {
            // alert(JSON.stringify(data.gameObjects));
            this.world.gameObjects = data.gameObjects;
            this.world.projectiles = data.projectiles;

            // sync with local player data
            data.players[this.localPlayer.id].x = this.localPlayer.x;
            data.players[this.localPlayer.id].y = this.localPlayer.y;
            
            // data.players[this.localPlayer.id] = this.localPlayer;
            
            this.world.players = data.players;

            /*for(let player of data.players) {
                if(player.id != this.localPlayer.id) {
                    this.world.players[player.id] = player;
                }
            }*/
        });
    
        this.socket.on("playerDisconnected", (playerId) => { delete this.world.players[playerId]; });

        setInterval(() => {
            this.socket.emit("keepAlive");
            // console.log("Broadcasted keepalive");
        }, 5000)
    }

    initializePageEvents() {
        document.addEventListener("keydown", this.controller.keyDownHandler);
        document.addEventListener("keyup", this.controller.keyUpHandler);
        this.canvas.addEventListener("mousemove", this.controller.mouseMoveHandler);
        this.canvas.addEventListener("click", this.controller.clickListener);
    }
}