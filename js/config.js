/**
 * TODO: config.js
 * Responsibility: Central configuration — export all game constants, class stats, and upgrade pool data.
 * Imports from: (none — this is a leaf module)
 * Exports: MAP_WIDTH, MAP_HEIGHT, XP_COLLECT_RADIUS, CLASS_STATS, UPGRADE_POOL, WEAPON_TYPES
 *
 * Migration notes:
 *   - Lines 11-24 of game.js  → MAP_WIDTH, MAP_HEIGHT, CLASS_STATS, SELECTED_CLASS default
 *   - Line 17  of game.js     → XP_COLLECT_RADIUS
 *   - Lines 437-443 of game.js → UPGRADE_POOL (upgrade card definitions)
 *   - Weapon types (pompali/taramali/sniper) are inline in game.js:668 — extract here as WEAPON_TYPES array
 */

export const MAP_WIDTH = 3000;
export const MAP_HEIGHT = 3000;
export const XP_COLLECT_RADIUS = 120;

export const SELECTED_CLASS = 'ninja'; // Sonrasında açılış ekranında seçim yaptırmalıyız
export const CLASS_STATS = {
    ninja: {    color: '#a0e0ff',   attackRange: 120,   attackSpread: Math.PI / 2,   maxHealth: 3, speed: 4.5, damage: 15, fireRate: 250, luck: 1.2, startWeapon: 'Katana' },
    yeniceri: { color: '#ff6b6b',   attackRange: 70,    attackSpread: Math.PI / 1.5, maxHealth: 5, speed: 3.5, damage: 25, fireRate: 400, luck: 1.0, startWeapon: 'Tokat' },
    kovboy: {   color: '#f0c070',   attackRange: 200,   attackSpread: 0.1,           maxHealth: 4, speed: 4.0, damage: 10, fireRate: 150, luck: 1.5, startWeapon: 'Kement' }
};

export const UPGRADE_POOL = [
    {   
        title: "Can Yenile", 
        desc: "Tam can doldur", 
        apply: (player) => player.health = player.maxHealth 
    },
    { 
        title: "Maks Can+", 
        desc: "+1 Maksimum Can", 
        apply: (player) => { player.maxHealth++; player.health++; } 
    },
    { 
        title: "Hasar+", 
        desc: "+5 Hasar", 
        apply: (player) => player.stats.damage += 5 
    },
    { 
        title: "Hız+", 
        desc: "+0.5 Hareket Hızı", 
        apply: (player) => player.speed += 0.5 
    },
    { 
        title: "Şans+", 
        desc: "Daha çok eşya düşer", 
        apply: (player) => player.stats.luck += 0.3 
    },
    { 
        title: "XP Manyeti+", 
        desc: "Toplama menzili büyür", 
        apply: (player) => { player._xpBonus = (player._xpBonus || 0) + 30; } 
    }
];

export const WEAPON_TYPES = ['pompali', 'taramali', 'sniper'];