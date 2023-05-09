const { Chunk } = require("./world")

class UtilitiesClass {

    movePlayer(player, playerData, world) {
        const newX = playerData.x;
        const newY = playerData.y;
        const mapWidth = world.worldgen.worldSize[0] * Chunk.size;
        const mapHeight = world.worldgen.worldSize[1] * Chunk.size;

        const leftBound = -mapWidth / 2 + Chunk.size / 2;
        const rightBound = mapWidth / 2 - Chunk.size / 2;
        const topBound = mapHeight / 2 - Chunk.size / 2;
        const bottomBound = -mapHeight / 2 + Chunk.size / 2;

        if (newX >= leftBound && newX <= rightBound) {
            player.x = newX;
        }

        if (newY >= bottomBound && newY <= topBound) {
            player.y = newY;
        }

        player.angle = playerData.angle;
    }

    getChunk(x, y, world) {
        const chunkX = Math.floor(x / world.worldgen.tileSize);
        const chunkY = Math.floor(y / world.worldgen.tileSize);
    
        const chunk = world.map[chunkY + world.worldgen.worldSize[1] - 1][chunkX + world.worldgen.worldSize[0] - 1];
        return chunk;
    }

    static extractRGBValues(rgbString) {
        // Use a regular expression to match all numbers in the string
        const matches = rgbString.match(/(\d+)\.\d+/g);
        if (matches) {
            // Convert the matched substrings to integers and return them as an object
            const r = parseInt(matches[0], 10);
            const g = parseInt(matches[1], 10);
            const b = parseInt(matches[2], 10);
            return { r, g, b };
        }
        // If the string is not in the expected format, return null
        return null;
    }
      

}

if (typeof module !== "undefined" && module.exports) {
    module.exports.UtilitiesClass = UtilitiesClass;
}
