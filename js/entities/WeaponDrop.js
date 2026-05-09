/**
 * TODO: WeaponDrop.js
 * Responsibility: Weapon pickup entity — timed item drop with 3 ranged weapon types (pompali, taramali, sniper);
 *                 renders glowing icon with type abbreviation.
 * Imports from: (none)
 * Exports: WeaponDrop class
 *
 * Migration notes:
 *   - Lines 322-358 of game.js → entire WeaponDrop class
 *   - draw() uses ctx, camera — pass as parameters
 *   - Pickup logic (lines 702-716 of game.js) should live in CollisionSystem, not here
 */
export class WeaponDrop {
    constructor(x, y, type) {
        this.x = x; 
        this.y = y;
        this.radius = 14;
        this.type = type;
        this.timer = 10000;
        this.lastTime = Date.now();
    };

    draw(ctx,camera) {
        const dx = this.x - camera.x;
        const dy = this.y - camera.y;

        ctx.beginPath();
        ctx.arc(dx, dy, this.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.5)';
        ctx.lineWidth = 3; ctx.stroke();

        ctx.beginPath();
        ctx.arc(dx, dy, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff8c00'; ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        const short = { pompali: 'PMP', taramali: 'TAR', sniper: 'SNP' };
        ctx.fillText(short[this.type] || 'SLH', dx, dy + 3);

        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '11px Arial';
        ctx.fillText(this.type, dx, dy + this.radius + 14);
    };

    update(ctx,camera) {
        this.timer -= (Date.now() - this.lastTime);
        this.lastTime = Date.now();
        this.draw(ctx,camera);
    };
}