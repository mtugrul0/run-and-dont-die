/**
 * GameOverScreen.js
 * Responsibility: Render the Game Over overlay on the canvas.
 *   - Shows "ÖLDÜN!" header with animated fade-in
 *   - Displays survival time (seconds) and enemy kill count
 *   - Provides a "Tekrar Oyna" button that calls onRestart() without a page reload
 * Exports: GameOverScreen class
 */

export class GameOverScreen {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {{ survivedSeconds: number, killCount: number }} stats
     * @param {() => void} onRestart
     */
    constructor(canvas, ctx, stats, onRestart) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.stats = stats;
        this.onRestart = onRestart;

        this._alpha = 0;
        this._animDone = false;
        this._startTs = performance.now();

        this._btnBounds = null;
        this._btnHovered = false;

        this._handleMouseMove = (e) => this._onMouseMove(e);
        this._handleClick = (e) => this._onClick(e);
        window.addEventListener('mousemove', this._handleMouseMove);
        window.addEventListener('click', this._handleClick);

        this._rafId = requestAnimationFrame(this._loop.bind(this));
    }

    destroy() {
        window.removeEventListener('mousemove', this._handleMouseMove);
        window.removeEventListener('click', this._handleClick);
        cancelAnimationFrame(this._rafId);
    }


    _loop(ts) {
        const elapsed = ts - this._startTs;
        this._alpha = Math.min(1, elapsed / 600);

        this._draw();
        this._rafId = requestAnimationFrame(this._loop.bind(this));
    }

    _draw() {
        const { canvas, ctx, stats } = this;
        const w = canvas.width;
        const h = canvas.height;
        const a = this._alpha;

        ctx.save();
        ctx.globalAlpha = a;

        const overlay = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
        overlay.addColorStop(0, 'rgba(30,0,0,0.88)');
        overlay.addColorStop(1, 'rgba(0,0,0,0.96)');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, w, h);

        const titleY = h / 2 - 160;
        ctx.shadowColor = '#ff2020';
        ctx.shadowBlur = 40;
        ctx.fillStyle = '#ff3333';
        ctx.font = 'bold 80px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('ÖLDÜN!', w / 2, titleY);
        ctx.shadowBlur = 0;

        ctx.strokeStyle = 'rgba(255,50,50,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 200, titleY + 18);
        ctx.lineTo(w / 2 + 200, titleY + 18);
        ctx.stroke();

        const panelW = 360;
        const panelH = 160;
        const panelX = w / 2 - panelW / 2;
        const panelY = h / 2 - 80;

        ctx.beginPath();
        ctx.roundRect(panelX, panelY, panelW, panelH, 16);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,80,80,0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        this._drawScoreRow(
            ctx,
            w / 2,
            panelY + 52,
            '⏱  HAYATTA KALMA',
            `${stats.survivedSeconds} saniye`,
            '#ffcc44'
        );

        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(panelX + 24, panelY + 80);
        ctx.lineTo(panelX + panelW - 24, panelY + 80);
        ctx.stroke();

        this._drawScoreRow(
            ctx,
            w / 2,
            panelY + 116,
            '☠  ÖLDÜRÜLen DÜŞMAN',
            `${stats.killCount} düşman`,
            '#ff6644'
        );

        const btnW = 240;
        const btnH = 56;
        const btnX = w / 2 - btnW / 2;
        const btnY = h / 2 + 110;

        this._btnBounds = { x: btnX, y: btnY, w: btnW, h: btnH };

        const isHovered = this._btnHovered;
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 12);

        if (isHovered) {
            ctx.shadowColor = '#ff4444';
            ctx.shadowBlur = 18;
            ctx.fillStyle = 'rgba(255,60,60,0.85)';
        } else {
            ctx.fillStyle = 'rgba(255,60,60,0.15)';
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = isHovered ? '#ff6666' : 'rgba(255,80,80,0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = isHovered ? '#ffffff' : '#ffaaaa';
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('▶  TEKRAR OYNA', w / 2, btnY + 36);

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    _drawScoreRow(ctx, cx, y, label, value, valueColor) {
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '13px Georgia, serif';
        const labelW = ctx.measureText(label).width;
        const gap = 12;

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(label, cx - 155, y);

        ctx.fillStyle = valueColor;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'right';
        ctx.fillText(value, cx + 155, y);
    }

    _onMouseMove(e) {
        if (!this._btnBounds) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const b = this._btnBounds;
        this._btnHovered = (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    }

    _onClick(e) {
        if (!this._btnBounds) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const b = this._btnBounds;
        if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
            this.destroy();
            this.onRestart();
        }
    }
}
