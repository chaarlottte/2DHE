const { ParticleSystem } = require("./particles");

let projectileIdCounter = 0;

class Projectile {
    constructor(x, y, rots, shooterId, damage) {
        this.id = projectileIdCounter++;
        this.type = "normal";
        this.x = x;
        this.y = y;
        this.rots = rots;
        this.damage = damage;

        this.speed = 50;
        this.size = 10;

        this.angle = Math.atan2(this.rots.rotY, this.rots.rotX);

        this.shooterId = shooterId;

        this.used = false;
        this.time = Date.now();
        this.maxAliveTime = 1000;
        this.distanceTraveled = 0;
        this.range = 5000;

        this.isNew = true;
        this.hasMovedThisTick = false;
    }

    update() {}
}

class RocketProjectile extends Projectile {
    constructor(x, y, rots, shooterId, damage) {
        super(x, y, rots, shooterId, damage);
        this.type = "rocket";
        this.speed = 10;
        this.size = 10;
        /*this.trail = [];
        this.maxTrailLength = 10;
        this.minTrailDistance = 2;
        this.trailSize = 5;*/

        this.fireParticles = new ParticleSystem();
        this.smokeParticles = new ParticleSystem();
    }

    update() {
        const fireColor = { r: 255, g: 128, b: 0 }; 
        const smokeColor = { r: 128, g: 128, b: 128 };
        this.fireParticles.emit(this.x, this.y, fireColor);
        this.smokeParticles.emit(this.x, this.y, smokeColor);
        this.fireParticles.update();
        this.smokeParticles.update();
    }

    getParticleData() {
        return {
            fireParticles: this.fireParticles.particles,
            smokeParticles: this.smokeParticles.particles,
        };
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.Projectile = Projectile;
    module.exports.RocketProjectile = RocketProjectile;
}