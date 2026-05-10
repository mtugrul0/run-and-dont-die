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
    images : {
        player_ninja : 'assets/images/player/ninja.png',
        player_kovboy : 'assets/images/player/kovboy.png',
        player_yeniceri : 'assets/images/player/yeniceri.png',
        drone : 'assets/images/drone.png',
        enemy : 'assets/images/enemy.png',
    },
    audio : {
        bgm : 'assets/audio/bgm.mp3',
        player_attack : 'assets/audio/player_attack.wav',
        player_takendamage : 'assets/audio/player_takendamage.wav',
        player_level_up : 'assets/audio/player_level_up.wav',
        weapon_pompali : 'assets/audio/weapon_pompali.wav',
        weapon_taramali : 'assets/audio/weapon_taramali.wav',
        weapon_sniper : 'assets/audio/weapon_sniper.wav',
        drone_change : 'assets/audio/drone_change.wav',
        drone_attack : 'assets/audio/drone_attack.wav',
}
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