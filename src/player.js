class Player {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;

        this.angle = 0;
        this.id = id;
        this.name = id;

        this.speed = 4;

        this.size = 30;
        this.shape = "square"; // triangle, circle, square
        this.color = "red";

        this.health = 100;
        this.maxHealth = 100;
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.Player = Player;
}