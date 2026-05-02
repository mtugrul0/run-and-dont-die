/**
 * TODO: UpgradeSystem.js
 * Responsibility: Level-up upgrade card system — manage UPGRADE_POOL, randomly select 3 cards on level-up,
 *                 draw card overlay, handle card click selection, apply stat upgrades.
 * Imports from: config.js (UPGRADE_POOL)
 * Exports: UpgradeSystem (class or object with triggerUpgradeCards, drawCards, handleCardClick methods)
 *
 * Migration notes:
 *   - Lines 436-500 of game.js → UPGRADE_POOL, triggerUpgradeCards(), drawCards(), handleCardClick()
 *   - Line 446 getXpRadius() helper — keep here or move to config.js
 *   - availableCards state (line 15) lives here
 *   - UPGRADE_POOL.apply() lambdas reference player directly — inject player reference
 *   - Sets isPaused = true/false — inject GameState
 *   - drawCards() uses ctx, canvas dimensions — pass as parameters
 */
