/**
 * TODO: UpgradeSystem.js
 * Responsibility: Level-up upgrade card system — manage UPGRADE_POOL, randomly select 3 cards on level-up,
 *                 draw card overlay, handle card click selection, apply stat upgrades.
 * Imports from: config.js (UPGRADE_POOL)
 * Exports: UpgradeSystem (class or object with triggerUpgradeCards, drawCards, handleCardClick methods)
 *
 * Migration notes:
 *   - Lines 436-500 of game.js → UPGRADE_POOL, triggerUpgradeCards(), drawCards(), handleCardClick()
 *   - Line 446 getXpRadius() helper — keep here or move to config.js
 *   - availableCards state (line 15) lives here
 *   - UPGRADE_POOL.apply() lambdas reference player directly — inject player reference
 *   - Sets isPaused = true/false — inject GameState
 *   - drawCards() uses ctx, canvas dimensions — pass as parameters
 */

import { UPGRADE_POOL } from '../config.js';

export class UpgradeSystem {
    constructor(deps) {
        this._player = deps.player;
        this._gameState = deps.gameState;
        this.availableCards = [];
    }

    triggerUpgradeCards() { 
        this._gameState.isPaused = true;
        this.availableCards = [];
        const poolCopy = [...UPGRADE_POOL];

        for (let i = 0; i < 3; i++) {
            if (poolCopy.length === 0) break;
            const idx = Math.floor(Math.random() * poolCopy.length);
            this.availableCards.push(poolCopy[idx]);
            poolCopy.splice(idx, 1);
        }
    }

    drawCards(ctx, canvas) { 

        if (this.availableCards.length === 0) return;

        ctx.fillStyle = 'rgba(133, 127, 127, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'gold';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⬆ SEVİYE ATLADIN!', canvas.width / 2, canvas.height / 2 - 160);

        const cardWidth = 200;
        const cardHeight = 230;
        const gap = 35;
        const totalWidth = this.availableCards.length * cardWidth + (this.availableCards.length - 1) * gap;
        const startX = (canvas.width - totalWidth) / 2;

        this.availableCards.forEach((card, i) => {
        const x = startX + i * (cardWidth + gap);
        const y = canvas.height / 2 - cardHeight / 2;
        card.hitbox = { x, y, w: cardWidth, h: cardHeight };

        ctx.fillStyle = '#1a1a2e'; ctx.fillRect(x, y, cardWidth, cardHeight);
        ctx.strokeStyle = 'gold'; ctx.lineWidth = 2; ctx.strokeRect(x, y, cardWidth, cardHeight);

        ctx.fillStyle = 'gold'; ctx.font = 'bold 20px Arial';
        ctx.fillText(card.title, x + cardWidth / 2, y + 65);
        ctx.fillStyle = '#ccc'; ctx.font = '15px Arial';
        ctx.fillText(card.desc, x + cardWidth / 2, y + 120);
        ctx.fillStyle = 'rgba(255,215,0,0.15)';
        ctx.fillRect(x + 20, y + cardHeight - 55, cardWidth - 40, 30);
        ctx.fillStyle = 'gold'; ctx.font = '13px Arial';
        ctx.fillText('Seç', x + cardWidth / 2, y + cardHeight - 34);
    });
    }

    handleCardClick(x, y) { 
        for (let card of this.availableCards) {
        const h = card.hitbox;
        if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) {
            card.apply(this._player);
            this._gameState.isPaused = false;
            this.availableCards = [];
            break;
        }
    }
    }
}