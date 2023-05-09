const { BulletProjectile, RocketProjectile } = require("./projectile");
const { UtilitiesClass } = require("./utils");

class Weapon {
    constructor(name, damage, range, maxAliveTime, shotSize) {
        this.name = name;
        this.damage = damage;
        this.range = range;
        this.maxAliveTime = maxAliveTime;
        this.shotSize = shotSize;
        this.lastShot = 0;
    }

    shoot(world, rots, socketId, shooter) {
        const offsetX = Math.cos(shooter.angle) * (shooter.size * 1.4);
        const offsetY = Math.sin(shooter.angle) * (shooter.size * 1.4);
        const bulletX = shooter.x + offsetX;
        const bulletY = shooter.y + offsetY;
        if(!this.alreadyShot) {
            for(let i = 0; i < this.shotSize; i++) {
                let p = new BulletProjectile(bulletX, bulletY, { rotX: rots.rotX + this.getRecoil(), rotY: rots.rotY + this.getRecoil()}, socketId, this.damage);
                p.color = shooter.color;
                p.range = this.range;
                p.maxAliveTime = this.maxAliveTime;
                world.projectiles.push(p);
            }
            this.alreadyShot = true;
            return true;
        }
        return false
    }

    getRecoil() {
        let recoilAmount = 10;
        let max = recoilAmount / 2, min = (recoilAmount / 2) * -1;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    muzzleFlash(player) {
        const offsetX = Math.cos(player.angle) * (player.size * 1.4);
        const offsetY = Math.sin(player.angle) * (player.size * 1.4);
        const flashX = player.x + offsetX;
        const flashY = player.y + offsetY;

        let col = UtilitiesClass.extractRGBValues(player.color);
        player.muzzleFlashParticles.emit(flashX, flashY, player.angle, col);
    }
}

class Pistol extends Weapon {
    constructor() {
        super("pistol", 10, 5000, 1000, 1);
        
    }
}

class Shotgun extends Weapon {
    constructor() {
        super("shotgun", 5, 5000, 1500, 5);
        
        this.lastShot = Date.now();
    }

    getRecoil() {
        let recoilAmount = 63;
        let max = recoilAmount / 2, min = (recoilAmount / 2) * -1;
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

class Rifle extends Weapon {
    constructor() {
        super("rifle", 5, 5000, 3000, 1);
        
    }

    shoot(world, rots, socketId, shooter) {
        if(Date.now() - this.lastShot >= 150) {
            const offsetX = Math.cos(shooter.angle) * (shooter.size * 1.4);
            const offsetY = Math.sin(shooter.angle) * (shooter.size * 1.4);
            const bulletX = shooter.x + offsetX;
            const bulletY = shooter.y + offsetY;
            for(let i = 0; i < this.shotSize; i++) {
                let p = new BulletProjectile(bulletX, bulletY, { rotX: rots.rotX + this.getRecoil(), rotY: rots.rotY + this.getRecoil()}, socketId, this.damage);
                p.color = shooter.color;
                p.range = this.range;
                p.maxAliveTime = this.maxAliveTime;
                world.projectiles.push(p);
            }
            this.lastShot = Date.now();
            return true;
        }
        return false;
    }
}

class BurstRifle extends Weapon {
    constructor() {
        super("burst", 5, 5000, 1000, 1);
        this.burstAmnt = 0;
    }

    shoot(world, rots, socketId, shooter) {
        let delay = 50;
        if(this.burstAmnt >= 3)
            delay = 500;
        if(Date.now() - this.lastShot >= delay) {
            const offsetX = Math.cos(shooter.angle) * (shooter.size * 1.4);
            const offsetY = Math.sin(shooter.angle) * (shooter.size * 1.4);
            const bulletX = shooter.x + offsetX;
            const bulletY = shooter.y + offsetY;
            for(let i = 0; i < this.shotSize; i++) {
                let p = new BulletProjectile(bulletX, bulletY, { rotX: rots.rotX + this.getRecoil(), rotY: rots.rotY + this.getRecoil()}, socketId, this.damage);
                p.color = shooter.color;
                p.range = this.range;
                p.maxAliveTime = this.maxAliveTime;
                world.projectiles.push(p);
            }
            this.lastShot = Date.now();
            if(this.burstAmnt >= 3)
                this.burstAmnt = 0;
            this.burstAmnt += 1;
            return true;
        }
        return false;
    }
    
    getRecoil() {
        let recoilAmount = 3;
        let max = recoilAmount / 2, min = (recoilAmount / 2) * -1;
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

class RocketLauncher extends Weapon {
    constructor() {
        super("rpg", 50, 1000, 5000, 1);
    }

    shoot(world, rots, socketId, shooter) {
        if(Date.now() - this.lastShot >= 1500 && !this.alreadyShot) {
            for(let i = 0; i < this.shotSize; i++) {
                let p = new RocketProjectile(shooter.x, shooter.y, { rotX: rots.rotX + this.getRecoil(), rotY: rots.rotY + this.getRecoil()}, socketId, this.damage);
                p.color = shooter.color;
                p.range = this.range;
                p.maxAliveTime = this.maxAliveTime;
                world.projectiles.push(p);
            }
            this.alreadyShot = true;
            this.lastShot = Date.now();
            return true;
        }
        return false;
    }
}


if (typeof module !== "undefined" && module.exports) {
    module.exports.Pistol = Pistol;
    module.exports.Rifle = Rifle;
    module.exports.Shotgun = Shotgun;
    module.exports.BurstRifle = BurstRifle;
    module.exports.RocketLauncher = RocketLauncher;
}