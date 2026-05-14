import { CLASS_STATS, SPRITE_DATA } from '../config.js';
import { audioManager } from '../assets/AudioManager.js';

const SPRITE_MAP = {
    ninja: 'assets/images/player/ninja/Idle.png',
    wizard: 'assets/images/player/wizard/Idle.png',
    king: 'assets/images/player/king/Idle.png'
};

const CLASS_LABELS = {
    ninja: 'NİNJA',
    wizard: 'WIZARD',
    king: 'KING'
};

export class Menu {
    constructor(canvas, ctx, onSelect) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.onSelect = onSelect;

        this.selectedClass = null;
        this.hoveredClass = null;
        this.hoveredStart = false;
        this.hoveredHowTo = false;
        this.hoveredExit = false;
        this.hoveredSound = false;
        this.showHowTo = false;
        this.hoveredCloseHowTo = false;

        this.soundOn = true;

        // Animasyon state — her karakter için ayrı frame sayacı
        this.animFrames = { ninja: 0, wizard: 0, king: 0 };
        this.lastFrameTime = 0;

        // Animasyon
        this._time = 0;
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

        this.sprites = {};
        this._loadSprites();

        this._handleMouseMove = (e) => this._onMouseMove(e);
        this._handleClick = (e) => this._onClick(e);
        window.addEventListener('mousemove', this._handleMouseMove);
        window.addEventListener('click', this._handleClick);

