class Renderer {
    constructor(canvas, ctx, game) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.game = game;

        this.lastDrawTime = performance.now();
        this.fps = 0;

        this.chunkSize = 40;

        this.image = new Image();
        this.image.src = "https://www.screamerscostumes.com/app/uploads/2021/10/75058_fake_butt__12207-1.jpg";
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
            this.drawAsscheeks(player);
        });
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

    drawPlayer(player) {
        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        this.ctx.rotate(player.angle);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(-5, -5, 10, 10);
        this.ctx.restore();
    }

    drawAsscheeks(player) {
        let size = 100;
        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        this.ctx.rotate(player.angle);
        this.ctx.drawImage(this.image, -size / 2, -size / 2, size, size);
        this.ctx.restore();
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