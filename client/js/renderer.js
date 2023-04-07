class Renderer {
    constructor(canvas, ctx, game) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.game = game;

        this.lastDrawTime = performance.now();
        this.fps = 0;

        this.chunkSize = this.game.world.worldgen.tileSize;

        this.catImage = new Image();
        this.catImage.src = "https://static-00.iconduck.com/assets.00/cat-face-emoji-512x455-gda5rvrc.png";
    }

    renderLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(
            this.canvas.width / 2 - this.game.localPlayer.x,
            this.canvas.height / 2 - this.game.localPlayer.y
        );

        /*this.game.world.map.forEach((row) => {
            row.forEach((chunk) => {
                this.drawChunk(chunk);
            });
        });*/

        this.drawVisisbleChunks();

        Object.values(this.game.world.players).forEach((player) => {
            this.drawPlayer(player);
        });

        for (const obj of Object.values(this.game.world.gameObjects)) {
            this.renderGameObject(obj);
        }

        this.ctx.restore();

        this.renderHUD();
    }

    drawVisisbleChunks() {
        const visibleXMin = this.game.localPlayer.x - this.canvas.width / 2 - this.chunkSize;
        const visibleXMax = this.game.localPlayer.x + this.canvas.width / 2 + this.chunkSize;
        const visibleYMin = this.game.localPlayer.y - this.canvas.height / 2 - this.chunkSize;
        const visibleYMax = this.game.localPlayer.y + this.canvas.height / 2 + this.chunkSize;

        this.game.world.map.forEach((row) => {
            row.forEach((chunk) => {
                const chunkX = chunk.x * this.chunkSize;
                const chunkY = chunk.y * this.chunkSize;

                if (
                    chunkX + this.chunkSize >= visibleXMin &&
                    chunkX - this.chunkSize <= visibleXMax &&
                    chunkY + this.chunkSize >= visibleYMin &&
                    chunkY - this.chunkSize <= visibleYMax
                ) {
                    this.drawChunk(chunk);
                }
            });
        });
    }

    renderHUD() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(
            0,
            0,
            150,
            50
        );

        const currentTime = performance.now();
        this.fps = 1000 / (currentTime - this.lastDrawTime);
        this.lastDrawTime = currentTime;

        // Draw the FPS counter
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`FPS: ${this.fps.toFixed(1)}`, 5, 20);
        this.ctx.fillText(`POS: (${this.game.localPlayer.x}, ${this.game.localPlayer.y})`, 5, 35);
        this.ctx.restore();
    }

    // old drawPlayer
    /*drawPlayer(player) {
        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        this.ctx.rotate(player.angle);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(-5, -5, 10, 10);
        this.ctx.restore();
    }*/

    drawPlayer(player) {
        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        this.ctx.rotate(player.angle);
        this.ctx.fillStyle = player.color;
        
        switch(player.shape) {
            case "triangle":
                this.ctx.rotate(Math.PI / 2);
                this.ctx.beginPath();
                this.ctx.moveTo(0, -player.size);
                this.ctx.lineTo(-player.size, player.size);
                this.ctx.lineTo(player.size, player.size);
                this.ctx.closePath();
                this.ctx.fill();
                break;
            case "square":
                let size = player.size * 2;
                this.ctx.fillRect(-size / 2, -size / 2, size, size);
                break;
            case "circle":
                let radius = player.size;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
                this.ctx.fill();
                this.ctx.closePath();

                this.drawHands(radius);
                break;
            case "cat":
                let cSize = 100;
                this.ctx.rotate(-Math.PI / 2);
                this.ctx.drawImage(this.catImage, -cSize / 2, -cSize / 2, cSize, cSize);
                break;
        }
        
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        this.drawNametag(player);
        this.drawHealthbar(player);
        this.ctx.restore();
    }

    drawNametag(player) {
        this.ctx.save();
        this.ctx.font = "14px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.fillText(player.name, 0, -player.size - 15);
        this.ctx.restore();
    }

    drawHealthbar(player) {
        const healthWidth = player.size * 2;
        const healthHeight = 7;
    
        this.ctx.save();
    
        // Draw the health bar background
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(-healthWidth / 2, player.size + 15, healthWidth, healthHeight);
    
        // Draw the current health
        const currentHealthWidth = (player.health / player.maxHealth) * healthWidth;
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(-healthWidth / 2 + 1, player.size + 16, currentHealthWidth - 2, healthHeight - 2);
    
        this.ctx.restore();
    }    

    // Definitely not GitHub Copilot code. No-sir-e bob.
    drawHands(radius) {

        let scale = 1.5;
        let translateY = -10;

        this.ctx.save();
        this.ctx.rotate(Math.PI / 2);
        this.ctx.translate(-radius, translateY);
        this.ctx.scale(scale, scale);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.rotate(Math.PI / 2);
        this.ctx.translate(radius, translateY);
        this.ctx.scale(scale, scale);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    renderGameObject(obj) {
        // Draw the game object as a blank square
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

        // Draw the bounding box as a hollow red rectangle
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            obj.x + obj.boundingBox.x,
            obj.y + obj.boundingBox.y,
            obj.boundingBox.w,
            obj.boundingBox.h
        );
    }

    drawChunk(chunk) {
        this.ctx.fillStyle = chunk.color;
        this.ctx.fillRect(
            chunk.x * chunk.size - chunk.size / 2,
            chunk.y * chunk.size - chunk.size / 2,
            chunk.size,
            chunk.size
        );
        /*this.ctx.fillStyle = "black";
        this.ctx.fillText(
            `(${chunk.x}, ${chunk.y})`,
            chunk.x * chunk.size - 10,
            chunk.y * chunk.size - 5
        );*/
    }
}