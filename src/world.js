// const { WorldGeneration } = require("./worldgen")

class World {
    constructor(worldgen) {
        this.worldgen = worldgen;
        this.map = this.worldgen.createMap();
        this.players = { };
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