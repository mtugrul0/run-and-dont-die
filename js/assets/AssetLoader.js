/**
 * TODO: AssetLoader.js
 * Responsibility: Load all image and audio assets asynchronously using Promises.
 *                 Provide a single loadAll() function that resolves when every asset is ready.
 *                 Export the loaded asset map so other modules can reference sprites/sounds by key.
 * Imports from: (none)
 * Exports: loadAllAssets() → Promise<AssetMap>, assets (loaded image/audio references)
 *
 * Implementation notes:
 *   - This is NEW functionality — no equivalent exists in game.js monolith
 *   - Use new Image() + onload/onerror wrapped in Promise for each sprite sheet
 *   - Use new Audio() + canplaythrough event for audio files
 *   - Asset manifest should list all files in assets/images/ and assets/audio/
 *   - main.js should await loadAllAssets() before starting the game loop
 */
