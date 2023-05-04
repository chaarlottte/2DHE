class Controller {
    constructor(localPlayer, socket, canvas, world) {
        this.localPlayer = localPlayer;
        this.socket = socket;
        this.canvas = canvas;
        this.world = world;
        this.angle = 0;
        this.rotX = 0;
        this.rotY = 0;

        this.controls = {
            right: false,
            left: false,
            up: false,
            down: false,
            sprint: false,
            mouse: false,
        };
    }

    doMovement() {
        this.socket.emit("playerInput", { controls: this.controls, rots: { rotX: this.rotX, rotY: this.rotY, angle: this.angle } });
    }    

    checkCollision(player, gameObjects) {
        const playerBox = {
            x: player.x - player.size,
            y: player.y - player.size,
            w: player.size * 2,
            h: player.size * 2,
        };

        for (const obj of gameObjects) {
            if (utils.isGameObjectVisible(obj, player, this.canvas.width, this.canvas.height)) {
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
        this.rotX = e.clientX - rect.left - this.canvas.width / 2;
        this.rotY = e.clientY - rect.top - this.canvas.height / 2;
        let angle = Math.atan2(this.rotY, this.rotX);
        this.angle = angle;
    };

    mouseDownListener = (e) => {
        this.controls.mouse = true;
    };

    mouseUpListener = (e) => {
        this.controls.mouse = false;
        // alert(JSON.stringify(this.controls));
    };
}