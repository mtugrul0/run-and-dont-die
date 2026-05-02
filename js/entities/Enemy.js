/**
 * TODO: Enemy.js
 * Responsibility: Enemy entity — tracks player position, melee damage on contact with cooldown,
 *                 health bar rendering, death handling.
 * Imports from: (none directly, receives player reference via GameState)
 * Exports: Enemy class
 *
 * Migration notes:
 *   - Lines 361-406 of game.js → entire Enemy class
 *   - update() references player.x/y for tracking — inject player reference
 *   - Collision with player (lines 396-402) calls player.takeDamage() — keep as-is with injected ref
 *   - draw() uses ctx, camera — pass as parameters
 */
