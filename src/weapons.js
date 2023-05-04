const { Projectile } = require("./world");

class Weapon {
    constructor(name, damage, range, maxAliveTime, shotSize) {
        this.name = name;
        this.damage = damage;
        this.range = range;
        this.maxAliveTime = maxAliveTime;
        this.shotSize = shotSize;
        this.lastShot = Date.now();
    }

    shoot(world, rots, socketId, shooter) {
        if(!this.alreadyShot) {
            for(let i = 0; i < this.shotSize; i++) {
                let p = new Projectile(shooter.x, shooter.y, { rotX: rots.rotX + this.getRecoil(), rotY: rots.rotY + this.getRecoil()}, socketId);
                p.color = shooter.color;
                p.range = this.range;
                p.maxAliveTime = this.maxAliveTime;
                world.projectiles.push(p);
            }
            this.alreadyShot = true;
        }
    }

    getRecoil() {
        return Math.random() * 10;
    }
}

class Pistol extends Weapon {
    constructor() {
        super("pistol", 10, 5000, 1000, 1);
        
    }

    getRecoil() {
        return Math.random() * 10;
    }
}

class Shotgun extends Weapon {
    constructor() {
        super("shotgun", 5, 5000, 1000, 5);
        
        this.lastShot = Date.now();
    }

    getRecoil() {
        return Math.random() * 50;
    }
}

class Rifle extends Weapon {
    constructor() {
        super("pistol", 5, 5000, 1000, 1);
        
    }

    shoot(world, rots, socketId, shooter) {
        if(Date.now() - this.lastShot >= 50) {
            for(let i = 0; i < this.shotSize; i++) {
                let p = new Projectile(shooter.x, shooter.y, { rotX: rots.rotX + this.getRecoil(), rotY: rots.rotY + this.getRecoil()}, socketId);
                p.color = shooter.color;
                p.range = this.range;
                p.maxAliveTime = this.maxAliveTime;
                world.projectiles.push(p);
            }
            this.lastShot = Date.now();
        }
    }
    
    getRecoil() {
        return Math.random() * 10;
    }
}

class BurstRifle extends Weapon {
    constructor() {
        super("pistol", 5, 5000, 1000, 1);
        this.burstAmnt = 0;
    }

    shoot(world, rots, socketId, shooter) {
        let delay = 50;
        if(this.burstAmnt >= 3) {
            delay = 500;
        }
        if(Date.now() - this.lastShot >= delay) {
            for(let i = 0; i < this.shotSize; i++) {
                let p = new Projectile(shooter.x, shooter.y, { rotX: rots.rotX + this.getRecoil(), rotY: rots.rotY + this.getRecoil()}, socketId);
                p.color = shooter.color;
                p.range = this.range;
                p.maxAliveTime = this.maxAliveTime;
                world.projectiles.push(p);
            }
            this.lastShot = Date.now();
            if(this.burstAmnt >= 3)
                this.burstAmnt = 0;
            this.burstAmnt += 1;
        }
    }
    
    getRecoil() {
        return Math.random() * 3;
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.Pistol = Pistol;
    module.exports.Rifle = Rifle;
    module.exports.Shotgun = Shotgun;
    module.exports.BurstRifle = BurstRifle;
}