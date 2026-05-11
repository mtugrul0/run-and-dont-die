/**
 * TODO: AudioManager.js
 * Responsibility: Audio playback manager — play/stop/loop background music, trigger one-shot sound effects,
 *                 master volume control, mute toggle.
 * Imports from: assets/AssetLoader.js (loaded audio references)
 * Exports: AudioManager (class or singleton with play, stop, loop, setVolume, mute/unmute methods)
 *
 * Implementation notes:
 *   - This is NEW functionality — no audio exists in game.js monolith
 *   - Use Web Audio API (AudioContext) or HTML5 Audio elements
 *   - BGM should loop seamlessly; SFX should overlap (multiple simultaneous plays)
 *   - Provide named triggers: playBGM(), playSFX('attack'), playSFX('hit'), playSFX('pickup'), playSFX('levelup')
 *   - Respect browser autoplay policies — resume AudioContext on first user gesture
 */

export class AudioManager {
    constructor () {
        this.bgm = null;
        this.sfx = {};
        this.masterVolume = 1;
        this.isMuted = false;
        this._started = false; // Autoplay politikası için
    }

    init () {
    // Kullanıcı ilk tıklayınca veya tuşa basınca çalışır
    const resume = () => {
        if (!this._started) {
            this._started = true;
            // artık ses çalabilir
            document.removeEventListener('click', resume);
            document.removeEventListener('keydown', resume);
        }
    };
    document.addEventListener('click', resume);
    document.addEventListener('keydown', resume);       
    }

    playBGM(audioElement) {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
        this.bgm = audioElement;
        this.bgm.loop = true;
        this.bgm.volume = this.isMuted ? 0 : this.masterVolume;
        this.bgm.play();
    }
    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
    }

    playSFX(audioElement) {
        const sfx = audioElement.cloneNode(); // Aynı anda birden fazla çalabilmek için klonla
        sfx.volume = this.isMuted ? 0 : this.masterVolume;
        sfx.play();
     }
    setVolume(level) {
        this.masterVolume = level;
        if (this.bgm) {
            this.bgm.volume = this.isMuted ? 0 : this.masterVolume;
        }
     }
    mute() {
        this.isMuted = true;
        if (this.bgm) {
            this.bgm.volume = 0;
        }
    }
    unmute() {
        this.isMuted = false;
        if (this.bgm) {
            this.bgm.volume = this.masterVolume;
        }
    }
}

export const audioManager = new AudioManager();