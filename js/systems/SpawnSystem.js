/**
 * TODO: SpawnSystem.js
 * Responsibility: Manage enemy and item (zone/weapon) spawn logic — enemy wave spawner (setInterval-based),
 *                 item spawner (requestAnimationFrame-based with luck-scaled cooldown).
 * Imports from: config.js (MAP_WIDTH, MAP_HEIGHT), entities/Enemy.js, entities/Zone.js, entities/WeaponDrop.js
 * Exports: SpawnSystem (class or object with start/stop/update methods)
 *
 * Migration notes:
 *   - Lines 641-656 of game.js → enemy spawner (setInterval, 1000ms, offscreen spawn around camera viewport)
 *   - Lines 658-675 of game.js → item spawner (rAF loop, 8000/luck cooldown, 25% safe zone, 25% mad zone, 50% weapon)
 *   - Both check isPaused — inject GameState or accept paused flag
 *   - Both push into enemies[], zones[], weaponDrops[] — inject those arrays
 */

import { MAP_WIDTH, MAP_HEIGHT, WEAPON_TYPES } from '../config.js';
import { Enemy } from '../entities/Enemy.js';
import { Zone } from '../entities/Zone.js';
import { WeaponDrop } from '../entities/WeaponDrop.js';

export class SpawnSystem {
    /**
     * @param {object}   deps
     * @param {object}   deps.gameState   
     * @param {object}   deps.camera        
     * @param {object}   deps.canvas        
     * @param {object[]} deps.enemies       
     * @param {object[]} deps.zones        
     * @param {object[]} deps.weaponDrops   
     */

    constructor({ gameState, camera, canvas, enemies, zones, weaponDrops }) {
        this._gameState = gameState;
        this._camera = camera;
        this._canvas = canvas;
        this._enemies = enemies;
        this._zones = zones;
        this._weaponDrops = weaponDrops;

        this._enemyIntervalId = null;
        this._itemRafId = null;
        this._lastSpawnTime = Date.now();
    }

    start() {
        if (this._enemyIntervalId === null) {
            this._enemyIntervalId = setInterval(() => this._spawnEnemy(), 1000);
        }
        if (this._itemRafId === null) {
            this._scheduleItemSpawn();
        }
    }

    stop() {
        if (this._enemyIntervalId !== null) {
            clearInterval(this._enemyIntervalId);
            this._enemyIntervalId = null;
        }
        if (this._itemRafId !== null) {
            cancelAnimationFrame(this._itemRafId);
            this._itemRafId = null;
        }
    }

    _spawnEnemy() {
        if (this._gameState.isPaused) return;

        const { _camera: cam, _canvas: cvs } = this;
        const margin = 60;
        const side = Math.floor(Math.random() * 4);
        let x, y;

        if (side === 0) { x = cam.x + Math.random() * cvs.width; y = cam.y - margin; }
        else if (side === 1) { x = cam.x + Math.random() * cvs.width; y = cam.y + cvs.height + margin; }
        else if (side === 2) { x = cam.x - margin; y = cam.y + Math.random() * cvs.height; }
        else { x = cam.x + cvs.width + margin; y = cam.y + Math.random() * cvs.height; }

        x = Math.max(0, Math.min(MAP_WIDTH, x));
        y = Math.max(0, Math.min(MAP_HEIGHT, y));

        const playerLevel = this._gameState.player ? this._gameState.player.level : 0;
        const r = Math.random(); // 0 ile 1 arasında rastgele bir sayı
        let type = 'flying_eye'; // Varsayılan 1. düşman
        if (playerLevel < 5) {
            // Level 0-4 arası: %80 Uçan Göz(1), %20 Goblin(2)
            if (r < 0.80) type = 'flying_eye';
            else type = 'goblin';

        } else if (playerLevel < 10) {
            // Level 5-9 arası: %40 Uçan Göz(1), %40 Goblin(2), %20 Mantar(3)
            if (r < 0.40) type = 'flying_eye';
            else if (r < 0.80) type = 'goblin';
            else type = 'mushroom';

        } else if (playerLevel < 15) {
            // Level 10-14 arası: %20 Uçan Göz(1), %30 Goblin(2), %30 Mantar(3), %20 İskelet(4)
            if (r < 0.20) type = 'flying_eye';
            else if (r < 0.50) type = 'goblin';
            else if (r < 0.80) type = 'mushroom';
            else type = 'skeleton';

        } else {
            // Level 15 ve üstü: %10(1), %20(2), %30(3), %40(4) (Zor mod)
            if (r < 0.10) type = 'flying_eye';
            else if (r < 0.30) type = 'goblin';
            else if (r < 0.60) type = 'mushroom';
            else type = 'skeleton';
        }
        this._enemies.push(new Enemy(x, y, type));

    }

    _spawnItemFrame() {
        const gs = this._gameState;
        const p = gs.player;

        if (!p || gs.isPaused) { this._scheduleItemSpawn(); return; }

        if (Date.now() - this._lastSpawnTime > (8000 / p.stats.luck)) {
            const x = Math.max(50, Math.min(MAP_WIDTH - 50, p.x + (Math.random() * 800 - 400)));
            const y = Math.max(50, Math.min(MAP_HEIGHT - 50, p.y + (Math.random() * 800 - 400)));
            const r = Math.random();

            if (r < 0.25) this._zones.push(new Zone(x, y, 'safe'));
            else if (r < 0.50) this._zones.push(new Zone(x, y, 'mad'));
            else
                this._weaponDrops.push(
                    new WeaponDrop(x, y, WEAPON_TYPES[Math.floor(Math.random() * WEAPON_TYPES.length)])
                );

            this._lastSpawnTime = Date.now();
        }

        this._scheduleItemSpawn();
    }

    _scheduleItemSpawn() {
        this._itemRafId = requestAnimationFrame(() => this._spawnItemFrame());
    }
}
