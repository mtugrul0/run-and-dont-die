export class LoadingScreen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.progress = 0;
        this._time = 0;

        // Animasyon için parçacıklar
        this._particles = [];
        for (let i = 0; i < 40; i++) {
            this._particles.push({
                x: Math.random(),
                y: Math.random(),
                speed: 0.0003 + Math.random() * 0.0008,
                size: 1 + Math.random() * 2,
                alpha: 0.1 + Math.random() * 0.3
            });
        }
    }

    setProgress(progress) {
        this.progress = Math.min(Math.max(progress, 0), 1);
    }

    update() {
        this._time++;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // --- Arkaplan gradient ---
        const bg = ctx.createLinearGradient(0, 0, w * 0.3, h);
        bg.addColorStop(0, '#0a0a1a');
        bg.addColorStop(0.5, '#12082e');
        bg.addColorStop(1, '#1a0a2e');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // --- Parçacık efekti ---
        this._drawParticles(ctx, w, h);

        // --- Oyun Başlığı ---
        this._drawTitle(ctx, w, h);

        // --- Progress Bar ---
        this._drawProgressBar(ctx, w, h);
    }

    _drawParticles(ctx, w, h) {
        for (const p of this._particles) {
            p.y -= p.speed;
            if (p.y < 0) {
                p.y = 1;
                p.x = Math.random();
            }
            ctx.beginPath();
            ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(160, 140, 255, ${p.alpha})`;
            ctx.fill();
        }
    }

    _drawTitle(ctx, w, h) {
        const pulse = Math.sin(this._time * 0.03) * 0.3 + 0.7;
        ctx.save();
        ctx.shadowColor = `rgba(180, 120, 255, ${pulse})`;
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 52px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Run and Don\'t Die', w / 2, h / 2 - 80);
        ctx.shadowBlur = 0;
        ctx.restore();

        // İnce alt satır
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '14px Georgia, serif';
        ctx.fillText('Hayatta kal... ya da öl.', w / 2, h / 2 - 40);
    }

    _drawProgressBar(ctx, w, h) {
        const barW = 400;
        const barH = 20;
        const barX = w / 2 - barW / 2;
        const barY = h / 2 + 20;

        // Yükleniyor metni
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '16px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Yükleniyor... %${Math.floor(this.progress * 100)}`, w / 2, barY - 15);

        // Arkaplan çubuğu
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 10);
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(160, 120, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dolgu çubuğu
        const fillW = barW * this.progress;
        if (fillW > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(barX, barY, fillW, barH, 10);

            const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
            grad.addColorStop(0, '#8a2be2');
            grad.addColorStop(1, '#c084fc');

            ctx.fillStyle = grad;
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.restore();
        }
    }
}
