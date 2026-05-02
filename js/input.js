/**
 * TODO: input.js
 * Responsibility: Centralised InputManager — capture and expose keyboard (WASD), mouse (position, click, button),
 *                 scroll wheel, and context-menu suppression state for other modules to read.
 * Imports from: (none)
 * Exports: InputManager (singleton object or class) with properties: keys, mouse, init(), destroy()
 *
 * Migration notes:
 *   - Lines 26-49 of game.js → key state object, mouse object, all addEventListener calls
 *   - The 'q' key for drone mode toggle should emit an event or callback rather than calling drone.changeMode() directly
 *   - Mouse wheel handler (lines 44-49) needs a way to notify Player of slot change
 *   - handleCardClick routing (line 37) should be moved to UpgradeSystem — input.js should only relay click coordinates
 */
