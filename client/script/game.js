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

        // username = window.prompt("Username: ", "");
        // shape = window.prompt("Shape: ", "square, triangle, circle, cat");
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
        /*this.socket.on("playerMoved", ({ playerId, x, y, angle }) => {
            this.world.players[playerId].x = x;
            this.world.players[playerId].y = y;
            this.world.players[playerId].angle = angle;
        });*/

        this.socket.on("playerMoves", (players) => {
            for(p in players) {
                let playerId = p.id;
                this.world.players[playerId].x = x;
                this.world.players[playerId].y = y;
                this.world.players[playerId].angle = angle;
            }
        });

        this.socket.on("playerJoined", (newPlayer) => {
            this.world.players[newPlayer.id] = newPlayer;
        });

        this.socket.on("kicked", (data) => {
            alert(`Kicked: ${data.reason}`);
            this.socket.disconnect();
        });

        /*this.socket.on("worldUpdate", (data) => {
            // alert(JSON.stringify(data.gameObjects));
            this.world.gameObjects = data.gameObjects;
            this.world.projectiles = data.projectiles;

            // sync with local player data
            this.localPlayer.x = data.players[this.localPlayer.id].x;
            this.localPlayer.y = data.players[this.localPlayer.id].y;
            this.localPlayer.angle = data.players[this.localPlayer.id].angle;
            
            // data.players[this.localPlayer.id] = this.localPlayer;
            
            this.world.players = data.players;
        });*/

        this.socket.on("worldUpdate", (deltaUpdates) => {
            // Apply new players
            Object.entries(deltaUpdates.newPlayers).forEach(([id, newPlayer]) => {
                if (id !== this.localPlayer.id) {
                    this.world.players[id] = newPlayer;
                }
            });
        
            // Remove players that have been removed
            deltaUpdates.removedPlayers.forEach((removedPlayerId) => {
                if (removedPlayerId !== this.localPlayer.id) {
                    delete this.world.players[removedPlayerId];
                }
            });
        
            // Apply player moves
            Object.entries(deltaUpdates.playerMoves).forEach(([id, playerMove]) => {
                if (id === this.localPlayer.id) {
                    this.localPlayer.x = playerMove.x;
                    this.localPlayer.y = playerMove.y;
                    this.localPlayer.angle = playerMove.angle;
                } else {
                    const player = this.world.players[id];
                    if (player) {
                        player.x = playerMove.x;
                        player.y = playerMove.y;
                        player.angle = playerMove.angle;
                    }
                }
            });
        
            // Add new projectiles
            deltaUpdates.newProjectiles.forEach((newProjectile) => {
                this.world.projectiles.push(newProjectile);
            });
        
            // Remove projectiles that have been removed
            deltaUpdates.removedProjectiles.forEach((removedProjectileId) => {
                this.world.projectiles = this.world.projectiles.filter(projectile => projectile.id !== removedProjectileId);
            });

            /*deltaUpdates.updatedProjectiles.forEach((updatedProjectile) => {
                const existingProjectile = this.world.projectiles.find(projectile => projectile.id === updatedProjectile.id);
                if (existingProjectile) {
                    existingProjectile.x = updatedProjectile.x;
                    existingProjectile.y = updatedProjectile.y;
                    existingProjectile.angle = updatedProjectile.angle;
                }
            });*/

            deltaUpdates.projectiles.forEach((updatedProjectile) => {
                const existingProjectile = this.world.projectiles.find(projectile => projectile.id === updatedProjectile.id);
                if (existingProjectile) {
                    existingProjectile.x = updatedProjectile.x;
                    existingProjectile.y = updatedProjectile.y;
                    existingProjectile.angle = updatedProjectile.angle;
        
                    // If the projectile is a rocket, update its particle systems
                    if (updatedProjectile.type === "rocket" && updatedProjectile.particleData) {
                        existingProjectile.fireParticles.setParticles(updatedProjectile.particleData.fireParticles);
                        existingProjectile.smokeParticles.setParticles(updatedProjectile.particleData.smokeParticles);
                    }
                }
            });
        
            // Update game objects (if applicable)
            // Note: This part is not included in the delta updates example, but you can extend the delta updates to handle game objects as well.
            // this.world.gameObjects = data.gameObjects;
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
        this.canvas.addEventListener("mousedown", this.controller.mouseDownListener);
        this.canvas.addEventListener("mouseup", this.controller.mouseUpListener);
    }
}