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

        let houseWidth = 300, houseHeight = 200, wallThickness = 20;

        const houseWalls = createHouseJSON(200, 200, houseWidth, houseHeight, wallThickness, 80, "top");
        this.gameObjects.push(...houseWalls);

        const houseWalls2 = createHouseJSON(200, 450, houseWidth, houseHeight, wallThickness, 80, "right");
        this.gameObjects.push(...houseWalls2);

        const houseWalls3 = createHouseJSON(200, 800, houseWidth, houseHeight, wallThickness, 80, "left");
        this.gameObjects.push(...houseWalls3);

        const houseWalls4 = createHouseJSON(200, 1050, houseWidth, houseHeight, wallThickness, 80, "bottom");
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