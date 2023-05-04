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

        /*for (const obj of Object.values(this.game.world.gameObjects)) {
            this.renderGameObject(obj);
        }*/

        for(const obj of Object.values(this.game.world.gameObjects)) {
            if (utils.isGameObjectVisible(obj, this.game.localPlayer, this.canvas.width, this.canvas.height)) {
                this.renderGameObject(obj);
            }
        }

        /*for(const projectile of Object.values(this.game.world.projectiles)) {
            // if (utils.isGameObjectVisible(projectile, this.game.localPlayer, this.canvas.width, this.canvas.height)) {
            if(!projectile.used)
                this.renderProjectile(projectile);
            //}
        }*/

        this.drawVisisbleProjectiles();
        
        this.ctx.restore();

        this.renderHUD();
        this.renderLeaderboard();
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

    drawVisisbleProjectiles() {
        const visibleXMin = this.game.localPlayer.x - this.canvas.width / 2;
        const visibleXMax = this.game.localPlayer.x + this.canvas.width / 2;
        const visibleYMin = this.game.localPlayer.y - this.canvas.height / 2;
        const visibleYMax = this.game.localPlayer.y + this.canvas.height / 2;

        Object.values(this.game.world.projectiles).forEach((projectile) => {
            const chunkX = projectile.x;
            const chunkY = projectile.y;

            if (
                chunkX + projectile.size >= visibleXMin &&
                chunkX - projectile.size <= visibleXMax &&
                chunkY + projectile.size >= visibleYMin &&
                chunkY - projectile.size <= visibleYMax
            ) {
                this.renderProjectile(projectile);
            }
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

    renderLeaderboard() {
        let playerArray = Object.values(this.game.world.players);

        // alert(JSON.stringify(this.game.world.leaderboard))

        playerArray.sort(function(a, b) {
            return a.kills - b.kills
        }).reverse();

        // alert(JSON.stringify(playerArray));
        
        let leaderboardSize = (playerArray.length * 25);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(
            0,
            50,
            150,
            leaderboardSize
        );

        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px Arial';

        this.ctx.save();
        let index = 0;
        playerArray.forEach((player) => {
            let kills = player.kills;
            this.ctx.fillText(`${index + 1}.) ${player.name} - ${kills} kills`, 5, 60 + (index * 25));
            index++;
        });
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
        this.ctx.shadowColor = player.color;
        this.ctx.shadowBlur = 25;
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
                let cSize = player.size * 3;
                this.ctx.rotate(-Math.PI / 2);
                this.ctx.drawImage(this.catImage, -cSize / 2, -cSize / 2, cSize, cSize);
                break;
        }

        this.ctx.shadowColor = "transparent";
        this.ctx.shadowBlur = 0;
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
        this.ctx.fillStyle = "white";
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
        this.ctx.fillRect(-healthWidth / 2 + 1, player.size + 16, healthWidth - 2, healthHeight - 2);
        const currentHealthWidth = (player.health / player.maxHealth) * healthWidth;
        this.ctx.fillStyle = "rgb(0, 255, 0)";
        this.ctx.shadowColor = "rgb(0, 128, 0)";
        this.ctx.shadowBlur = 100;
        this.ctx.fillRect(-healthWidth / 2 + 1, player.size + 16, currentHealthWidth - 2, healthHeight - 2);

        this.resetShadow();
    
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

    /*renderGameObject(obj) {
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
    }*/

    renderGameObject(gameObject) {
        this.ctx.fillStyle = gameObject.color;

        if (gameObject.type === 'rectangle') {
            this.ctx.fillRect(gameObject.x, gameObject.y, gameObject.w, gameObject.h);
        } else if (gameObject.type === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(gameObject.x, gameObject.y, gameObject.w / 2, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        }
        // Add more shape types if needed
    }

    renderProjectile(projectile) {
        this.ctx.fillStyle = projectile.color;
        this.ctx.beginPath();
        this.ctx.shadowColor = projectile.color;
        this.ctx.shadowBlur = 100;
        // this.ctx.shadowOffsetX = 10;
        // this.ctx.shadowOffsetY = 10;
        this.ctx.arc(projectile.x, projectile.y, projectile.size / 2, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.resetShadow();
    }

    resetShadow() {
        this.ctx.shadowColor = "transparent";
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
    }

    drawChunk(chunk) {
        // this.ctx.fillStyle = chunk.color;
        this.ctx.fillStyle = "black";
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