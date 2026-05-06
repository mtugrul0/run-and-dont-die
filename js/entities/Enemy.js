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
export class Enemy {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.radius = 12;
        this.speed = 1.2;
        this.health = 15;
        this.maxHealth = 15;
        this.damage = 1; 
        this.lastAttackTime = 0;
        this.attackCooldown = 800; // ms
    };
    
    draw(ctx, camera) {
        const dx = this.x - camera.x;
        const dy = this.y - camera.y;

        ctx.beginPath();
        ctx.arc(dx, dy, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c'; ctx.fill();

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

        this.draw(ctx, camera);
    };
}