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
