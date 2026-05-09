/**
 * TODO: Zone.js
 * Responsibility: Zone entity — two types: 'safe' (repels enemies) and 'mad' (buffs player speed/damage);
 *                 timer-based lifetime with countdown display.
 * Imports from: (none)
 * Exports: Zone class
 *
 * Migration notes:
 *   - Lines 288-319 of game.js → entire Zone class
 *   - draw() uses ctx, camera — pass as parameters
 *   - Zone interaction logic (safe repel + mad buff) is in main loop lines 688-700 — move to CollisionSystem
 */
export class Zone {
    constructor(x, y, type) {
        this.x = x; 
        this.y = y;
        this.radius = 150;
        this.type = type;
        this.timer = 5000;
        this.lastTime = Date.now();
    };

    draw(ctx, camera) {
        const dx = this.x - camera.x;
        const dy = this.y - camera.y;
        ctx.beginPath();
        ctx.arc(dx, dy, this.radius, 0, Math.PI * 2);
        // Safe: yeşil, Mad: mor (artık oyuncuya faydalı)
        ctx.fillStyle = this.type === 'safe' ? 'rgba(46, 204, 113, 0.25)' : 'rgba(155, 89, 182, 0.3)';
        ctx.fill();
        ctx.strokeStyle = this.type === 'safe' ? '#2ecc71' : '#9b59b6';
        ctx.lineWidth = 2; ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = '13px Arial';
        ctx.textAlign = 'center';
        const label = this.type === 'safe' ? '🛡 Güvenli' : '⚡ Güç Bölgesi';
        ctx.fillText(label, dx, dy - this.radius - 6);
        ctx.fillText(`${(this.timer / 1000).toFixed(1)}s`, dx, dy);
    };

    update(ctx, camera) {
        const now = Date.now();
        this.timer -= (now - this.lastTime);
        this.lastTime = now;
        this.draw(ctx, camera);
    };
}