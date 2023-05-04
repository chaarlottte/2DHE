const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { World, Projectile } = require("./src/world")
const { WorldGeneration } = require("./src/worldgen")
const { Player } = require("./src/player")
const { UtilitiesClass } = require("./src/utils")
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

const worldUpdateThread = setInterval(() => {
    world.update();
    
    io.emit("worldUpdate", world.getWorldData());
}, 1000 / 60);

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

    const socketPingThread = setInterval(() => {
        if (!initialized) return;
        let lastRespTime = Date.now() - world.players[socket.id].lastPing;
        if(lastRespTime > 20000) {
            kickSocket(socket, "ping timeout");
        }
    }, 10000);

    const playerUpdateThread = setInterval(() => {
        if (!initialized) return;
        if (world.players[socket.id].health <= 0) {
            world.players[world.players[socket.id].lastHit].kills++;
            console.log("player died");
            kickSocket(socket, "You died!");
         }
    }, 1000 / 60)

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

    socket.on("playerMove", (playerData) => {
        if (!initialized) return;
        const player = world.players[socket.id];
        if (!player) return;
      
        let newX = playerData.x;
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
        player.angle = playerData.angle;

        // console.log(playerData)
      
        socket.broadcast.emit("playerMoved", { playerId: socket.id, x: player.x, y: player.y, angle: player.angle });
    });

    socket.on("playerShoot", (data) => {
        if (!initialized) return;
        for(let i = 0; i < 5; i++) {
            let p = new Projectile(world.players[socket.id].x, world.players[socket.id].y, { rotX: data.rotX + Math.random() * 50, rotY: data.rotY + Math.random() * 50 }, socket.id);
            p.color = world.players[socket.id].color;
            world.projectiles.push(p);
        }
    });
    
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete world.players[socket.id];
        socket.broadcast.emit("playerDisconnected", socket.id);
        clearInterval(socketPingThread);
        clearInterval(playerUpdateThread);
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
