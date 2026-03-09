import { Game } from '../game/game.js';

export class GameUI {
    constructor() {
        // Only initialize game once canvas is visible or just wait for start
        this.game = null;
    }

    startSinglePlayer() {
        if (!this.game) {
            this.game = new Game();
        }
        
        // Ensure game over hides correctly
        document.getElementById('game-over-screen').classList.add('hidden');
        
        // Start game logic
        this.game.start();
    }
    
    stopGame() {
        if (this.game) {
            this.game.stop();
        }
    }
}

// Global instance for menu to access
window.gameUI = new GameUI();
