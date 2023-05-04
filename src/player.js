const { Pistol, Rifle, Shotgun, BurstRifle } = require("./weapons");

class Player {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;

        this.nextPosX = x;
        this.nextPosY = y;

        this.angle = 0;
        this.id = id;
        this.name = id;

        this.speed = 4;

        this.size = 20;
        this.shape = "square"; // triangle, circle, square, cat
        this.color = "red";

        this.health = 100;
        this.maxHealth = 100;

        this.lastPing = Date.now();

        // this.socket = socket;

        this.lastHit = "";

        this.kills = 0;

        this.acFlags = 0;

        this.weapon = new BurstRifle();
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.Player = Player;
}