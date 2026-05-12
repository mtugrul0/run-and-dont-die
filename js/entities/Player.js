/**
 * TODO: Player.js
 * Responsibility: Player entity — movement (WASD), melee fan attack, ranged projectile attack,
 *                 XP collection + level-up trigger, damage handling, inventory management, mad-buff state.
 * Imports from: config.js (CLASS_STATS, MAP_WIDTH, MAP_HEIGHT, XP_COLLECT_RADIUS)
 * Exports: Player class
 *
 * Migration notes:
 *   - Lines 53-208 of game.js → entire Player class
 *   - draw() uses ctx and camera directly — pass them as parameters or via a shared render context
 *   - attack() references enemies[] and projectiles[] — inject via GameState or constructor
 *   - gainXp() calls triggerUpgradeCards() — inject callback or use event emitter
 *   - takeDamage() sets isPaused directly — decouple via callback
 */
import { MAP_WIDTH, MAP_HEIGHT, XP_COLLECT_RADIUS, CLASS_STATS, SPRITE_DATA } from "../config.js"
import { assets } from "../assets/AssetLoader.js"
import { audioManager } from "../assets/AudioManager.js"
import { Projectile } from "./Projectile.js"

export class Player {
    constructor(x, y, charClass, deps) {
        // konum
        this.x = x;
        this.y = y;
        // yarıçapımız
        this.radius = 15;
        this.charClass = charClass;

        this.stats = { ...CLASS_STATS[charClass] }; // seçilen karakterin statlarını sığ koyaladı
        // sprite animasyon
        this.spriteData = SPRITE_DATA[charClass];
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 100; // ms per frame
        this.facingLeft = false;
        this.currentAnim = 'idle';
        this.color = this.stats.color;

        this.maxHealth = this.stats.maxHealth;
        this.health = this.maxHealth;
        this.speed = this.stats.speed;

        this.level = 0;
        this.xp = 0;
        this.xpToNextLevel = 50; // sonrasında iki level arası xp değişkenlik gösterebilir

        this.lastAttackTime = 0;
        this.isAttacking = false;
        this.attackAngle = 0;

        this.lastHitTime = 0;
        this.hitCooldown = 800;

        this.madBuff = false;

        this.maxSlots = 1;
        this.currentSlot = 0;
        this.inventory = [{ type: this.stats.startWeapon, isMelee: true, ammo: Infinity }];

        this._ctx = deps.ctx;
        this._camera = deps.camera;
        this._canvas = deps.canvas
        this._enemies = deps.enemies;
        this._projectiles = deps.projectiles;
        this._onLevelUp = deps.onLevelUp;
        this._onEnemyKilled = deps.onEnemyKilled;
        this._onDeath = deps.onDeath;
        this._input = deps.input;
    };

    draw() {
        const dx = this.x - this._camera.x;
        const dy = this.y - this._camera.y;
        // xp çekme menzili
        this._ctx.beginPath();
        this._ctx.arc(dx, dy, XP_COLLECT_RADIUS, 0, Math.PI * 2);
        this._ctx.strokeStyle = 'rgba(255, 255, 100, 0.12)';
        this._ctx.lineWidth = 1;
        this._ctx.stroke();
        // hangi animasyon?
        const moving = this._input.keys.w || this._input.keys.a || this._input.keys.s || this._input.keys.d;
        this.currentAnim = this.isAttacking ? 'attack' : (moving ? 'run' : 'idle');
        // yön: mouse pozisyonuna göre sola/sağa bak
        const worldMouseX = this._input.mouse.x + this._camera.x;
        this.facingLeft = worldMouseX < this.x;
        const animData = this.spriteData[this.currentAnim];
        const img = assets.images[animData.key];
        if (img) {
            const fw = this.spriteData.frameW;
            const fh = this.spriteData.frameH;
            const drawSize = this.radius * this.spriteData.scale; // ekranda çizilecek boyut
            const sx = this.animFrame * fw;
            this._ctx.save();
            if (this.facingLeft) {
                this._ctx.translate(dx, dy);
                this._ctx.scale(-1, 1);
                this._ctx.drawImage(img, sx, 0, fw, fh, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
            } else {
                this._ctx.drawImage(img, sx, 0, fw, fh, dx - drawSize / 2, dy - drawSize / 2, drawSize, drawSize);
            }
            this._ctx.restore();
        } else {
            // fallback: eski renkli daire
            this._ctx.beginPath();
            this._ctx.arc(dx, dy, this.radius, 0, Math.PI * 2);
            this._ctx.fillStyle = this.madBuff ? '#ff0' : this.color;
            this._ctx.fill();
            this._ctx.strokeStyle = 'white';
            this._ctx.lineWidth = 2;
            this._ctx.stroke();
        }
        // saldırı yelpazesi
        if (this.isAttacking) {
            this._ctx.beginPath();
            this._ctx.moveTo(dx, dy);
            this._ctx.arc(dx, dy, this.stats.attackRange,
                this.attackAngle - this.stats.attackSpread,
                this.attackAngle + this.stats.attackSpread);
            this._ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            this._ctx.fill();
        }
    };

    update() {
        const effectiveSpeed = this.madBuff ? this.speed * 1.5 : this.speed;

        if (this._input.keys.w) this.y = Math.max(this.radius, this.y - effectiveSpeed);
        if (this._input.keys.s) this.y = Math.min(MAP_HEIGHT - this.radius, this.y + effectiveSpeed);
        if (this._input.keys.a) this.x = Math.max(this.radius, this.x - effectiveSpeed);
        if (this._input.keys.d) this.x = Math.min(MAP_WIDTH - this.radius, this.x + effectiveSpeed);

        this._camera.x = this.x - this._canvas.width / 2;
        this._camera.y = this.y - this._canvas.height / 2;

        if (this._input.mouse.isDown && Date.now() - this.lastAttackTime > this.stats.fireRate) {
            this.attack();
        }
        if (Date.now() - this.lastAttackTime > 150) this.isAttacking = false;

        // animasyon frame güncelle
        this.animTimer += 16; // ~60fps varsayımı
        const animData = this.spriteData[this.currentAnim];
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % animData.frames;
        }

        this.draw();
    };

