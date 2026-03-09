export class MenuUI {
    constructor() {
        this.menuScreen = document.getElementById('main-menu');
        this.gameScreen = document.getElementById('game-screen');
        this.waitingScreen = document.getElementById('waiting-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        
        this.btnSingle = document.getElementById('btn-single');
        this.btnMulti = document.getElementById('btn-multi');
        this.btnMenu = document.getElementById('btn-menu');
        this.btnQuit = document.getElementById('btn-quit');
        this.btnSpecQuit = document.getElementById('btn-spec-quit');
        
        this.opponentPanel = document.getElementById('opponent-panel');
        this.spectatorScreen = document.getElementById('spectator-screen');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.btnSingle.addEventListener('click', () => {
            this.startSinglePlay();
        });

        this.btnMulti.addEventListener('click', () => {
            this.startMultiPlay();
        });

        this.btnMenu.addEventListener('click', () => {
            this.showMainMenu();
        });

        this.btnQuit.addEventListener('click', () => {
            this.quitGame();
        });
        
        if (this.btnSpecQuit) {
            this.btnSpecQuit.addEventListener('click', () => {
                this.quitGame();
            });
        }
    }

    startSinglePlay() {
        this.hideAllScreens();
        this.opponentPanel.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        console.log("Starting Single Play...");
        // Initialize and start Game logic
        if (window.gameUI) {
            window.gameUI.startSinglePlayer();
        }
    }

    startMultiPlay() {
        this.hideAllScreens();
        this.waitingScreen.classList.remove('hidden');
        console.log("Starting Multi Play, connecting to server...");
        if (window.multiplayerHandler) {
            window.multiplayerHandler.startMatchmaking();
        }
    }

    quitGame() {
        if (window.gameUI && window.gameUI.game) {
            window.gameUI.stopGame();
        }
        
        if (window.multiplayerHandler && window.multiplayerHandler.socket) {
            window.multiplayerHandler.quitMatch();
        }
        
        this.showMainMenu();
    }

    showMainMenu() {
        this.hideAllScreens();
        this.menuScreen.classList.remove('hidden');
    }

    showGameOver(message) {
        document.getElementById('result-message').textContent = message;
        this.gameOverScreen.classList.remove('hidden');
    }

    hideAllScreens() {
        this.menuScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.waitingScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        if (this.spectatorScreen) this.spectatorScreen.classList.add('hidden');
    }
}

// Initialize Menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.menuUI = new MenuUI();
});
