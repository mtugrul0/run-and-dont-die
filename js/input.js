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

class InputManager{
    constructor(){
        // State değişkenleri
        this.keys =  { w: false, a: false, s: false, d: false };
        this.mouse = { x: 0, y: 0, isDown: false };

        this.callbacks = {}; // dışarıdan gelen istekleri tutacağımız obje

        // metotlara refereanslarını ayarlayalım
        this.handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = true;
            }
            if (key === 'q' && this.callbacks.onDroneToggle) { // loose coupling. main'de burası sayesinde geçiş yapacağız
                this.callbacks.onDroneToggle();
            }
        };

        this.handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) this.keys[key] = false;
        };

        this.handleMouseDown = (e) => {
            if (e.button === 0) {
                this.mouse.isDown = true;
                if (this.callbacks.onLeftClick) this.callbacks.onLeftClick(e.clientX, e.clientY);
            }
        };

        this.handleMouseUp = (e) => {
            if (e.button === 0) this.mouse.isDown = false;
        };

        this.handleMouseMove = (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        };

        this.handleContextMenu = (e) => e.preventDefault();

        this.handleWheel = (e) => {
            if (this.callbacks.onSlotChange) {
                const direction = e.deltaY > 0 ? 1 : -1; //fare aşağı kaydıysa direction=1, yukarı kaydıysa=-1
                this.callbacks.onSlotChange(direction);
            }
        };
    
    };

    /**
    @param {HTMLCanvasElement} canvas 
    @param {Object} callbacks
    */

    init(canvas, callbacks){
        // mouse imleci tam orta noktada olacak
        this.mouse.x = canvas.width / 2;
        this.mouse.y = canvas.height/ 2;

        this.callbacks = callbacks;

        // referans verdiğimiz fonksiyonlarla dinlemeye başlıyoruz
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('contextmenu', this.handleContextMenu);
        window.addEventListener('wheel', this.handleWheel);
    };

    destroy() {
        // aynı referansları vererek dinleyicileri siliyoruz
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('contextmenu', this.handleContextMenu);
        window.removeEventListener('wheel', this.handleWheel);
        
        // callback'leri de temizliyoruz
        this.callbacks = {};
    };
}

export const inputManager = new InputManager();