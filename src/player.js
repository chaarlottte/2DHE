class Player {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;

        this.angle = 0;
        this.id = id;

        this.speed = 4;
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.Player = Player;
}