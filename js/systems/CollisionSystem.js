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
