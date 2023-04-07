const { GameObject, BoundingBox } = require("./gameobject")

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

function createHouse(x, y, houseWidth, houseHeight, wallThickness, doorWidth, doorHeight, doorWall) {
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
  
  
class World {
    constructor(worldgen) {
        this.worldgen = worldgen;
        this.map = this.worldgen.createMap(this);
        this.players = { };
        this.gameObjects = [ ];

        const houseWalls = createHouse(200, 200, 300, 200, 10, 80, 10, "top");
        this.gameObjects.push(...houseWalls);

        const houseWalls2 = createHouse(200, 450, 300, 200, 10, 80, 10, "right");
        this.gameObjects.push(...houseWalls2);

        const houseWalls3 = createHouse(200, 800, 300, 200, 10, 80, 10, "left");
        this.gameObjects.push(...houseWalls3);

        const houseWalls4 = createHouse(200, 1050, 300, 200, 10, 80, 10, "bottom");
        this.gameObjects.push(...houseWalls4);
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