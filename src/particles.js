class Particle {
    constructor(x, y, vx, vy, size, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.life = life;
        this.maxLife = life;

        this.lifeDecayRate = 1;
        this.idNotReallyUsed = "default";
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.lifeDecayRate;
    }
    
    isAlive() {
        return this.life > 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    emit(x, y, color) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = Math.random() * 2 + 1;
        const life = Math.floor(Math.random() * 30 + 30);
        const particle = new Particle(x, y, vx, vy, size, color, life);
        this.particles.push(particle);
    }
    
    update() {
        this.particles = this.particles.filter(p => p.isAlive());
        for (const particle of this.particles) {
            particle.update();
        }
    }
}

class MuzzleFlashParticleSystem extends ParticleSystem {
    constructor() {
        super();
        this.maxSmokeParticles = 15;
        this.numSmokeParticles = 0;

        this.maxFlashParticles = 5;
        this.numFlashParticles = 0;
    }
    
    emit(x, y, angle, flashColor) {
        // Emit smoke particles
        for (; this.numSmokeParticles < this.maxSmokeParticles; this.numSmokeParticles++) {
            const speed = Math.random() * 1 + 0.5;
            const spread = Math.PI / 2;
            const direction = angle + (Math.random() * spread - spread / 2);
            const vx = Math.cos(direction) * speed;
            const vy = Math.sin(direction) * speed;
            const size = Math.random() * 3 + 4;
            const life = Math.floor(Math.random() * 15 + 15);
            const particle = new Particle(x, y, vx, vy, size, this.randomColor(192, 255, 192, 255, 192, 255), life);
            particle.lifeDecayRate = 0.75;
            particle.idNotReallyUsed = "smoke";
            this.particles.push(particle);
        }

        // Emit flash particles
        for (; this.numFlashParticles < this.maxFlashParticles; this.numFlashParticles++) {
            const speed = Math.random() * 3;
            const spread = Math.PI / 2.5;
            const direction = angle + (Math.random() * spread - spread / 2);
            const vx = Math.cos(direction) * speed;
            const vy = Math.sin(direction) * speed;
            const size = Math.random() * 3 + 3;
            const life = Math.floor(Math.random() * 10 + 10);
            const color = flashColor;
            if(!flashColor)
            color = this.randomColor(255, 255, 200, 255, 0, 128);
            const particle = new Particle(x, y, vx, vy, size, color, life);
            particle.lifeDecayRate = 1;
            particle.idNotReallyUsed = "flash";
            this.particles.push(particle);
        }
    }
    
    update() {
        for (const p of this.particles) {
            p.update();
            if(!p.isAlive()) {
                if(p.idNotReallyUsed === "smoke")
                    this.numSmokeParticles -= 1;
                else if(p.idNotReallyUsed === "flash")
                    this.numFlashParticles -= 1;
            }
        }
        this.particles = this.particles.filter(p => p.isAlive());
    }

    randomColor(minR, maxR, minG, maxG, minB, maxB) {
        const r = Math.floor(Math.random() * (maxR - minR + 1) + minR);
        const g = Math.floor(Math.random() * (maxG - minG + 1) + minG);
        const b = Math.floor(Math.random() * (maxB - minB + 1) + minB);
        return { r, g, b };
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.Particle = Particle;
    module.exports.ParticleSystem = ParticleSystem;
    module.exports.MuzzleFlashParticleSystem = MuzzleFlashParticleSystem;
}