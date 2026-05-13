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

import { MAP_WIDTH, MAP_HEIGHT } from './config.js';
import { Menu } from './screens/Menu.js';
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
import { loadAllAssets, assets } from './assets/AssetLoader.js';
import { audioManager } from './assets/AudioManager.js';
import { GameOverScreen } from './screens/GameOverScreen.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

audioManager.init();

const camera = new Camera();

const gameState = {
    isPaused: false,
    killCount: 0,
    gameStartTime: 0,
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


const spawnSystem = new SpawnSystem({
    gameState,
    camera,
    canvas,
    enemies: gameState.enemies,
    zones: gameState.zones,
    weaponDrops: gameState.weaponDrops
});

let upgradeSystem;

function animate() {
    if (gameState.isPaused) {
        upgradeSystem.drawCards(ctx, canvas);
        requestAnimationFrame(animate);
        return;
    }
    requestAnimationFrame(animate);

    drawMap(ctx, camera, canvas);

    CollisionSystem.update(gameState);

    gameState.player.update();
    gameState.drone.update(ctx, camera);

    drawUI(ctx, canvas, gameState.player, gameState.drone, gameState.enemies, gameState.zones, gameState.weaponDrops);
}
const selectionScreen = new Menu(canvas, ctx, (chosenClass, soundOn) => {
    cancelAnimationFrame(selectionRafId);
    gameState.gameStartTime = performance.now();

    audioManager.isMuted = !soundOn;
    audioManager.playBGM(assets.audio['bgm_' + chosenClass]);

    gameState.player = new Player(MAP_WIDTH / 2, MAP_HEIGHT / 2, chosenClass, {
        ctx,
        camera,
        canvas,
        enemies: gameState.enemies,
        projectiles: gameState.projectiles,
        onLevelUp: () => upgradeSystem.triggerUpgradeCards(),
        onEnemyKilled: (enemy, index) => {
            gameState.killCount++;
            CollisionSystem.handleEnemyDeath(enemy, index, gameState.enemies, gameState.orbs);
        },
        onDeath: () => {
            gameState.isPaused = true;
            audioManager.playBGM(assets.audio.bgm_rip);
            const survivedSeconds = Math.floor((performance.now() - gameState.gameStartTime) / 1000);
            new GameOverScreen(canvas, ctx, { survivedSeconds, killCount: gameState.killCount }, () => {
                window.location.reload();
            });
        },
        input: inputManager
    });

    gameState.drone = new Drone(gameState.player, {
        orbs: gameState.orbs,
        enemies: gameState.enemies,
        projectiles: gameState.projectiles
    });

    upgradeSystem = new UpgradeSystem({
        player: gameState.player,
        gameState
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

    spawnSystem.start();
    animate();
});

let selectionRafId;
function selectionLoop() {
    selectionScreen.update();
    selectionRafId = requestAnimationFrame(selectionLoop);
}

// Önce tüm asset'leri yükle, sonra seçim ekranını başlat
loadAllAssets((progress) => {
    console.log(`Asset yükleniyor: ${Math.floor(progress * 100)}%`);
}).then(() => {
    console.log('Tüm asset\'ler yüklendi!');
    // Tarayıcı autoplay politikası nedeniyle ilk başta ses çalmayabilir, 
    // kullanıcı tıkladığında başlaması gerekebilir.
    audioManager.playBGM(assets.audio.bgm_menu);
    selectionLoop();
});
