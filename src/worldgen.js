const { World, Chunk } = require("./world")

class WorldGeneration {
    constructor(worldSize, tileSize) {
        this.worldSize = worldSize;
        this.tileSize = tileSize;
    }

    createMap() {
        /*return [
            [new Chunk(-1, 1), new Chunk(0, 1), new Chunk(1, 1)],
            [new Chunk(-1, 0), new Chunk(0, 0), new Chunk(1, 0)],
            [new Chunk(-1, -1), new Chunk(0, -1), new Chunk(1, -1)],
        ];*/

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