        // Buton sınırları
        this._startBtnBounds = null;
        this._howToBtnBounds = null;
        this._exitBtnBounds = null;
        this._soundBtnBounds = null;
        this._closeHowToBounds = null;
    }

    _loadSprites() {
        for (const [cls, path] of Object.entries(SPRITE_MAP)) {
            const img = new Image();
            img.src = path;
            img.onerror = () => { this.sprites[cls] = null; };
            img.onload = () => { this.sprites[cls] = img; };
        }
    }

    destroy() {
        window.removeEventListener('mousemove', this._handleMouseMove);
        window.removeEventListener('click', this._handleClick);
    }

    _getCardBounds() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        const cardWidth = 170;
        const cardHeight = 260;
        const gap = 36;
        const classes = ['ninja', 'wizard', 'king'];
        const totalWidth = classes.length * cardWidth + (classes.length - 1) * gap;
        const startX = (w - totalWidth) / 2;
        // Kartlar başlığın ve alt yazının altında
        const startY = 180;

        return classes.map((cls, i) => ({
            cls,
            x: startX + i * (cardWidth + gap),
            y: startY,
            w: cardWidth,
            h: cardHeight
        }));
    }

    update(timestamp = performance.now()) {
        this._time++;
        const ctx = this.ctx;

        // --- Animasyon frame güncelle ---
        if (timestamp - this.lastFrameTime >= 120) {
            const elapsed = Math.floor((timestamp - this.lastFrameTime) / 120);
            for (const cls of ['ninja', 'wizard', 'king']) {
                const totalFrames = SPRITE_DATA[cls]?.idle?.frames ?? 6;
                this.animFrames[cls] = (this.animFrames[cls] + elapsed) % totalFrames;
            }
            this.lastFrameTime = timestamp;
        }
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
        this._drawTitle(ctx, w);

        // --- Karakter seçim başlığı ---
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '16px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('SAVAŞÇINI SEÇ', w / 2, 165);

        // --- Kartlar ---
        const cards = this._getCardBounds();
        for (const card of cards) {
            this._drawCard(ctx, card);
        }

        // --- Alt butonlar ---
        this._drawButtons(ctx, w, h);

        // --- Ses butonu (sağ üst) ---
        this._drawSoundToggle(ctx, w);

        // --- Nasıl Oynanır modal ---
        if (this.showHowTo) {
            this._drawHowToModal(ctx, w, h);
        }
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

    _drawTitle(ctx, w) {
        // Glow
        const pulse = Math.sin(this._time * 0.03) * 0.3 + 0.7;
        ctx.save();
        ctx.shadowColor = `rgba(180, 120, 255, ${pulse})`;
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 52px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Run and Don\'t Die', w / 2, 80);
        ctx.shadowBlur = 0;
        ctx.restore();

        // Alt çizgi dekoratif
        const grad = ctx.createLinearGradient(w / 2 - 220, 0, w / 2 + 220, 0);
        grad.addColorStop(0, 'rgba(160, 120, 255, 0)');
        grad.addColorStop(0.3, 'rgba(160, 120, 255, 0.5)');
        grad.addColorStop(0.5, 'rgba(200, 160, 255, 0.8)');
        grad.addColorStop(0.7, 'rgba(160, 120, 255, 0.5)');
        grad.addColorStop(1, 'rgba(160, 120, 255, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 220, 100);
        ctx.lineTo(w / 2 + 220, 100);
        ctx.stroke();

        // İnce alt satır
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '13px Georgia, serif';
        ctx.fillText('Hayatta kal... ya da öl.', w / 2, 125);
    }

    _drawCard(ctx, card) {
        const isSelected = this.selectedClass === card.cls;
        const isHovered = this.hoveredClass === card.cls;
        const stats = CLASS_STATS[card.cls];
        const yOffset = isSelected ? -6 : (isHovered ? -3 : 0);

        // Kart glow
        if (isSelected) {
            ctx.save();
            ctx.shadowColor = stats.color;
            ctx.shadowBlur = 28;
        }

        // Kart arkaplan
        ctx.beginPath();
        ctx.roundRect(card.x, card.y + yOffset, card.w, card.h, 14);
        ctx.fillStyle = isSelected
            ? 'rgba(255,255,255,0.14)'
            : isHovered
                ? 'rgba(255,255,255,0.10)'
                : 'rgba(255,255,255,0.04)';
        ctx.fill();

        // Kart kenarlık
        ctx.strokeStyle = isSelected ? stats.color : (isHovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)');
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.stroke();

        if (isSelected) ctx.restore();

        // --- Karakter ikonu ---
        if (this.sprites[card.cls]) {
            const sd = SPRITE_DATA[card.cls];
            const frame = this.animFrames[card.cls] || 0;
            const fw = sd ? sd.frameW : (this.sprites[card.cls].width / 6);
            const fh = sd ? sd.frameH : this.sprites[card.cls].height;
            const sx = frame * fw;

            const destSize = card.w - 40;
            const destX = card.x + 20;
            const destY = card.y + yOffset + 10;

            ctx.drawImage(
                this.sprites[card.cls],
                sx, 0, fw, fh,
                destX, destY, destSize, destSize
            );
        } else {
            const iconX = card.x + card.w / 2;
            const iconY = card.y + yOffset + 60;
            ctx.beginPath();
            ctx.arc(iconX, iconY, 32, 0, Math.PI * 2);
            ctx.fillStyle = stats.color;
            ctx.fill();
        }

        // --- Karakter adı ---
        ctx.fillStyle = stats.color;
        ctx.font = 'bold 17px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(CLASS_LABELS[card.cls], card.x + card.w / 2, card.y + yOffset + 122);

        // --- Stat çubukları ---
        this._drawStats(card, stats, yOffset);
    }

    _drawStats(card, stats, yOffset) {
        const ctx = this.ctx;

        const statList = [
            { label: 'CAN', value: stats.maxHealth / 5 },
            { label: 'HIZ', value: stats.speed / 5 },
            { label: 'HASAR', value: stats.damage / 30 },
            { label: 'ŞANS', value: stats.luck / 2 },
        ];

        const barW = card.w - 36;
        const barH = 7;
        const barStartX = card.x + 18;
        let barStartY = card.y + yOffset + 140;

        for (const stat of statList) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '10px Georgia, serif';
            ctx.textAlign = 'left';
            ctx.fillText(stat.label, barStartX, barStartY);

            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.beginPath();
            ctx.roundRect(barStartX, barStartY + 4, barW, barH, 3);
            ctx.fill();

            ctx.fillStyle = stats.color;
            ctx.beginPath();
            ctx.roundRect(barStartX, barStartY + 4, barW * Math.min(stat.value, 1), barH, 3);
            ctx.fill();

            barStartY += 26;
        }
    }

    _drawButtons(ctx, w, h) {
        const btnW = 200;
        const btnH = 44;
        const gap = 16;
        const totalH = btnH * 3 + gap * 2;
        const startY = h - totalH - 40;
        const btnX = w / 2 - btnW / 2;

        // --- BAŞLA butonu ---
        const active = this.selectedClass !== null;
        const startColor = active ? CLASS_STATS[this.selectedClass].color : 'rgba(255,255,255,0.2)';
        const startY1 = startY;
        this._startBtnBounds = { x: btnX, y: startY1, w: btnW, h: btnH };

        ctx.beginPath();
        ctx.roundRect(btnX, startY1, btnW, btnH, 10);
        if (this.hoveredStart && active) {
            ctx.save();
            ctx.shadowColor = startColor;
            ctx.shadowBlur = 14;
            ctx.fillStyle = startColor;
            ctx.fill();
            ctx.restore();
        } else {
            ctx.fillStyle = active ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)';
            ctx.fill();
        }
        ctx.strokeStyle = startColor;
        ctx.lineWidth = active ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = active ? (this.hoveredStart ? '#fff' : startColor) : 'rgba(255,255,255,0.25)';
        ctx.font = 'bold 17px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('▶  BAŞLA', w / 2, startY1 + 29);

        // --- NASIL OYNANIR butonu ---
        const howToY = startY + btnH + gap;
        this._howToBtnBounds = { x: btnX, y: howToY, w: btnW, h: btnH };

        ctx.beginPath();
        ctx.roundRect(btnX, howToY, btnW, btnH, 10);
        ctx.fillStyle = this.hoveredHowTo ? 'rgba(100,180,255,0.2)' : 'rgba(255,255,255,0.04)';
        ctx.fill();
        ctx.strokeStyle = this.hoveredHowTo ? 'rgba(100,180,255,0.7)' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = this.hoveredHowTo ? '#8cc8ff' : 'rgba(255,255,255,0.5)';
        ctx.font = '15px Georgia, serif';
        ctx.fillText('📖  NASIL OYNANIR', w / 2, howToY + 28);

        // --- ÇIKIŞ butonu ---
        const exitY = howToY + btnH + gap;
        this._exitBtnBounds = { x: btnX, y: exitY, w: btnW, h: btnH };

        ctx.beginPath();
        ctx.roundRect(btnX, exitY, btnW, btnH, 10);
        ctx.fillStyle = this.hoveredExit ? 'rgba(255,60,60,0.2)' : 'rgba(255,255,255,0.04)';
        ctx.fill();
        ctx.strokeStyle = this.hoveredExit ? 'rgba(255,80,80,0.7)' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = this.hoveredExit ? '#ff6666' : 'rgba(255,255,255,0.5)';
        ctx.font = '15px Georgia, serif';
        ctx.fillText('✕  ÇIKIŞ', w / 2, exitY + 28);
    }

    _drawSoundToggle(ctx, w) {
        const size = 40;
        const x = w - size - 16;
        const y = 16;
        this._soundBtnBounds = { x, y, w: size, h: size };

        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 8);
        ctx.fillStyle = this.hoveredSound ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)';
        ctx.fill();
        ctx.strokeStyle = this.hoveredSound ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = this.soundOn ? 'rgba(255,255,255,0.8)' : 'rgba(255,80,80,0.7)';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.soundOn ? '🔊' : '🔇', x + size / 2, y + size / 2 + 7);
    }

    _drawHowToModal(ctx, w, h) {
        // Karartma
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, w, h);

        const modalW = 520;
        const modalH = 420;
        const mx = (w - modalW) / 2;
        const my = (h - modalH) / 2;

        // Modal arkaplan
        ctx.beginPath();
        ctx.roundRect(mx, my, modalW, modalH, 16);
        ctx.fillStyle = 'rgba(16, 12, 40, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(160, 120, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Başlık
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nasıl Oynanır?', w / 2, my + 50);

        // Dekoratif çizgi
        ctx.strokeStyle = 'rgba(160, 120, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mx + 40, my + 65);
        ctx.lineTo(mx + modalW - 40, my + 65);
        ctx.stroke();

        // Kontroller
        const instructions = [
            { key: 'W A S D', desc: 'Hareket etmek için kullan' },
            { key: 'FARE SOL TIK', desc: 'Saldırı yapmak için kullan' },
            { key: 'Q', desc: 'Drone modunu değiştir (İyileşme / Toplama / Saldırı)' },
            { key: 'KAYDIRMA TEKERLEĞİ', desc: 'Envanter slotları arasında geçiş yap' },
            { key: '🟢 YEŞİL BÖLGE', desc: 'Can yenileme bölgesi' },
            { key: '🟣 MOR BÖLGE', desc: 'Güç artırma bölgesi (Mad Buff)' },
            { key: '🟠 SİLAH', desc: 'Yerden silah topla (Pompalı, Taramalı, Sniper)' },
        ];

        let ly = my + 95;
        for (const inst of instructions) {
            // Tuş/simge
            ctx.fillStyle = 'rgba(160, 140, 255, 0.9)';
            ctx.font = 'bold 13px Consolas, monospace';
            ctx.textAlign = 'left';
            ctx.fillText(inst.key, mx + 40, ly);

            // Açıklama
            ctx.fillStyle = 'rgba(255,255,255,0.65)';
            ctx.font = '13px Georgia, serif';
            ctx.fillText(inst.desc, mx + 210, ly);

            ly += 36;
        }

        // Kapatma butonu
        const closeBtnW = 140;
        const closeBtnH = 40;
        const closeBtnX = w / 2 - closeBtnW / 2;
        const closeBtnY = my + modalH - 60;
        this._closeHowToBounds = { x: closeBtnX, y: closeBtnY, w: closeBtnW, h: closeBtnH };

        ctx.beginPath();
        ctx.roundRect(closeBtnX, closeBtnY, closeBtnW, closeBtnH, 8);
        ctx.fillStyle = this.hoveredCloseHowTo ? 'rgba(160, 120, 255, 0.4)' : 'rgba(255,255,255,0.06)';
        ctx.fill();
        ctx.strokeStyle = this.hoveredCloseHowTo ? 'rgba(180, 140, 255, 0.8)' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = this.hoveredCloseHowTo ? '#ffffff' : 'rgba(255,255,255,0.6)';
        ctx.font = 'bold 15px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('KAPAT', w / 2, closeBtnY + 26);
    }

    _isInBounds(x, y, b) {
        return b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    }

    _onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // "Nasıl Oynanır" modalı açıksa sadece kapatma butonunu kontrol et
        if (this.showHowTo) {
            this.hoveredCloseHowTo = this._isInBounds(x, y, this._closeHowToBounds);
            return;
        }

        // Kart hover
        this.hoveredClass = null;
        for (const card of this._getCardBounds()) {
            if (x >= card.x && x <= card.x + card.w &&
                y >= card.y && y <= card.y + card.h) {
                this.hoveredClass = card.cls;
                break;
            }
        }

        // Buton hovers
        this.hoveredStart = this._isInBounds(x, y, this._startBtnBounds);
        this.hoveredHowTo = this._isInBounds(x, y, this._howToBtnBounds);
        this.hoveredExit = this._isInBounds(x, y, this._exitBtnBounds);
        this.hoveredSound = this._isInBounds(x, y, this._soundBtnBounds);
    }

    _onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Modal açıksa sadece kapatma
        if (this.showHowTo) {
            if (this._isInBounds(x, y, this._closeHowToBounds)) {
                this.showHowTo = false;
            }
            return;
        }

        // Ses butonu
        if (this._isInBounds(x, y, this._soundBtnBounds)) {
            this.soundOn = !this.soundOn;
            if (this.soundOn) {
                audioManager.unmute();
            } else {
                audioManager.mute();
            }
            return;
        }

        // Kart seçimi
        for (const card of this._getCardBounds()) {
            if (x >= card.x && x <= card.x + card.w &&
                y >= card.y && y <= card.y + card.h) {
                this.selectedClass = card.cls;
                return;
            }
        }

        // Başla butonu
        if (this._isInBounds(x, y, this._startBtnBounds) && this.selectedClass !== null) {
            this.destroy();
            this.onSelect(this.selectedClass, this.soundOn);
            return;
        }

        // Nasıl oynanır
        if (this._isInBounds(x, y, this._howToBtnBounds)) {
            this.showHowTo = true;
            return;
        }

        // Çıkış
        if (this._isInBounds(x, y, this._exitBtnBounds)) {
            window.close();
            // window.close çoğu tarayıcıda çalışmayabilir, o zaman bilgi göster
            // Fallback: boş sayfa
            window.location.href = 'about:blank';
        }
    }
}
