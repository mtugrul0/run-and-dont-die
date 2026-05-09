/**
 * TODO: Drone.js
 * Responsibility: Companion drone entity — 3 modes (heal / collect-XP / attack),
 *                 follows owner with lerp, fires projectiles in attack mode.
 * Imports from: entities/Projectile.js
 * Exports: Drone class
 *
 * Migration notes:
 *   - Lines 211-266 of game.js → entire Drone class
 *   - References orbs[] and enemies[] arrays — inject via GameState
 *   - Creates Projectile instances — import Projectile class
 *   - draw() uses ctx, camera — pass as parameters
 */
import {Projectile} from "./Projectile.js"
export class Drone {
    constructor(owner, deps) {
        this.owner = owner;
        this.x = owner.x; 
        this.y = owner.y;
        this.radius = 8;
        this.mode = 0;
        this.actionTimer = Date.now();

        this._orbs        = deps.orbs;
        this._enemies     = deps.enemies;
        this._projectiles = deps.projectiles;

    };

    changeMode() { 
        this.mode = (this.mode + 1) % 3; 
    };

    draw(ctx, camera) {
        const dx = this.x - camera.x;
        const dy = this.y - camera.y;
        ctx.beginPath();
        ctx.arc(dx, dy, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.mode === 0 ? '#2ecc71' : (this.mode === 1 ? '#f1c40f' : '#e74c3c');
        ctx.fill();
        ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    update(ctx, camera) {
        let targetX = this.owner.x - 40;
        let targetY = this.owner.y - 40;

        if (this.mode === 0 && Date.now() - this.actionTimer > 3000) {
            if (this.owner.health < this.owner.maxHealth) {
                this.owner.health++;
                this.actionTimer = Date.now();
            }
        } else if (this.mode === 1 && this._orbs.length > 0) {
            let closest = this._orbs[0];
            let minDist = Math.hypot(closest.x - this.x, closest.y - this.y);
            for (let orb of this._orbs) {
                const d = Math.hypot(orb.x - this.x, orb.y - this.y);
                if (d < minDist) { minDist = d; closest = orb; }
            }
            targetX = closest.x; targetY = closest.y;
        } else if (this.mode === 2 && this._enemies.length > 0 && Date.now() - this.actionTimer > 1500) {
            let closest = this._enemies[0];
            let minDist = Math.hypot(closest.x - this.x, closest.y - this.y);
            for (let enemy of this._enemies) {
                const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                if (d < minDist) { minDist = d; closest = enemy; }
            }
            if (minDist < 400) {
                const angle = Math.atan2(closest.y - this.y, closest.x - this.x);
                this._projectiles.push(new Projectile(this.x, this.y, { x: Math.cos(angle) * 6, y: Math.sin(angle) * 6 }, 5));
                this.actionTimer = Date.now();
            }
        }

        this.x += (targetX - this.x) * 0.05;
        this.y += (targetY - this.y) * 0.05;
        this.draw(ctx,camera);
    }
}