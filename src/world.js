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
        this.pendingPlayerMoves = [];

        this.leaderboard = new Leaderboard(this.players);
        
        this.deltaUpdates = {
            newPlayers: {},
            removedPlayers: [],
            playerMoves: {},
            newProjectiles: [],
            removedProjectiles: [],
            updatedProjectiles: []
        };
    }

    update = () => {
        this.deltaUpdates.newPlayers = {};
        this.deltaUpdates.removedPlayers = [];
        this.deltaUpdates.playerMoves = {};
        this.deltaUpdates.newProjectiles = [];
        this.deltaUpdates.removedProjectiles = [];
        this.deltaUpdates.updatedProjectiles = [];

        this.projectiles.forEach(projectile => {
            let oldX = projectile.x;
            let oldY = projectile.y;
            projectile.x += projectile.speed * Math.cos(projectile.angle);
            projectile.y += projectile.speed * Math.sin(projectile.angle);
            projectile.distanceTraveled += Math.sqrt(Math.pow(projectile.x - oldX, 2) + Math.pow(projectile.y - oldY, 2));
            projectile.hasMoved = true;
            projectile.update();
            if (projectile.type === "rocket") {
                projectile.particleData = projectile.getParticleData();
            }
        });


        Object.values(this.players).forEach(player => {
            const playerBox = {
                x: player.x - player.size,
                y: player.y - player.size,
                w: player.size * 2,
                h: player.size * 2,
            };

            
            this.projectiles = this.projectiles.filter(p => !p.used)
            for (const obj of this.projectiles) {
                if(obj.used) 
                    continue
                
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
                        player.lastHit = obj.shooterId;
                    }
                }
            }

            this.leaderboard.createPlayerData(player.id);
        });

        Object.values(this.players).forEach(player => {
            if (player.isNew) {
                this.deltaUpdates.newPlayers[player.id] = player;
                player.isNew = false;
            }
            if (player.isRemoved) {
                this.deltaUpdates.removedPlayers.push(player.id);
                delete this.players[player.id];
            }
        });
        // this.players = this.players.filter(player => !player.isRemoved);

        // Handle player moves
        Object.values(this.players).forEach(player => {
            if (player.hasMoved) {
                this.deltaUpdates.playerMoves[player.id] = {
                    x: player.x,
                    y: player.y,
                    angle: player.angle
                };
                player.hasMoved = false;
            }
        });

        // Handle new and removed projectiles
        this.projectiles.forEach(projectile => {
            if (projectile.isNew) {
                this.deltaUpdates.newProjectiles.push(projectile);
                projectile.isNew = false;
            }
            if (projectile.used) {
                this.deltaUpdates.removedProjectiles.push(projectile.id);
            }
            if (projectile.hasMoved) {
                this.deltaUpdates.updatedProjectiles.push(projectile);
                projectile.hasMoved = false;
                console.log(this.deltaUpdates.updatedProjectiles);
            }
        });
        this.projectiles = this.projectiles.filter(projectile => !projectile.used);

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