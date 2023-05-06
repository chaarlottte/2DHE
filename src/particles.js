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
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
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

if (typeof module !== "undefined" && module.exports) {
    module.exports.Particle = Particle;
    module.exports.ParticleSystem = ParticleSystem;
}