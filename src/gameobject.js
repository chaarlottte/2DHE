/*
 * Bounding boxes are collidable. A player may not walk through one, they will simply stop.
 */
class BoundingBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

/*
 * Game objects are stored in a chunk, and their x and y coordinates are relative to that chunk.
 * If a chunk is located at (400, 250), and you wanted the game object to be at those coordinates,
 * you would add it to the chunk and set its coordinates to (0, 0).
 */
class GameObject {
    constructor(x, y, w, h, boundingBox) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.boundingBox = boundingBox;
    }

    render(ctx) {
        // Draw the game object as a blank square
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Draw the bounding box as a hollow red rectangle
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.strokeRect(
            this.x + this.boundingBox.x,
            this.y + this.boundingBox.y,
            this.boundingBox.w,
            this.boundingBox.h
        );
    }
}

/*
 * Implement these collision physics into the game.
 */

if (typeof module !== "undefined" && module.exports) {
    module.exports.GameObject = GameObject;
    module.exports.BoundingBox = BoundingBox;
}
