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
export const XP_COLLECT_RADIUS = 50;

export const CLASS_STATS = {
    ninja: { color: '#a0e0ff', attackRange: 120, attackSpread: Math.PI / 2, maxHealth: 3, speed: 4.5, damage: 15, fireRate: 250, luck: 1.0, startWeapon: 'Katana' },
    wizard: { color: '#f0c070', attackRange: 200, attackSpread: 0.25, maxHealth: 4, speed: 4.0, damage: 10, fireRate: 150, luck: 1.0, startWeapon: 'Asa' },
    king: { color: '#ff6b6b', attackRange: 70, attackSpread: Math.PI / 1.5, maxHealth: 5, speed: 3.5, damage: 25, fireRate: 400, luck: 1.0, startWeapon: 'Kılıç' },
};

export const ENEMY_STATS = {
    flying_eye: { health: 20, speed: 2.0, damage: 1, radius: 12 },
    goblin:     { health: 25, speed: 1.5, damage: 2, radius: 14 },
    mushroom:   { health: 35, speed: 1.0, damage: 3, radius: 16 },
    skeleton:   { health: 50, speed: 0.8, damage: 4, radius: 18 }
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


export const SPRITE_DATA = {
    ninja: {
        frameW: 200, frameH: 200, scale: 15,
        idle: { key: 'ninja_idle', frames: 8 },
        run: { key: 'ninja_run', frames: 8 },
        attack: { key: 'ninja_attack1', frames: 6 },
        death: { key: 'ninja_death', frames: 6 },
        hit: { key: 'ninja_hit', frames: 4 },
    },
    wizard: {
        frameW: 231, frameH: 190, scale: 12,
        idle: { key: 'wizard_idle', frames: 6 },
        run: { key: 'wizard_run', frames: 8 },
        attack: { key: 'wizard_attack1', frames: 8 },
        death: { key: 'wizard_death', frames: 7 },
        hit: { key: 'wizard_hit', frames: 4 },
    },
    king: {
        frameW: 155, frameH: 155, scale: 12,
        idle: { key: 'king_idle', frames: 6 },
        run: { key: 'king_run', frames: 8 },
        attack: { key: 'king_attack1', frames: 6 },
        death: { key: 'king_death', frames: 11 },
        hit: { key: 'king_hit', frames: 4 },
    },
};

export const ENEMY_SPRITE_DATA = {
    flying_eye: { key: 'enemy_flying_eye', frameW: 150, frameH: 150, frames: 6, scale: 20 },
    goblin: { key: 'enemy_goblin', frameW: 150, frameH: 150, frames: 12, scale: 20 },
    mushroom: { key: 'enemy_mushroom', frameW: 150, frameH: 150, frames: 11, scale: 15 },
    skeleton: { key: 'enemy_skeleton', frameW: 150, frameH: 150, frames: 6, scale: 20 },
};

