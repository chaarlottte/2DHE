const { GameObject, BoundingBox } = require("./gameobject");
const { Leaderboard } = require("./leaderboard");

/*function createHouse(baseX, baseY, houseWidth, houseHeight, wallThickness, doorWidth, doorHeight, rotation, world) {
    const leftWall = new BoundingBox(0, 0, wallThickness, houseHeight);
    const rightWall = new BoundingBox(0, 0, wallThickness, houseHeight);
    const topWall = new BoundingBox(0, 0, houseWidth, wallThickness);
    const leftBottomWall = new BoundingBox(0, 0, houseWidth / 2 - doorWidth / 2, wallThickness);
    const rightBottomWall = new BoundingBox(0, 0, houseWidth / 2 - doorWidth / 2, wallThickness);
    const leftDoorWall = new BoundingBox(0, 0, wallThickness, houseHeight - doorHeight);
    const rightDoorWall = new BoundingBox(0, 0, wallThickness, houseHeight - doorHeight);

    const walls = [
        { x: baseX, y: baseY, w: wallThickness, h: houseHeight, boundingBox: leftWall },
        { x: baseX + houseWidth - wallThickness, y: baseY, w: wallThickness, h: houseHeight, boundingBox: rightWall },
        { x: baseX, y: baseY + houseHeight - wallThickness, w: houseWidth / 2 - doorWidth / 2, h: wallThickness, boundingBox: leftBottomWall },
        { x: baseX + houseWidth / 2 + doorWidth / 2, y: baseY + houseHeight - wallThickness, w: houseWidth / 2 - doorWidth / 2, h: wallThickness, boundingBox: rightBottomWall },
        { x: baseX, y: baseY, w: houseWidth, h: wallThickness, boundingBox: topWall },
        { x: baseX + houseWidth / 2 - doorWidth / 2 - wallThickness, y: baseY + houseHeight - wallThickness, w: wallThickness, h: houseHeight - doorHeight, boundingBox: leftDoorWall },
        { x: baseX + houseWidth / 2 + doorWidth / 2, y: baseY + houseHeight - wallThickness, w: wallThickness, h: houseHeight - doorHeight, boundingBox: rightDoorWall }
    ];

    for (const wall of walls) {
        const gameObject = new GameObject(wall.x, wall.y, wall.w, wall.h, wall.boundingBox);
        // rotateGameObject(gameObject, baseX + houseWidth / 2, baseY + houseHeight / 2, rotation);
        world.gameObjects.push(gameObject);
    }
}*/

function createHouse(x, y, houseWidth, houseHeight, wallThickness, doorWidth, doorWall) {
    const walls = [];

    const leftWall = new BoundingBox(0, 0, wallThickness, houseHeight);
    const rightWall = new BoundingBox(0, 0, wallThickness, houseHeight);
    const topWall = new BoundingBox(0, 0, houseWidth, wallThickness);
    const bottomWall = new BoundingBox(0, 0, houseWidth, wallThickness);

    switch (doorWall) {
        case "left":
            leftWall.h = houseHeight / 2 - doorWidth / 2;
            walls.push(new GameObject(x + houseWidth - wallThickness, y, wallThickness, houseHeight, rightWall));
            walls.push(new GameObject(x, y, houseWidth, wallThickness, topWall));
            walls.push(new GameObject(x, y + houseHeight - wallThickness, houseWidth, wallThickness, bottomWall));

            walls.push(new GameObject(x, y, wallThickness, houseHeight / 2 - doorWidth / 2, leftWall));
            walls.push(new GameObject(x, y + houseHeight / 2 + doorWidth / 2, wallThickness, houseHeight / 2 - doorWidth / 2, leftWall));
            break;
        case "right":
            rightWall.h = houseHeight / 2 - doorWidth / 2;
            walls.push(new GameObject(x, y, wallThickness, houseHeight, leftWall));
            walls.push(new GameObject(x, y, houseWidth, wallThickness, topWall));
            walls.push(new GameObject(x, y + houseHeight - wallThickness, houseWidth, wallThickness, bottomWall));

            walls.push(new GameObject(x + houseWidth - wallThickness, y, wallThickness, houseHeight / 2 - doorWidth / 2, rightWall));
            walls.push(new GameObject(x + houseWidth - wallThickness, y + houseHeight / 2 + doorWidth / 2, wallThickness, houseHeight / 2 - doorWidth / 2, rightWall));
            break;
        case "top":
            topWall.w = houseWidth / 2 - doorWidth / 2;
            walls.push(new GameObject(x, y, wallThickness, houseHeight, leftWall));
            walls.push(new GameObject(x + houseWidth - wallThickness, y, wallThickness, houseHeight, rightWall));
            walls.push(new GameObject(x, y, houseWidth / 2 - doorWidth / 2, wallThickness, topWall));
            walls.push(new GameObject(x + houseWidth / 2 + doorWidth / 2, y, houseWidth / 2 - doorWidth / 2, wallThickness, topWall));
            walls.push(new GameObject(x, y + houseHeight - wallThickness, houseWidth, wallThickness, bottomWall));
            break;
        case "bottom":
            bottomWall.w = houseWidth / 2 - doorWidth / 2;
            walls.push(new GameObject(x, y, wallThickness, houseHeight, leftWall));
            walls.push(new GameObject(x + houseWidth - wallThickness, y, wallThickness, houseHeight, rightWall));
            walls.push(new GameObject(x, y + houseHeight - wallThickness, houseWidth / 2 - doorWidth / 2, wallThickness, bottomWall));
            walls.push(new GameObject(x + houseWidth / 2 + doorWidth / 2, y + houseHeight - wallThickness, houseWidth / 2 - doorWidth / 2, wallThickness, bottomWall));
            walls.push(new GameObject(x, y, houseWidth, wallThickness, topWall));
            break;
    }

    return walls;
}

