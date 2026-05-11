/**
 * TODO: UIRenderer.js
 * Responsibility: Render all HUD elements — health bar, XP bar, level text, drone mode label,
 *                 inventory slots with weapon info, enemy count, mad-buff indicator.
 *                 Future: minimap (small rectangle in corner showing player + enemy dots).
 * Imports from: (none — receives all data as parameters)
 * Exports: drawUI(ctx, canvas, player, drone, enemies) function
 *
 * Migration notes:
 *   - Lines 551-625 of game.js → entire drawUI() function
 *   - References player (health, maxHealth, xp, level, madBuff, inventory, currentSlot, maxSlots)
 *   - References drone.mode
 *   - References enemies.length
 *   - All should be passed as parameters
 *   - Future: add drawMinimap() — shows scaled-down MAP with player dot + enemy dots + zone circles
 */

import { MAP_WIDTH, MAP_HEIGHT } from "../config.js";

export function drawUI(ctx, canvas, player, drone, enemies) {
    // Can barı 
    const CanbarW = 200, CanbarH = 18;
    const barX = 20;
    const barY = 20;

    // Arka plan
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, CanbarW, CanbarH);

    // Dolu kısım
    const healthWidth = (player.health / player.maxHealth) * CanbarW;
    ctx.fillStyle = player.health / player.maxHealth > 0.3 ? '#e74c3c' : '#ff6b6b';
    ctx.fillRect(barX, barY, healthWidth, CanbarH);

    // Beyaz çerçeve
    ctx.strokeStyle = player.health / player.maxHealth > 0.3 ? 'white' : '#ff6b6b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barX, barY, CanbarW, CanbarH);

    // Can yazısı
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${player.health} / ${player.maxHealth}`, barX + CanbarW / 2, barY + 13);


    // XP barı
    const xpBarW = 200, xpBarH = 8;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY + CanbarH + 8, xpBarW, xpBarH);
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(barX, barY + CanbarH + 8, xpBarW * (player.xp / player.xpToNextLevel), xpBarH);
    
    // Beyaz çerçeve
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barX, barY + CanbarH + 8, xpBarW, xpBarH);

    ctx.textAlign = 'left';
    ctx.fillStyle = 'white'; ctx.font = '13px Arial';
    ctx.fillText(`Seviye ${player.level}`, barX, barY + CanbarH + xpBarH + 22);
 
    
    // Drone modu
    const modeNames = ['🟢 İyileşme', '🟡 Toplama', '🔴 Saldırı'];
    ctx.fillText(`Drone [Q]: ${modeNames[drone.mode]}`, barX, barY + CanbarH + xpBarH + 44);

    //Envanter 
    const slotSize = 40;
    const slotGap = 10;
    const totalW = player.maxSlots * (slotSize + slotGap) - slotGap;
    const startIX = (canvas.width - totalW) / 2;
    const startIY = canvas.height - slotSize - 20;

    for (let i = 0; i < player.maxSlots; i++) {
        const sx = startIX + i * (slotSize + slotGap);
        const weapon = player.inventory[i];
        const isSelected = i === player.currentSlot;

        ctx.fillStyle = isSelected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0,0,0,0.5)';
        ctx.fillRect(sx, startIY, slotSize, slotSize);
        ctx.strokeStyle = isSelected ? 'gold' : 'rgba(255,255,255,0.3)';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeRect(sx, startIY, slotSize, slotSize);

        ctx.textAlign = 'center';
        if (weapon) {
            ctx.fillStyle = 'white'; ctx.font = 'bold 11px Arial';
            ctx.fillText(weapon.type, sx + slotSize / 2, startIY + 24);
            ctx.fillStyle = weapon.isMelee ? '#aaa' : '#f1c40f';
            ctx.font = '10px Arial';
            ctx.fillText(weapon.isMelee ? '∞' : weapon.ammo, sx + slotSize / 2, startIY + 40);
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillText(i + 1, sx + slotSize / 2, startIY + slotSize / 2 + 4);
        }
    }

    // Düşman sayısı
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '13px Arial';
    ctx.fillText(`Düşman: ${enemies.length}`, canvas.width - 20, 30);

    // Mad buff göstergesi
    if (player.madBuff) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('⚡ GÜÇ BÖLGE BUFFI AKTİF ⚡', canvas.width / 2, canvas.height - 100);
    }

    drawMinimap(ctx, canvas, player, enemies, [], []);
}
//Minimap 
    export function drawMinimap(ctx, canvas, player, enemies, zones, weapons) {
        const minimapW = 200;
        const minimapH = 200;
        const minimapX = canvas.width - minimapW - 20;
        const minimapY = canvas.height - minimapH - 20;
        const scaleX  = minimapW / MAP_WIDTH;
        const scaleY  = minimapH / MAP_HEIGHT;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(minimapX, minimapY, minimapW, minimapH);

        // Bölgeler
        zones.forEach(zone => {
            ctx.strokeStyle = zone.type === 'safe' ? 'rgba(46, 204, 113, 0.7)' : 'rgba(155, 89, 182, 0.7)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(minimapX + zone.x * scaleX, minimapY + zone.y * scaleY, zone.radius * scaleX, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Silahlar
        weapons.forEach(weapon => {
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(minimapX + weapon.x * scaleX - 3, minimapY + weapon.y * scaleY - 3, 6, 6);
        });

        // Düşmanlar
        enemies.forEach(enemy => {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(minimapX + enemy.x * scaleX - 4, minimapY + enemy.y * scaleY - 4, 8, 8);
        });

        // Oyuncu
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(minimapX + player.x * scaleX, minimapY + player.y * scaleY, 6, 0, Math.PI * 2);
        ctx.fill();

        // en sona ekle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(minimapX, minimapY, minimapW, minimapH);

    }