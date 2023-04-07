class Controller {
    constructor(localPlayer, socket, canvas, world) {
        this.localPlayer = localPlayer;
        this.socket = socket;
        this.canvas = canvas;
        this.world = world;

        this.controls = {
            right: false,
            left: false,
            up: false,
            down: false,
            sprint: false,
        };
    }

    /*doMovement() {
        if (this.controls.right) {
            this.localPlayer.x += this.localPlayer.speed;
        }
        
        if (this.controls.left) {
            this.localPlayer.x -= this.localPlayer.speed;
        }
        
        if (this.controls.up) {
            this.localPlayer.y -= this.localPlayer.speed;
        }
        
        if (this.controls.down) {
            this.localPlayer.y += this.localPlayer.speed;
        }

        this.socket.emit("playerMove", { x: this.localPlayer.x, y: this.localPlayer.y, angle: this.localPlayer.angle });
    }*/

    /*doMovement() {
        let speed = this.localPlayer.speed;
        if(this.controls.sprint)
            speed += 2

        const newX = this.localPlayer.x + (this.controls.right - this.controls.left) * speed;
        const newY = this.localPlayer.y + (this.controls.down - this.controls.up) * speed;

        const mapWidth = this.world.map[0].length * this.world.worldgen.tileSize;
        const mapHeight = this.world.map.length * this.world.worldgen.tileSize;

        const leftBound = -mapWidth / 2;
        const rightBound = mapWidth / 2;
        const topBound = mapHeight / 2;
        const bottomBound = -mapHeight / 2;

        if (newX >= leftBound && newX <= rightBound) {
            this.localPlayer.x = newX;
        }

        if (newY >= bottomBound && newY <= topBound) {
            this.localPlayer.y = newY;
        }

        this.socket.emit("playerMove", { x: this.localPlayer.x, y: this.localPlayer.y, angle: this.localPlayer.angle });
    }*/

    doMovement() {
        let speed = this.localPlayer.speed;
        if (this.controls.sprint)
            speed += 2;
    
        const prevX = this.localPlayer.x;
        const prevY = this.localPlayer.y;
    
        const newX = this.localPlayer.x + (this.controls.right - this.controls.left) * speed;
        const newY = this.localPlayer.y + (this.controls.down - this.controls.up) * speed;
    
        const mapWidth = this.world.map[0].length * this.world.worldgen.tileSize;
        const mapHeight = this.world.map.length * this.world.worldgen.tileSize;
    
        const leftBound = -mapWidth / 2;
        const rightBound = mapWidth / 2;
        const topBound = mapHeight / 2;
        const bottomBound = -mapHeight / 2;
    
        if (newX >= leftBound && newX <= rightBound) {
            this.localPlayer.x = newX;
            if (this.checkCollision(this.localPlayer, Object.values(this.world.gameObjects))) {
                this.localPlayer.x = prevX;
            } else {
                this.socket.emit("playerMove", { x: this.localPlayer.x, y: this.localPlayer.y, angle: this.localPlayer.angle });
            }
        }
    
        if (newY >= bottomBound && newY <= topBound) {
            this.localPlayer.y = newY;
            if (this.checkCollision(this.localPlayer, Object.values(this.world.gameObjects))) {
                this.localPlayer.y = prevY;
            } else {
                this.socket.emit("playerMove", { x: this.localPlayer.x, y: this.localPlayer.y, angle: this.localPlayer.angle });
            }
        }
    }    

    checkCollision(player, gameObjects) {
        const playerBox = {
            x: player.x - player.size,
            y: player.y - player.size,
            w: player.size * 2,
            h: player.size * 2,
        };

        for (const obj of gameObjects) {
            const objBox = {
                x: obj.x + obj.boundingBox.x,
                y: obj.y + obj.boundingBox.y,
                w: obj.boundingBox.w,
                h: obj.boundingBox.h,
            };

            if (
                playerBox.x < objBox.x + objBox.w &&
                playerBox.x + playerBox.w > objBox.x &&
                playerBox.y < objBox.y + objBox.h &&
                playerBox.y + playerBox.h > objBox.y
            ) {
                return true;
            }
        }

        return false;
    }

    keyDownHandler = (e) => {
        if (e.keyCode == 39 || e.keyCode == 68) {
            this.controls.right = true;
        } else if (e.keyCode == 37 || e.keyCode == 65) {
            this.controls.left = true;
        } else if (e.keyCode == 38 || e.keyCode == 87) {
            this.controls.up = true;
        } else if (e.keyCode == 40 || e.keyCode == 83) {
            this.controls.down = true;
        } else if (e.keyCode == 16) {
            this.controls.sprint = true;
        }
    };
    
    keyUpHandler = (e) => {
        if (e.keyCode == 39 || e.keyCode == 68) {
            this.controls.right = false;
        } else if (e.keyCode == 37 || e.keyCode == 65) {
            this.controls.left = false;
        } else if (e.keyCode == 38 || e.keyCode == 87) {
            this.controls.up = false;
        } else if (e.keyCode == 40 || e.keyCode == 83) {
            this.controls.down = false;
        } else if (e.keyCode == 16) {
            this.controls.sprint = false;
        }
    };
    
    mouseMoveHandler = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        let rotX = e.clientX - rect.left - this.canvas.width / 2;
        let rotY = e.clientY - rect.top - this.canvas.height / 2;
        let angle = Math.atan2(rotY, rotX);
        this.localPlayer.angle = angle;
    };
}