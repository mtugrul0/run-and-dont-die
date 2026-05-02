/**
 * TODO: UIRenderer.js
 * Responsibility: Render all HUD elements — health bar, XP bar, level text, drone mode label,
 *                 inventory slots with weapon info, enemy count, mad-buff indicator.
 *                 Future: minimap (small rectangle in corner showing player + enemy dots).
 * Imports from: (none — receives all data as parameters)
 * Exports: drawUI(ctx, canvas, player, drone, enemies) function
 *
 * Migration notes:
 *   - Lines 551-625 of game.js → entire drawUI() function
 *   - References player (health, maxHealth, xp, level, madBuff, inventory, currentSlot, maxSlots)
 *   - References drone.mode
 *   - References enemies.length
 *   - All should be passed as parameters
 *   - Future: add drawMinimap() — shows scaled-down MAP with player dot + enemy dots + zone circles
 */
