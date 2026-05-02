/**
 * TODO: Player.js
 * Responsibility: Player entity — movement (WASD), melee fan attack, ranged projectile attack,
 *                 XP collection + level-up trigger, damage handling, inventory management, mad-buff state.
 * Imports from: config.js (CLASS_STATS, MAP_WIDTH, MAP_HEIGHT, XP_COLLECT_RADIUS)
 * Exports: Player class
 *
 * Migration notes:
 *   - Lines 53-208 of game.js → entire Player class
 *   - draw() uses ctx and camera directly — pass them as parameters or via a shared render context
 *   - attack() references enemies[] and projectiles[] — inject via GameState or constructor
 *   - gainXp() calls triggerUpgradeCards() — inject callback or use event emitter
 *   - takeDamage() sets isPaused directly — decouple via callback
 */
