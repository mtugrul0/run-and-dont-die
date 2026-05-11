/**
 * TODO: CollisionSystem.js
 * Responsibility: Centralised collision detection and resolution for all entity interactions:
 *   - Projectile ↔ Enemy: damage + destroy projectile + handle enemy death → spawn XP orb
 *   - Player ↔ ExperienceOrb: collect XP on contact
 *   - Drone ↔ ExperienceOrb: collect XP in gather mode
 *   - Player ↔ WeaponDrop: pickup weapon or add ammo
 *   - Enemy ↔ Zone (safe): repel enemy outward
 *   - Player ↔ Zone (mad): apply madBuff flag
 * Imports from: entities/ExperienceOrb.js (for spawning orbs on kill)
 * Exports: CollisionSystem (class or object with update(gameState) method)
 *
 * Migration notes:
 *   - Lines 688-700 of game.js  → zone interactions (player mad buff + safe zone check)
 *   - Lines 702-716 of game.js  → weapon pickup logic
 *   - Lines 722-740 of game.js  → projectile-enemy collision loop
 *   - Lines 742-758 of game.js  → XP orb collection (player contact + drone gather mode)
 *   - Lines 761-774 of game.js  → safe zone enemy repulsion + conditional enemy update
 *   - handleEnemyDeath() helper (lines 636-639) → move here
 */

import { ExperienceOrb } from '../entities/ExperienceOrb.js';
import { XP_COLLECT_RADIUS } from '../config.js';

/**
 * @param {object} enemy
 * @param {number} index  
 * @param {object[]} enemies 
 * @param {object[]} orbs 
 */

function handleEnemyDeath(enemy, index, enemies, orbs) {
    orbs.push(new ExperienceOrb(enemy.x, enemy.y, 10));
    enemies.splice(index, 1);
}

function update(gameState) {
    const { player, drone, enemies, projectiles, orbs, zones, weaponDrops, MAP_WIDTH, MAP_HEIGHT, ctx, camera } = gameState;
    player.madBuff = false;
    for (let i = zones.length - 1; i >= 0; i--) {
        zones[i].update(ctx, camera);
        if (zones[i].timer <= 0) { zones.splice(i, 1); continue; }

        const dz = Math.hypot(player.x - zones[i].x, player.y - zones[i].y);
        if (dz < zones[i].radius && zones[i].type === 'mad') {
            player.madBuff = true;
        }
    }

    for (let i = weaponDrops.length - 1; i >= 0; i--) {
        weaponDrops[i].update(ctx, camera);
        if (weaponDrops[i].timer <= 0) { weaponDrops.splice(i, 1); continue; }

        if (Math.hypot(player.x - weaponDrops[i].x, player.y - weaponDrops[i].y) < player.radius + weaponDrops[i].radius) {
            const found = player.inventory.find(w => w.type === weaponDrops[i].type);
            if (found) {
                found.ammo += 20;
            } else if (player.inventory.length < player.maxSlots) {
                player.inventory.push({ type: weaponDrops[i].type, isMelee: false, ammo: 30 });
            }
            weaponDrops.splice(i, 1);
        }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].update(ctx, camera);

        if (projectiles[i].x < 0 || projectiles[i].x > MAP_WIDTH ||
            projectiles[i].y < 0 || projectiles[i].y > MAP_HEIGHT) {
            projectiles.splice(i, 1);
            continue;
        }

        let hit = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (Math.hypot(projectiles[i].x - enemies[j].x, projectiles[i].y - enemies[j].y) <
                projectiles[i].radius + enemies[j].radius) {
                enemies[j].health -= projectiles[i].damage;
                if (enemies[j].health <= 0) handleEnemyDeath(enemies[j], j, enemies, orbs);
                projectiles.splice(i, 1);
                hit = true;
                break;
            }
        }
        if (hit) continue;
    }

    const xpRadius = XP_COLLECT_RADIUS + (player._xpBonus || 0);
    for (let i = orbs.length - 1; i >= 0; i--) {
        orbs[i].update(ctx, camera, player.x, player.y, xpRadius);

        const distD = Math.hypot(drone.x - orbs[i].x, drone.y - orbs[i].y);
        if (drone.mode === 1 && distD < drone.radius + 10) {
            player.gainXp(orbs[i].value);
            orbs.splice(i, 1);
            continue;
        }

        const distP = Math.hypot(player.x - orbs[i].x, player.y - orbs[i].y);
        if (distP < player.radius + orbs[i].radius) {
            player.gainXp(orbs[i].value);
            orbs.splice(i, 1);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        let inSafe = false;
        zones.forEach(z => {
            if (z.type === 'safe' && Math.hypot(enemies[i].x - z.x, enemies[i].y - z.y) < z.radius) {
                inSafe = true;
                const angle = Math.atan2(enemies[i].y - z.y, enemies[i].x - z.x);
                enemies[i].x += Math.cos(angle) * 2.5;
                enemies[i].y += Math.sin(angle) * 2.5;
            }
        });
        if (!inSafe) {
            enemies[i].update(ctx, camera, player);
        } else {
            enemies[i].draw(ctx, camera);
        }
    }
}

export const CollisionSystem = { update, handleEnemyDeath };
