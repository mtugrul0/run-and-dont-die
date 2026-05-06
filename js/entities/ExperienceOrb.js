/**
 * TODO: ExperienceOrb.js
 * Responsibility: XP orb entity — magnetic pull toward player when within XP_COLLECT_RADIUS,
 *                 carries XP value for player levelling.
 * Imports from: config.js (XP_COLLECT_RADIUS)
 * Exports: ExperienceOrb class
 *
 * Migration notes:
 *   - Lines 408-434 of game.js → entire ExperienceOrb class
 *   - update() references player.x/y — inject via GameState
 *   - Uses getXpRadius() helper (line 446) — migrate that helper here or keep in config.js
 *   - draw() uses ctx, camera — pass as parameters
 */
import {XP_COLLECT_RADIUS} from "../config.js"

export class ExperienceOrb {
    constructor(x, y, val) {
        this.x = x; 
        this.y = y;
        this.radius = 5;
        this.value = val;
    };

    draw(ctx,camera) {
        const dx = this.x - camera.x;
        const dy = this.y - camera.y;
        ctx.beginPath();
        ctx.arc(dx, dy, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f1c40f'; ctx.fill();
        ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke();
    };

    update(ctx,camera, playerX, playerY, xpRadius = XP_COLLECT_RADIUS) {
        const dist = Math.hypot(playerX - this.x, playerY - this.y);
        if (dist < xpRadius) {
            const angle = Math.atan2(playerY - this.y, playerX - this.x);
            const pullSpeed = 5 + (xpRadius - dist) * 0.05;
            this.x += Math.cos(angle) * pullSpeed;
            this.y += Math.sin(angle) * pullSpeed;
        }
        this.draw(ctx, camera);
    };
}