function createHouseJSON(x, y, houseWidth, houseHeight, wallThickness, doorWidth, doorWall) {
    const walls = createHouse(x, y, houseWidth, houseHeight, wallThickness, doorWidth, doorWall);
    const houseJSON = [];

    for (const wall of walls) {
        houseJSON.push({
            type: "rectangle",
            x: wall.x,
            y: wall.y,
            w: wall.boundingBox.w,
            h: wall.boundingBox.h,
            color: "#000000",
            boundingBox: {
                x: wall.boundingBox.x,
                y: wall.boundingBox.y,
                w: wall.boundingBox.w,
                h: wall.boundingBox.h
            }
        });
    }

    return houseJSON;
}

class World {
    constructor(worldgen) {
        this.worldgen = worldgen;
        this.map = this.worldgen.createMap(this);
        this.players = { };
        this.gameObjects = [ ];

        this.projectiles = [ ];
        this.pendingPlayerMoves = {};

        this.leaderboard = new Leaderboard(this.players);
        
        this.deltaUpdates = {
            newPlayers: {},
            removedPlayers: [],
            playerUpdates: {},
            newProjectiles: [],
            removedProjectiles: [],
            updatedProjectiles: []
        };
    }

    update = (io) => {
        this.deltaUpdates.newPlayers = {};
        this.deltaUpdates.removedPlayers = [];
        this.deltaUpdates.playerUpdates = {};
        this.deltaUpdates.newProjectiles = [];
        this.deltaUpdates.removedProjectiles = [];
        this.deltaUpdates.updatedProjectiles = [];

        this.projectiles.forEach(projectile => {
            if (projectile.used) {
                this.deltaUpdates.removedProjectiles.push(projectile.id);
            } else {
                if (projectile.isNew) {
                    this.deltaUpdates.newProjectiles.push(projectile);
                    projectile.isNew = false;
                }

                let oldX = projectile.x;
                let oldY = projectile.y;
                projectile.x += projectile.speed * Math.cos(projectile.angle);
                projectile.y += projectile.speed * Math.sin(projectile.angle);
                projectile.distanceTraveled += Math.sqrt(Math.pow(projectile.x - oldX, 2) + Math.pow(projectile.y - oldY, 2));
                projectile.hasMovedThisTick = true;
                projectile.update();
                if (projectile.type === "rocket") 
                    projectile.particleData = projectile.getParticleData();
                
                if (projectile.hasMovedThisTick) {
                    this.deltaUpdates.updatedProjectiles.push(projectile);
                    projectile.hasMovedThisTick = false;
                }
            }
        });

        Object.values(this.players).forEach(player => {
            player.hasMovedThisTick = false;
            player.hasTakenDamageThisTick = false;

            player.muzzleFlashParticles.update();

            if(this.pendingPlayerMoves[player.id]) 
                player.hasMovedThisTick = true;

            const socket = io.sockets.sockets.get(player.id);
            if (socket) {
                let lastRespTime = Date.now() - player.lastPing;
                if (lastRespTime > 20000) {
                    // kickSocket(socket, "ping timeout");
                    this.removePlayer(player, socket, "Ping timeout.");
                }

                // Handle player death
                if (player.health <= 0) {
                    this.players[player.lastAttacker].kills++;
                    // kickSocket(socket, "You died!");
                    this.removePlayer(player, socket, `You died! Killed by: ${this.players[player.lastAttacker].name}`);
                    player.isRemoved = true;
                }
            }

            if (player.isNew) {
                this.deltaUpdates.newPlayers[player.id] = player;
                player.isNew = false;
            } else if (player.isRemoved) {
                this.deltaUpdates.removedPlayers.push(player.id);
                delete this.players[player.id];
            } else if (player.hasMovedThisTick || player.hasTakenDamageThisTick || player.hasShot) {
                this.deltaUpdates.playerUpdates[player.id] = {
                    prevX: player.prevX,
                    prevY: player.prevY,
                    x: player.x,
                    y: player.y,
                    angle: player.angle,
                    health: player.health,
                    muzzleFlashParticles: player.muzzleFlashParticles
                };
                player.hasMovedThisTick = false;
                player.hasTakenDamageThisTick = false;
                player.hasShot = false;
            }

            const playerBox = {
                x: player.x - player.size,
                y: player.y - player.size,
                w: player.size * 2,
                h: player.size * 2,
            };

            this.projectiles = this.projectiles.filter(p => !p.used)
            for (const obj of this.projectiles) {
                if(this.deltaUpdates.removedPlayers.includes(obj.shooterId))
                    obj.used = true;
                
                if(obj.used) 
                    this.deltaUpdates.removedProjectiles.push(obj.id);

                const objBox = {
                    x: obj.x,
                    y: obj.y,
                    w: obj.size,
                    h: obj.size
                };

                if(Date.now() - obj.time > obj.maxAliveTime ||
                    obj.distanceTraveled >= obj.range) {
                    obj.used = true;
                    continue;
                }
    
                if (playerBox.x < objBox.x + objBox.w &&
                    playerBox.x + playerBox.w > objBox.x &&
                    playerBox.y < objBox.y + objBox.h &&
                    playerBox.y + playerBox.h > objBox.y) {
                    if(player.id != obj.shooterId) {
                        player.health -= obj.damage;
                        obj.used = true;
                        player.lastAttacker = obj.shooterId;
                        player.hasTakenDamageThisTick = true;
                    }
                }
            }

            this.leaderboard.createPlayerData(player.id);
        });

        this.deltaUpdates.updatedProjectiles = this.deltaUpdates.updatedProjectiles;
    }

    removePlayer(player, socket, reason) {
        socket.emit("kicked", { reason: reason });
        socket.disconnect();
    }    

    checkCollision(player, gameObjects) {
        const playerBox = {
            x: player.x - player.size,
            y: player.y - player.size,
            w: player.size * 2,
            h: player.size * 2,
        };

        for (const obj of gameObjects) {
            const objBox = {
                x: obj.x + obj.boundingBox.x,
                y: obj.y + obj.boundingBox.y,
                w: obj.boundingBox.w,
                h: obj.boundingBox.h,
            };

            if (
                playerBox.x < objBox.x + objBox.w &&
                playerBox.x + playerBox.w > objBox.x &&
                playerBox.y < objBox.y + objBox.h &&
                playerBox.y + playerBox.h > objBox.y
            ) {
                return true;
            }
        }

        return false;
    }

    getWorldData = () => {
        return {
            gameObjects: this.gameObjects,
            projectiles: this.projectiles,
            players: this.players,
            leaderboard: this.leaderboard,
        };
    }

    getDeltaUpdates = () => {
        return this.deltaUpdates;
    }
}

class Chunk {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.World = World;
    module.exports.Chunk = Chunk;
}