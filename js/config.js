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
