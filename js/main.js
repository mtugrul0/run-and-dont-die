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

import { MAP_WIDTH, MAP_HEIGHT, SELECTED_CLASS } from './config.js';
import { inputManager } from './input.js';
import { Camera } from './renderer/Camera.js';
import { drawMap } from './renderer/MapRenderer.js';
import { drawUI } from './renderer/UIRenderer.js';
import { Player } from './entities/Player.js';
import { Drone } from './entities/Drone.js';
import { Enemy } from './entities/Enemy.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { SpawnSystem } from './systems/SpawnSystem.js';
import { UpgradeSystem } from './systems/UpgradeSystem.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const camera = new Camera();

const gameState = {
    isPaused: false,
    enemies: [],
    projectiles: [],
    orbs: [],
    zones: [],
    weaponDrops: [],
    MAP_WIDTH,
    MAP_HEIGHT,
    ctx,
    camera,
    canvas,
    player: null,
    drone: null
};

gameState.player = new Player(MAP_WIDTH / 2, MAP_HEIGHT / 2, SELECTED_CLASS, {
    ctx,
    camera,
    canvas,
    enemies: gameState.enemies,
    projectiles: gameState.projectiles,
    onLevelUp: () => upgradeSystem.triggerUpgradeCards(),
    onEnemyKilled: (enemy, index) => CollisionSystem.handleEnemyDeath(enemy, index, gameState.enemies, gameState.orbs),
    onDeath: () => {
        gameState.isPaused = true;
        setTimeout(() => {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 60px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ÖLDÜN!', canvas.width / 2, canvas.height / 2);
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.fillText('Sayfayı yenileyerek tekrar oyna', canvas.width / 2, canvas.height / 2 + 50);
        }, 100);
    },
    input: inputManager
});

gameState.drone = new Drone(gameState.player, {
    orbs: gameState.orbs,
    enemies: gameState.enemies,
    projectiles: gameState.projectiles
});

const upgradeSystem = new UpgradeSystem({
    player: gameState.player,
    gameState: gameState
});

inputManager.init(canvas, {
    onDroneToggle: () => gameState.drone.changeMode(),
    onSlotChange: (dir) => {
        const p = gameState.player;
        p.currentSlot = (p.currentSlot + dir + p.inventory.length) % p.inventory.length;
    },
    onLeftClick: (x, y) => {
        if (gameState.isPaused) upgradeSystem.handleCardClick(x, y);
    }
});

const spawnSystem = new SpawnSystem({
    gameState,
    camera,
    canvas,
    player: gameState.player,
    enemies: gameState.enemies,
    zones: gameState.zones,
    weaponDrops: gameState.weaponDrops
});

spawnSystem.start();

function animate() {
    if (gameState.isPaused) {
        upgradeSystem.drawCards(ctx, canvas);
        requestAnimationFrame(animate);
        return;
    }
    requestAnimationFrame(animate);

    drawMap(ctx, camera, canvas, MAP_WIDTH, MAP_HEIGHT);

    CollisionSystem.update(gameState);

    gameState.player.update();
    gameState.drone.update(ctx, camera);

    drawUI(ctx, canvas, gameState.player, gameState.drone, gameState.enemies);
}

animate();
