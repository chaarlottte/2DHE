const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { World } = require("./src/world");
const { WorldGeneration } = require("./src/worldgen");
const { Player } = require("./src/player");
const { UtilitiesClass } = require("./src/utils");
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");

const OBFUSCATE_CODE = false;
const worldBounds = [20, 20];
const chunkSize = 120;

const worldGen = new WorldGeneration(worldBounds, chunkSize);
const world = new World(worldGen);

// server.js
const serverUpdateRate = 30; 
const timeStep = 1 / serverUpdateRate; 

const worldUpdateThread = setInterval(() => {
    world.update(io);
    io.emit("worldUpdate", world.getDeltaUpdates());
}, 1000 / serverUpdateRate);

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
        let speed = player.speed * timeStep;

        if (data.controls.sprint)
            speed *= player.sprintModifier;
    
        player.prevX = player.x;
        player.prevY = player.y;
    
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
                player.x = player.prevX;
            }
        }
    
        if (newY >= bottomBound && newY <= topBound) {
            player.y = newY;
            if (world.checkCollision(player, Object.values(world.gameObjects))) {
                player.y = player.prevY;
            }
        }
        
        player.angle = data.rots.angle;

        if(data.controls.mouse) {
            player.weapon.shoot(world, data.rots, socket.id, player);
        } else {
            player.weapon.alreadyShot = false;
        }
    
        if(!world.pendingPlayerMoves[socket.id])
            world.pendingPlayerMoves[socket.id] = { x: player.x, y: player.y, angle: player.angle };
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
    
    if(OBFUSCATE_CODE) {
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
    } else {
        res.send(code);
    }
});

app.use(express.static("client"));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
