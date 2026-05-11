import { CLASS_STATS } from '../config.js';

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

export class CharacterSelectScreen {
    constructor(canvas, ctx, onSelect) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.onSelect = onSelect;

        this.selectedClass = null;
        this.hoveredClass = null;
        this.hoveredStart = false;

        this.sprites = {};
        this._loadSprites();

        this._handleMouseMove = (e) => this._onMouseMove(e);
        this._handleClick = (e) => this._onClick(e);
        window.addEventListener('mousemove', this._handleMouseMove);
        window.addEventListener('click', this._handleClick);
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

        const cardWidth = 180;
        const cardHeight = 280;
        const gap = 40;
        const classes = ['ninja', 'wizard', 'king'];
        const totalWidth = classes.length * cardWidth + (classes.length - 1) * gap;
        const startX = (w - totalWidth) / 2;
        const startY = (h - cardHeight) / 2 - 20;

        return classes.map((cls, i) => ({
            cls,
            x: startX + i * (cardWidth + gap),
            y: startY,
            w: cardWidth,
            h: cardHeight
        }));
    }

    update() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // --- Arkaplan ---
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#0a0a1a');
        bg.addColorStop(1, '#1a0a2e');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // --- Başlık ---
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('SAVAŞÇINI SEÇ', w / 2, 100);

        // dekoratif çizgi
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 200, 120);
        ctx.lineTo(w / 2 + 200, 120);
        ctx.stroke();

        // --- Kartlar ---
        const cards = this._getCardBounds();

        for (const card of cards) {
            const isSelected = this.selectedClass === card.cls;
            const isHovered = this.hoveredClass === card.cls;
            const stats = CLASS_STATS[card.cls];
            const yOffset = isSelected ? -8 : 0;

            // Kart glow (seçiliyse)
            if (isSelected) {
                ctx.shadowColor = stats.color;
                ctx.shadowBlur = 24;
            }

            // Kart arkaplan
            ctx.beginPath();
            ctx.roundRect(card.x, card.y + yOffset, card.w, card.h, 12);
            ctx.fillStyle = isHovered || isSelected
                ? 'rgba(255,255,255,0.12)'
                : 'rgba(255,255,255,0.05)';
            ctx.fill();

            // Kart kenarlık
            ctx.strokeStyle = isSelected ? stats.color : 'rgba(255,255,255,0.15)';
            ctx.lineWidth = isSelected ? 3 : 1;
            ctx.stroke();

            ctx.shadowBlur = 0; // glow'u sıfırla

            // --- Karakter ikonu ---
            const iconX = card.x + card.w / 2;
            const iconY = card.y + yOffset + 70;

            if (this.sprites[card.cls]) {
                // Sprite yüklendiyse çiz
                ctx.drawImage(this.sprites[card.cls], card.x + 20, card.y + yOffset + 20, card.w - 40, 90);
            } else {
                // Fallback: renkli daire
                ctx.beginPath();
                ctx.arc(iconX, iconY, 36, 0, Math.PI * 2);
                ctx.fillStyle = stats.color;
                ctx.fill();
            }

            // --- Karakter adı ---
            ctx.fillStyle = stats.color;
            ctx.font = 'bold 18px Georgia';
            ctx.textAlign = 'center';
            ctx.fillText(CLASS_LABELS[card.cls], card.x + card.w / 2, card.y + yOffset + 130);

            // --- Stat çubukları ---
            this._drawStats(card, stats, yOffset);
        }

        // --- Başla butonu ---
        this._drawStartButton();
    }

    _drawStats(card, stats, yOffset) {
        const ctx = this.ctx;

        const statList = [
            { label: 'CAN', value: stats.maxHealth / 5 },
            { label: 'HIZ', value: stats.speed / 5 },
            { label: 'HASAR', value: stats.damage / 30 },
            { label: 'ŞANS', value: stats.luck / 2 },
        ];

        const barW = card.w - 40;
        const barH = 8;
        const barStartX = card.x + 20;
        let barStartY = card.y + yOffset + 150;

        for (const stat of statList) {
            // Etiket
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = '11px Georgia';
            ctx.textAlign = 'left';
            ctx.fillText(stat.label, barStartX, barStartY);

            // Arkaplan bar
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.beginPath();
            ctx.roundRect(barStartX, barStartY + 4, barW, barH, 4);
            ctx.fill();

            // Doluluk bar
            ctx.fillStyle = stats.color;
            ctx.beginPath();
            ctx.roundRect(barStartX, barStartY + 4, barW * Math.min(stat.value, 1), barH, 4);
            ctx.fill();

            barStartY += 28;
        }
    }

    _drawStartButton() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const btnW = 200;
        const btnH = 50;
        const btnX = w / 2 - btnW / 2;
        const btnY = h / 2 + 180;

        const active = this.selectedClass !== null;
        const color = active
            ? CLASS_STATS[this.selectedClass].color
            : 'rgba(255,255,255,0.2)';

        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 10);
        ctx.fillStyle = this.hoveredStart && active
            ? color
            : 'rgba(255,255,255,0.05)';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = active ? color : 'rgba(255,255,255,0.3)';
        ctx.font = 'bold 18px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('OYUNA BAŞLA', w / 2, btnY + 32);

        // Butonun sınırlarını sonra click tespiti için saklıyoruz
        this._startBtnBounds = { x: btnX, y: btnY, w: btnW, h: btnH };
    }

    _onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Kart hover tespiti
        this.hoveredClass = null;
        for (const card of this._getCardBounds()) {
            if (x >= card.x && x <= card.x + card.w &&
                y >= card.y && y <= card.y + card.h) {
                this.hoveredClass = card.cls;
                break;
            }
        }

        // Buton hover tespiti
        this.hoveredStart = false;
        if (this._startBtnBounds) {
            const b = this._startBtnBounds;
            if (x >= b.x && x <= b.x + b.w &&
                y >= b.y && y <= b.y + b.h) {
                this.hoveredStart = true;
            }
        }
    }

    _onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Kart seçimi
        for (const card of this._getCardBounds()) {
            if (x >= card.x && x <= card.x + card.w &&
                y >= card.y && y <= card.y + card.h) {
                this.selectedClass = card.cls;
                return;
            }
        }

        // Başla butonu
        if (this._startBtnBounds && this.selectedClass !== null) {
            const b = this._startBtnBounds;
            if (x >= b.x && x <= b.x + b.w &&
                y >= b.y && y <= b.y + b.h) {
                this.destroy();
                this.onSelect(this.selectedClass);
            }
        }
    }
}