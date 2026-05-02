/**
 * TODO: Zone.js
 * Responsibility: Zone entity — two types: 'safe' (repels enemies) and 'mad' (buffs player speed/damage);
 *                 timer-based lifetime with countdown display.
 * Imports from: (none)
 * Exports: Zone class
 *
 * Migration notes:
 *   - Lines 288-319 of game.js → entire Zone class
 *   - draw() uses ctx, camera — pass as parameters
 *   - Zone interaction logic (safe repel + mad buff) is in main loop lines 688-700 — move to CollisionSystem
 */