    attack() {
        const weapon = this.inventory[this.currentSlot];
        if (!weapon || (weapon.ammo <= 0 && !weapon.isMelee)) return;

        this.lastAttackTime = Date.now();
        const worldMouseX = this._input.mouse.x + this._camera.x;
        const worldMouseY = this._input.mouse.y + this._camera.y;
        this.attackAngle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x);

        const soundKey = weapon.isMelee ? 'attack_' + this.charClass : 'gun';
        const attackSound = assets.audio[soundKey];
        if (attackSound) audioManager.playSFX(attackSound);

        const effectiveDamage = this.madBuff ? this.stats.damage * 1.5 : this.stats.damage;

        if (weapon.isMelee) {
            this.isAttacking = true;
            this._enemies.forEach((enemy, index) => {
                const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                if (dist <= this.stats.attackRange + enemy.radius) {
                    let angleDiff = Math.atan2(enemy.y - this.y, enemy.x - this.x) - this.attackAngle;
                    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                    if (Math.abs(angleDiff) <= this.stats.attackSpread) {
                        enemy.health -= effectiveDamage;
                        const hitSfx = assets.audio.hit;
                        if (hitSfx) audioManager.playSFX(hitSfx);
                        
                        if (enemy.health <= 0) this._onEnemyKilled(enemy, index);
                    }
                }
            });
        } else {
            weapon.ammo--;
            const speedMult = weapon.type === 'sniper' ? 15 : 8;
            const dmgMult = weapon.type === 'sniper' ? 3 : (weapon.type === 'pompali' ? 0.5 : 1);

            if (weapon.type === 'pompali') {
                for (let i = -1; i <= 1; i++) {
                    const angle = this.attackAngle + i * 0.2;
                    this._projectiles.push(new Projectile(this.x, this.y,
                        { x: Math.cos(angle) * speedMult, y: Math.sin(angle) * speedMult },
                        effectiveDamage * dmgMult));
                }
            } else {
                this._projectiles.push(new Projectile(this.x, this.y,
                    { x: Math.cos(this.attackAngle) * speedMult, y: Math.sin(this.attackAngle) * speedMult },
                    effectiveDamage * dmgMult));
            }
        }
    };

    takeDamage(amount) {
        if (Date.now() - this.lastHitTime < this.hitCooldown) return;
        this.lastHitTime = Date.now();
        this.health -= amount;
        
        if (this.health <= 0) {
            this.health = 0;
            const deathSound = assets.audio.death;
            if (deathSound) audioManager.playSFX(deathSound);
            this._onDeath();
        } else {
            const hitSound = assets.audio.hit;
            if (hitSound) audioManager.playSFX(hitSound);
        }
    };

    gainXp(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.level++;
            this.xp -= this.xpToNextLevel;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
            if (this.level % 3 === 0 && this.maxSlots < 4) this.maxSlots++;

            const levelupSound = assets.audio.levelup;
            if (levelupSound) audioManager.playSFX(levelupSound);

            this._onLevelUp();
        }
    };
};