const { World, Chunk } = require("./world")
const { GameObject, BoundingBox } = require("./gameobject")

class WorldGeneration {
    constructor(worldSize, tileSize) {
        this.worldSize = worldSize;
        this.tileSize = tileSize;
    }

    createMap() {
        const [rows, columns] = this.worldSize;
        const map = [];

        for (let y = 1 - rows; y < rows; y++) {
            const row = [];
            for (let x = 1 - columns; x < columns; x++) {
                row.push(new Chunk(x, y, this.tileSize));
            }
            map.push(row);
        }

        return map;
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.WorldGeneration = WorldGeneration;
}