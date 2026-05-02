/**
 * TODO: ExperienceOrb.js
 * Responsibility: XP orb entity — magnetic pull toward player when within XP_COLLECT_RADIUS,
 *                 carries XP value for player levelling.
 * Imports from: config.js (XP_COLLECT_RADIUS)
 * Exports: ExperienceOrb class
 *
 * Migration notes:
 *   - Lines 408-434 of game.js → entire ExperienceOrb class
 *   - update() references player.x/y — inject via GameState
 *   - Uses getXpRadius() helper (line 446) — migrate that helper here or keep in config.js
 *   - draw() uses ctx, camera — pass as parameters
 */
