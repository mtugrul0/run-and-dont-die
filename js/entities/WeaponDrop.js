/**
 * WeaponDrop.js
 * Responsibility: Weapon pickup entity — timed item drop with 3 ranged weapon types (pompali, taramali, sniper);
 *                 renders weapon sprite image with glow effect.
 * Imports from: assets/AssetLoader.js
 * Exports: WeaponDrop class
 */
import { assets } from '../assets/AssetLoader.js';

const WEAPON_IMAGE_KEY = {
    pompali: 'weapon_pompali',
    taramali: 'weapon_taramali',
    sniper: 'weapon_sniper'
};

export class WeaponDrop {
    constructor(x, y, type) {
        this.x = x; 
        this.y = y;
        this.radius = 14;
        this.type = type;
        this.timer = 10000;
        this.lastTime = Date.now();
        this._bobTimer = 0;
    };

    draw(ctx, camera) {
        const dx = this.x - camera.x;
        const dy = this.y - camera.y;

        // Yukarı-aşağı sallanma efekti
        this._bobTimer += 0.05;
        const bobOffset = Math.sin(this._bobTimer) * 3;

        const imgKey = WEAPON_IMAGE_KEY[this.type];
        const img = imgKey ? assets.images[imgKey] : null;

        if (img) {
            // Parlama efekti
            ctx.save();
            ctx.shadowColor = '#ff8c00';
            ctx.shadowBlur = 16;

            // Silah görselini çiz
            const drawW = 48;
            const drawH = 24;
            ctx.drawImage(img, dx - drawW / 2, dy - drawH / 2 + bobOffset, drawW, drawH);
            ctx.restore();

            // Dış halka (zamanlayıcı göstergesi)
            const timerRatio = Math.max(0, this.timer / 10000);
            ctx.beginPath();
            ctx.arc(dx, dy + bobOffset, this.radius + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * timerRatio);
            ctx.strokeStyle = `rgba(255, 165, 0, ${0.3 + timerRatio * 0.4})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Silah adı
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.type.toUpperCase(), dx, dy + this.radius + 16 + bobOffset);
        } else {
            // Fallback: eski turuncu daire çizimi
            ctx.beginPath();
            ctx.arc(dx, dy, this.radius + 4, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 165, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(dx, dy, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ff8c00';
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            const short = { pompali: 'PMP', taramali: 'TAR', sniper: 'SNP' };
            ctx.fillText(short[this.type] || 'SLH', dx, dy + 3);

            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '11px Arial';
            ctx.fillText(this.type, dx, dy + this.radius + 14);
        }
    };

    update(ctx, camera) {
        this.timer -= (Date.now() - this.lastTime);
        this.lastTime = Date.now();
        this.draw(ctx, camera);
    };
}