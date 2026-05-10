/**
 * TODO: main.js
 * Responsibility: Application entry point — set up canvas, instantiate all game objects, wire modules together,
 *                 and kick off the main game loop (animate) and spawn timers.
 * Imports from: config.js, input.js, entities/Player.js, entities/Drone.js, entities/Enemy.js,
 *               entities/Projectile.js, entities/ExperienceOrb.js, entities/Zone.js, entities/WeaponDrop.js,
 *               systems/SpawnSystem.js, systems/UpgradeSystem.js, systems/CollisionSystem.js,
 *               renderer/Camera.js, renderer/MapRenderer.js, renderer/UIRenderer.js,
 *               assets/AssetLoader.js, assets/AudioManager.js
 * Exports: (none — this is the entry point loaded by index.html)
 *
 * Migration notes:
 *   - Lines 1-8 of game.js     → canvas/ctx setup + resize listener
 *   - Lines 627-634 of game.js → game object instantiation (player, drone, enemies[], orbs[], etc.)
 *   - Lines 636-639 of game.js → handleEnemyDeath helper
 *   - Lines 641-675 of game.js → spawn timers (setInterval + requestAnimationFrame)
 *   - Lines 677-780 of game.js → animate() main loop
 *   - Must expose a shared GameState object so entity/system modules can reference each other
 *     (e.g. enemies array, projectiles array, isPaused flag)
 */

import { inputManager } from './input.js';
import { drawMap } from './renderer/MapRenderer.js';
import { drawUI } from './renderer/UIRenderer.js';
import { Player } from './entities/Player.js';
import { Drone } from './entities/Drone.js';
import { Enemy } from './entities/Enemy.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const camera = { x: 0, y: 0 };
const enemies = [];
const projectiles = [];
const orbs = [];

inputManager.init(canvas, {
    onDroneToggle: () => drone.changeMode(),
    onSlotChange: (dir) => {
        player.currentSlot = (player.currentSlot + dir + player.maxSlots) % player.maxSlots;
    }
});

const player = new Player(1500, 1500, 'ninja', {
    ctx, camera, canvas,
    enemies, projectiles,
    onLevelUp: () => console.log('Level up!'),
    onEnemyKilled: (enemy, index) => enemies.splice(index, 1),
    onDeath: () => console.log('Öldün!'),
    input: inputManager  // ← değişti
});

const drone = new Drone(player, { orbs, enemies, projectiles });

enemies.push(new Enemy(1600, 1500));
enemies.push(new Enemy(1400, 1600));

function animate() {
    requestAnimationFrame(animate);
    drawMap(ctx, camera, canvas);
    player.update();
    drone.update(ctx, camera);
    enemies.forEach(e => e.update(ctx, camera, player));
    drawUI(ctx, canvas, player, drone, enemies);
}

animate();