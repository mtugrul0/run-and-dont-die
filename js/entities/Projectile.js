/**
 * TODO: Projectile.js
 * Responsibility: Projectile entity — velocity-based linear movement, drawn as cyan circle,
 *                 carries damage value for collision resolution.
 * Imports from: (none)
 * Exports: Projectile class
 *
 * Migration notes:
 *   - Lines 269-286 of game.js → entire Projectile class
 *   - draw() uses ctx, camera — pass as parameters
 *   - Collision detection is handled externally by CollisionSystem, not inside this class
 */
export class Projectile {
    constructor(x, y, velocity, damage) {
        this.x = x; 
        this.y = y;
        this.radius = 4;
        this.velocity = velocity;
        this.damage = damage;
    }
    draw(ctx,camera) {
        ctx.beginPath();
        ctx.arc(this.x - camera.x, this.y - camera.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'cyan'; ctx.fill();
    }
    update(ctx, camera) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw(ctx,camera);
    }
}