class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.controller = null;
        this.renderer = null;
        this.connected = false;
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
            this.connected = true;

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
        /*this.socket.on("playerJoined", (newPlayer) => {
            this.world.players[newPlayer.id] = newPlayer;
        });*/

        this.socket.on("kicked", (data) => {
            alert(`Kicked: ${data.reason}`);
            this.socket.disconnect();
        });

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

            Object.entries(deltaUpdates.playerUpdates).forEach(([id, updates]) => {
                this.world.players[id].x = updates.x;
                this.world.players[id].y = updates.y;
                this.world.players[id].prevX = updates.prevX;
                this.world.players[id].prevY = updates.prevY;
                this.world.players[id].angle = updates.angle;
                this.world.players[id].health = updates.health;
            });

            // Add new projectiles
            deltaUpdates.newProjectiles.forEach((newProjectile) => {
                newProjectile.velocityX = newProjectile.speed * Math.cos(newProjectile.angle);
                newProjectile.velocityY = newProjectile.speed * Math.sin(newProjectile.angle);
                newProjectile.lastUpdateTime = Date.now();
                this.world.projectiles.push(newProjectile);
            });

            deltaUpdates.updatedProjectiles.forEach((updatedProjectile) => {
                const existingProjectile = this.world.projectiles.find(projectile => projectile.id === updatedProjectile.id);
                const notRemovedProjectile = deltaUpdates.removedProjectiles.find(projectile => projectile.id === updatedProjectile.id);
                
                if (existingProjectile && !notRemovedProjectile) {
                    existingProjectile.x = updatedProjectile.x;
                    existingProjectile.y = updatedProjectile.y;
                    existingProjectile.angle = updatedProjectile.angle;
                    existingProjectile.vx = updatedProjectile.speed * Math.cos(updatedProjectile.angle);
                    existingProjectile.vy = updatedProjectile.speed * Math.sin(updatedProjectile.angle);
                    existingProjectile.lastUpdateTime = Date.now();
        
                    // If the projectile is a rocket, update its particle systems
                    if (updatedProjectile.type === "rocket" && updatedProjectile.particleData) {
                        existingProjectile.fireParticles = updatedProjectile.particleData.fireParticles;
                        existingProjectile.smokeParticles = updatedProjectile.particleData.smokeParticles;
                    }
                }
            });

            let toBeRemoved = [];
            // Remove projectiles that have been removed
            deltaUpdates.removedProjectiles.forEach((removedProjectileId) => {
                // this.world.projectiles = this.world.projectiles.filter(projectile => projectile.id !== removedProjectileId);
                let index = 0;
                this.world.projectiles.forEach((projectile) => {
                    toBeRemoved.push(index);
                    index++;
                });
            })

            for(let i in toBeRemoved) {
                delete this.world.projectiles[i];
            }
        });
        
    
        // this.socket.on("playerDisconnected", (playerId) => { delete this.world.players[playerId]; });

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