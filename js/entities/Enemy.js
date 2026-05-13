/**
 * TODO: Enemy.js
 * Responsibility: Enemy entity — tracks player position, melee damage on contact with cooldown,
 *                 health bar rendering, death handling.
 * Imports from: (none directly, receives player reference via GameState)
 * Exports: Enemy class
 *
 * Migration notes:
 *   - Lines 361-406 of game.js → entire Enemy class
 *   - update() references player.x/y for tracking — inject player reference
 *   - Collision with player (lines 396-402) calls player.takeDamage() — keep as-is with injected ref
 *   - draw() uses ctx, camera — pass as parameters
 */

import { ENEMY_SPRITE_DATA, ENEMY_STATS } from "../config.js";
import { assets } from "../assets/AssetLoader.js";

export class Enemy {
    constructor(x, y, enemyType = 'flying_eye') {
        this.x = x; this.y = y;

        this.enemyType = enemyType;

        const stats = ENEMY_STATS[enemyType];
        this.radius = stats.radius;
        this.speed = stats.speed;
        this.health = stats.health;
        this.maxHealth = stats.health;
        this.damage = stats.damage;

        this.lastAttackTime = 0;
        this.attackCooldown = 800;

        this.spriteData = ENEMY_SPRITE_DATA[enemyType];
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 100;
        this.facingLeft = false;

    };

    draw(ctx, camera) {
        const dx = this.x - camera.x;
        const dy = this.y - camera.y;

        const sd = this.spriteData;
        const img = sd ? assets.images[sd.key] : null;

        if (img) {
            const drawSize = this.radius * sd.scale;
            const sx = this.animFrame * sd.frameW;

            ctx.save();
            if (this.facingLeft) {
                ctx.translate(dx, dy);
                ctx.scale(-1, 1);
                ctx.drawImage(img, sx, 0, sd.frameW, sd.frameH, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
            } else {
                ctx.drawImage(img, sx, 0, sd.frameW, sd.frameH, dx - drawSize / 2, dy - drawSize / 2, drawSize, drawSize);
            }
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(dx, dy, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#e74c3c'; ctx.fill();
        }

        // can barı
        const barW = this.radius * 2;
        const barH = 4;
        const bx = dx - this.radius;
        const by = dy - this.radius - 8;
        ctx.fillStyle = '#555';
        ctx.fillRect(bx, by, barW, barH);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(bx, by, barW * (this.health / this.maxHealth), barH);
    };


    update(ctx, camera, player) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;

        const dist = Math.hypot(player.x - this.x, player.y - this.y);
        if (dist < player.radius + this.radius) {
            if (Date.now() - this.lastAttackTime > this.attackCooldown) {
                player.takeDamage(this.damage);
                this.lastAttackTime = Date.now();
            }
        }

        this.animTimer += 16;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            if (this.spriteData) {
                this.animFrame = (this.animFrame + 1) % this.spriteData.frames;
            }
        }
        this.facingLeft = player.x < this.x;

        this.draw(ctx, camera);
    };
}