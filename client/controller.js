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

    doMovement() {
        const newX = this.localPlayer.x + (this.controls.right - this.controls.left) * this.localPlayer.speed;
        const newY = this.localPlayer.y + (this.controls.down - this.controls.up) * this.localPlayer.speed;

        const mapWidth = this.world.map[0].length * 40;
        const mapHeight = this.world.map.length * 40;

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