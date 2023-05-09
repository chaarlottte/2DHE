const { Pistol, Rifle, Shotgun, BurstRifle, RocketLauncher } = require("./weapons");
const { MuzzleFlashParticleSystem } = require("./particles")

class Player {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;

        this.nextPosX = x;
        this.nextPosY = y;
        this.prevX = x;
        this.prevY = y;

        this.angle = 0;
        this.id = id;
        this.name = id;

        this.speed = 250;
        this.sprintModifier = 1.5;

        this.size = 20;
        this.shape = "triangle"; // triangle, circle, square, cat
        this.color = "red";

        this.health = 100;
        this.maxHealth = 100;

        this.lastPing = Date.now();

        // this.socket = socket;

        this.lastAttacker = "";

        this.kills = 0;

        this.acFlags = 0;

        this.weapon = new Rifle();

        this.isNew = true;
        this.isRemoved = false;
        this.hasMovedThisTick = false;
        this.hasShot = false;
        this.muzzleFlashParticles = new MuzzleFlashParticleSystem();
    }

    damage = (damage) => {
        this.health -= damage;
        this.hasTakenDamageThisTick = true;
    }

    getWeaponFromString = (weaponName) => {
        switch(weaponName) {
            case "pistol": return new Pistol();
            case "rifle": return new Rifle();
            case "shotgun": return new Shotgun();
            case "burst": return new BurstRifle();
            case "rpg": return new RocketLauncher();
        }
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.Player = Player;
}