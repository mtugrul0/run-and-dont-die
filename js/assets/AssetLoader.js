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

const manifest = {
    images: {

        ninja_idle: 'assets/images/player/ninja/Idle.png',
        ninja_run: 'assets/images/player/ninja/Run.png',
        ninja_attack1: 'assets/images/player/ninja/Attack1.png',
        ninja_death: 'assets/images/player/ninja/Death.png',
        ninja_hit: 'assets/images/player/ninja/Take_Hit.png',

        wizard_idle: 'assets/images/player/wizard/Idle.png',
        wizard_run: 'assets/images/player/wizard/Run.png',
        wizard_attack1: 'assets/images/player/wizard/Attack1.png',
        wizard_death: 'assets/images/player/wizard/Death.png',
        wizard_hit: 'assets/images/player/wizard/Hit.png',

        king_idle: 'assets/images/player/king/Idle.png',
        king_run: 'assets/images/player/king/Run.png',
        king_attack1: 'assets/images/player/king/Attack_1.png',
        king_death: 'assets/images/player/king/Death.png',
        king_hit: 'assets/images/player/king/Hit.png',

        enemy_flying_eye: 'assets/images/enemies/flying_eye/Attack3.png',
        enemy_flying_eye_projectile: 'assets/images/enemies/flying_eye/projectile_sprite.png',
        enemy_goblin: 'assets/images/enemies/goblin/Attack3.png',
        enemy_goblin_bomb: 'assets/images/enemies/goblin/Bomb_sprite.png',
        enemy_mushroom: 'assets/images/enemies/mushroom/Attack3.png',
        enemy_mushroom_projectile: 'assets/images/enemies/mushroom/Projectile_sprite.png',
        enemy_skeleton: 'assets/images/enemies/skeleton/Attack3.png',
        enemy_skeleton_sword: 'assets/images/enemies/skeleton/Sword_sprite.png',

        weapon_pompali: 'assets/images/items/pompali.png',
        weapon_taramali: 'assets/images/items/taramali.png',
        weapon_sniper: 'assets/images/items/sniper.png',

        map_floor: 'assets/images/ui/zemin.png',
    },

    audio: {
        bgm_ninja: 'assets/audio/bgm/ninja.mp3',
        bgm_kovboy: 'assets/audio/bgm/kovboy.mp3',
        bgm_yeniceri: 'assets/audio/bgm/yeniceri.mp3',

        attack_ninja: 'assets/audio/sfx/attack_ninja.wav',
        attack_kovboy: 'assets/audio/sfx/attack_kovboy.wav',
        attack_yeniceri: 'assets/audio/sfx/attack_yeniceri.wav',

        death_ninja: 'assets/audio/sfx/death_ninja.wav',
        death_kovboy: 'assets/audio/sfx/death_kovboy.wav',
        death_yeniceri: 'assets/audio/sfx/death_yeniceri.wav',

        levelup_ninja: 'assets/audio/sfx/levelup_ninja.wav',
        levelup_kovboy: 'assets/audio/sfx/levelup_kovboy.wav',
        levelup_yeniceri: 'assets/audio/sfx/levelup_yeniceri.wav',

        hit: 'assets/audio/sfx/hit.wav',
        pickup: 'assets/audio/sfx/pickup.wav',
        gameover: 'assets/audio/sfx/gameover.wav',
    },
};

export const assets = {
    images: {},
    audio: {}
};

function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
        img.src = path;
    });
}

function loadAudio(path) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = () => reject(new Error(`Failed to load audio: ${path}`));
        audio.src = path;
    });
}

export async function loadAllAssets(onProgress) {
    const allEntries = [
        ...Object.entries(manifest.images).map(([key, path]) => ({ key, path, type: 'image' })),
        ...Object.entries(manifest.audio).map(([key, path]) => ({ key, path, type: 'audio' }))
    ];

    let loaded = 0;
    const total = allEntries.length;

    for (const entry of allEntries) {
        try {
            if (entry.type === 'image') {
                assets.images[entry.key] = await loadImage(entry.path);
            } else {
                assets.audio[entry.key] = await loadAudio(entry.path);
            }
        } catch (e) {
            console.warn(`Yüklenemedi: ${entry.path}`);
        }
        loaded++;
        if (onProgress) onProgress(loaded / total); // 0.0 → 1.0 arası
    }
}