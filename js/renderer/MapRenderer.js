/**
 * TODO: MapRenderer.js
 * Responsibility: Render the game world background — dark fill, grid lines, 
 *                 red border walls,
 *                 and translucent warning overlays near map edges.
 * Imports from: config.js (MAP_WIDTH, MAP_HEIGHT)
 * Exports: drawMap(ctx, camera, canvas) function
 *
 * Migration notes:
 *   - Lines 502-549 of game.js → entire drawMap() function
 *   - Uses MAP_WIDTH, MAP_HEIGHT, camera, ctx, canvas — all should be passed as parameters
 */

import { MAP_WIDTH, MAP_HEIGHT } from '../config.js'; 
import { assets } from '../assets/AssetLoader.js';

export function drawMap(ctx, camera, canvas) {
    // Harita arka planı 
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);  
    // Zemin texture'ı — harita boyunca tekrarla (tile)
    if (assets.images.map_floor) {
    const tileSize = 512; // texture boyutu
    const startX = Math.floor(camera.x / tileSize) * tileSize;
    const startY = Math.floor(camera.y / tileSize) * tileSize;
    
    for (let x = startX; x < camera.x + canvas.width; x += tileSize) {
        for (let y = startY; y < camera.y + canvas.height; y += tileSize) {
            if (x > MAP_WIDTH || y > MAP_HEIGHT || x + tileSize < 0 || y + tileSize < 0) continue;
            ctx.drawImage(assets.images.map_floor, x - camera.x, y - camera.y, tileSize, tileSize);
            }   
        }
    }

    // Izgara çizgileri
    const gridSize = 100;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const startGX = Math.floor(camera.x / gridSize) * gridSize;
    const startGY = Math.floor(camera.y / gridSize) * gridSize;

    //Dikey Grid
    for (let gx = startGX; gx < camera.x + canvas.width; gx += gridSize) {
        if (gx < 0 || gx > MAP_WIDTH) continue;
        ctx.beginPath();
        ctx.moveTo(gx - camera.x, Math.max(0, -camera.y));
        ctx.lineTo(gx - camera.x, Math.min(canvas.height, MAP_HEIGHT - camera.y));
        ctx.stroke();
    }
    //Yatay Grid
    for (let gy = startGY; gy < camera.y + canvas.height; gy += gridSize) {
        if (gy < 0 || gy > MAP_HEIGHT) continue;
        ctx.beginPath();
        ctx.moveTo(Math.max(0, -camera.x), gy - camera.y);
        ctx.lineTo(Math.min(canvas.width, MAP_WIDTH - camera.x), gy - camera.y);
        ctx.stroke();
    }

    // Harita sınır duvarı
    const bx = -camera.x;
    const by = -camera.y;
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 6;
    ctx.strokeRect(bx, by, MAP_WIDTH, MAP_HEIGHT);

    // Köşelerde uyarı levhası efekti
    ctx.fillStyle = 'rgba(231, 76, 60, 0.15)';
    const warnW = 40;
    // Sol duvar
    if (bx > -warnW && bx < canvas.width) ctx.fillRect(bx, by, warnW, MAP_HEIGHT);
    // Sağ duvar
    const rx = bx + MAP_WIDTH - warnW;
    if (rx > 0 && rx < canvas.width) ctx.fillRect(rx, by, warnW, MAP_HEIGHT);
    // Üst duvar
    if (by > -warnW && by < canvas.height) ctx.fillRect(bx, by, MAP_WIDTH, warnW);
    // Alt duvar
    const ry = by + MAP_HEIGHT - warnW;
    if (ry > 0 && ry < canvas.height) ctx.fillRect(bx, ry, MAP_WIDTH, warnW);
}



