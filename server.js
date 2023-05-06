const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { World } = require("./src/world");
const { Projectile } = require("./src/projectile");
const { WorldGeneration } = require("./src/worldgen");
const { Pistol, Rifle, Shotgun } = require("./src/weapons");
const { Player } = require("./src/player");
const { UtilitiesClass } = require("./src/utils");
const JavaScriptObfuscator = require("javascript-obfuscator");
const uglifyJS = require("uglify-js");
const fs = require("fs");


const worldBounds = [20, 20];
const chunkSize = 120;

const worldGen = new WorldGeneration(worldBounds, chunkSize);
const world = new World(worldGen);

const utils = new UtilitiesClass();

hello = () => {
    console.log("hello")
}

function kickSocket(socket, reason) {
    socket.emit("kicked", { reason: reason });
    socket.disconnect();
}

/*const worldUpdateThread = setInterval(() => {
    world.update();
    
    io.emit("worldUpdate", world.getWorldData());
}, 1000 / 30);*/

const worldUpdateThread = setInterval(() => {
    world.update();

    if (world.pendingPlayerMoves.length > 0) {
        io.emit("playerMoves", world.pendingPlayerMoves);
        world.pendingPlayerMoves = [];
    }
    
    // Handle player-specific updates within the main world update loop
    Object.values(world.players).forEach(player => {
        const socket = io.sockets.sockets.get(player.id);
        if (!socket) return;

        // Handle player ping timeout
        let lastRespTime = Date.now() - player.lastPing;
        if (lastRespTime > 20000) {
            kickSocket(socket, "ping timeout");
        }

        // Handle player death
        if (player.health <= 0) {
            player.kills++;
            console.log("player died");
            kickSocket(socket, "You died!");
        }
    });

    // io.emit("worldUpdate", world.getWorldData());
    io.emit("worldUpdate", world.getDeltaUpdates());
}, 1000 / 30);

io.on("connection", (socket) => {
    let initialized = false;
    console.log(`User connected: ${socket.id}`);

    socket.on("setUserData", (data) => {
        initialized = true;
        world.players[socket.id] = new Player(0, 0, socket.id);
        world.players[socket.id].color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        world.players[socket.id].name = data.username;
        world.players[socket.id].shape = data.shape;

        socket.emit("initialize", { world, playerId: socket.id });
        socket.broadcast.emit("playerJoined", world.players[socket.id]);
    });

    /*socket.on("playerMove", (playerData) => {
        let player = world.players[socket.id];
        if(!player) return;

        world.players[socket.id].x = playerData.x;
        world.players[socket.id].y = playerData.y;
        world.players[socket.id].angle = playerData.angle;

        socket.broadcast.emit("playerMoved", { playerId: socket.id, x: playerData.x, y: playerData.y, angle: playerData.angle });
    });*/

    socket.on("keepAlive", () => {
        if (!initialized) return;
        const player = world.players[socket.id];
        if (!player) return;
        world.players[socket.id].lastPing = Date.now();
    });

    socket.on("playerInput", (data) => {
        if (!initialized) return;
        const player = world.players[socket.id];
        if (!player) return;
      
        /*let newX = playerData.x;
        let newY = playerData.y;
        // compare distance between the two positions, if greater than 5, then return

        const maxSpeed = 9;
        if (Math.abs(newX - player.x) > maxSpeed || Math.abs(newY - player.y) > maxSpeed) {
            player.acFlags++;
            if (player.acFlags > 5) {
                kickSocket(socket, "cheater cheater pumpkin eater nigga");
            }

            newX = player.x;
            newY = player.y;
        }
        player.x = newX;
        player.y = newY;
        player.angle = playerData.angle;*/
        let speed = player.speed;
        if (data.controls.sprint)
            speed += 2;
    
        const prevX = player.x;
        const prevY = player.y;
    
        const newX = player.x + (data.controls.right - data.controls.left) * speed;
        const newY = player.y + (data.controls.down - data.controls.up) * speed;
    
        const mapWidth = world.map[0].length * world.worldgen.tileSize;
        const mapHeight = world.map.length * world.worldgen.tileSize;
    
        const leftBound = -mapWidth / 2;
        const rightBound = mapWidth / 2;
        const topBound = mapHeight / 2;
        const bottomBound = -mapHeight / 2;
    
        if (newX >= leftBound && newX <= rightBound) {
            player.x = newX;
            if (world.checkCollision(player, Object.values(world.gameObjects))) {
                player.x = prevX;
            }
        }
    
        if (newY >= bottomBound && newY <= topBound) {
            player.y = newY;
            if (world.checkCollision(player, Object.values(world.gameObjects))) {
                player.y = prevY;
            }
        }
        
        player.angle = data.rots.angle;

        if(data.controls.mouse) {
            player.weapon.shoot(world, data.rots, socket.id, player);
        } else {
            player.weapon.alreadyShot = false;
        }
        
        // console.log(data);

        // console.log(playerData)
        // socket.broadcast.emit("playerMoved", { playerId: socket.id, x: player.x, y: player.y, angle: data.angle });
        player.hasMoved = true;
        world.pendingPlayerMoves.push({ playerId: socket.id, x: player.x, y: player.y, angle: data.angle });
    });
    
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete world.players[socket.id];
        socket.broadcast.emit("playerDisconnected", socket.id);
    });
});

const jsDir = __dirname + "/client/script/";

app.get("/js/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = jsDir + filename;
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }
    
    // Read file contents
    const code = fs.readFileSync(filePath, "utf-8");
    
    // Obfuscate file contents
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        shuffleStringArray: true,
        splitStrings: true,
        stringArrayThreshold: 1,
    }).getObfuscatedCode();
    
    res.send(obfuscatedCode);
});

app.use(express.static("client"));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
