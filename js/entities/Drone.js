/**
 * TODO: Drone.js
 * Responsibility: Companion drone entity — 3 modes (heal / collect-XP / attack),
 *                 follows owner with lerp, fires projectiles in attack mode.
 * Imports from: entities/Projectile.js
 * Exports: Drone class
 *
 * Migration notes:
 *   - Lines 211-266 of game.js → entire Drone class
 *   - References orbs[] and enemies[] arrays — inject via GameState
 *   - Creates Projectile instances — import Projectile class
 *   - draw() uses ctx, camera — pass as parameters
 */
