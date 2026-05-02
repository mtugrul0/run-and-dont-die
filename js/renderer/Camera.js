/**
 * TODO: Camera.js
 * Responsibility: Camera object — stores world-space offset (x, y), provides follow(target) method
 *                 to center viewport on the player each frame.
 * Imports from: (none)
 * Exports: Camera class (or plain object with x, y, follow method)
 *
 * Migration notes:
 *   - Line 13 of game.js          → camera = { x: 0, y: 0 }
 *   - Lines 121-122 of game.js    → camera follow logic inside Player.update():
 *       camera.x = this.x - canvas.width / 2;
 *       camera.y = this.y - canvas.height / 2;
 *   - Extract follow logic here so Player no longer directly mutates camera
 *   - Canvas dimensions needed for centering — pass as parameters or store reference
 */
