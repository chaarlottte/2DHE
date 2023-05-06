class ClientUtils {
    static isGameObjectVisible(gameObject, player, screenWidth, screenHeight) {
        const screenLeft = player.x - screenWidth / 2;
        const screenRight = player.x + screenWidth / 2;
        const screenTop = player.y - screenHeight / 2;
        const screenBottom = player.y + screenHeight / 2;

        const objectRight = gameObject.x + gameObject.w;
        const objectBottom = gameObject.y + gameObject.h;

        return (
            gameObject.x < screenRight &&
            objectRight > screenLeft &&
            gameObject.y < screenBottom &&
            objectBottom > screenTop
        );
    }

    static interpolateProjectile(projectile) {
        const currentTime = Date.now();
        const deltaTime = (currentTime - projectile.lastUpdateTime) / 1000;
        const interpolatedX = projectile.x + projectile.vx * deltaTime;
        const interpolatedY = projectile.y + projectile.vy * deltaTime;
        return { x: interpolatedX, y: interpolatedY };
    }

    static interpolatePlayerPosition(player) {
        if(!player.prevX) player.prevX = player.x;
        if(!player.prevY) player.prevY = player.y;
        
        const interpX = this.prevX + (this.x - this.prevX) * this.interpolationProgress;
        const interpY = this.prevY + (this.y - this.prevY) * this.interpolationProgress;
    }
}

class ClientProjectile {
    constructor(x, y, vx, vy, size, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.lastUpdateTime = Date.now();
    }

    interpolate() {
        /*const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        const interpolatedX = this.x + this.vx * deltaTime;
        const interpolatedY = this.y + this.vy * deltaTime;
        return { x: interpolatedX, y: interpolatedY };*/
        return { x: this.x, y: this.y }
    }
}