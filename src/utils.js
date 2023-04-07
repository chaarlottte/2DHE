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

}

if (typeof module !== "undefined" && module.exports) {
    module.exports.UtilitiesClass = UtilitiesClass;
}
