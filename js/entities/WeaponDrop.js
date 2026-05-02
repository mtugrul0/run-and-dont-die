/**
 * TODO: WeaponDrop.js
 * Responsibility: Weapon pickup entity — timed item drop with 3 ranged weapon types (pompali, taramali, sniper);
 *                 renders glowing icon with type abbreviation.
 * Imports from: (none)
 * Exports: WeaponDrop class
 *
 * Migration notes:
 *   - Lines 322-358 of game.js → entire WeaponDrop class
 *   - draw() uses ctx, camera — pass as parameters
 *   - Pickup logic (lines 702-716 of game.js) should live in CollisionSystem, not here
 */
