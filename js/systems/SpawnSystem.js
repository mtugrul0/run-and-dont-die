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
