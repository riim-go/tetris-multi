import { getSocket, initSocket } from './socket.js';
import { Game } from '../game/game.js';

export class MultiplayerHandler {
    constructor() {
        this.socket = null;
        this.game = null;
        this.opponentCanvas = document.getElementById('opponent-canvas');
        this.opponentCtx = this.opponentCanvas.getContext('2d');
        // 스케일 설정: 150/10 = 15, 300/20 = 15
        this.opponentCtx.scale(15, 15);
        this.opponentScoreElement = document.getElementById('opponent-score');
        
        this.isSpectator = false;
        this.spectatorPlayers = [];
    }

    startMatchmaking() {
        this.socket = initSocket();
        
        this.socket.emit('joinMulti');
        
        this.socket.on('waitingPlayer', () => {
            console.log('Waiting for opponent...');
            // UI 업데이트는 menu.js에서 이미 waiting 화면을 띄웠음
        });

        this.socket.on('startGame', (data) => {
            console.log('Game started! Room ID:', data.roomId);
            this.startGame();
        });

        this.socket.on('opponentBoard', (payload) => {
            this.drawOpponentBoard(payload.board);
        });

        this.socket.on('receiveGarbage', (payload) => {
            if (this.game) {
                this.game.addGarbageLines(payload.lines);
            }
        });

        this.socket.on('gameResult', (payload) => {
            if (this.game) {
                this.game.stop();
                if (payload.winner === this.socket.id) {
                    window.menuUI.showGameOver("You Win!");
                } else {
                    window.menuUI.showGameOver("You Lost!");
                }
            }
        });

        this.socket.on('opponentScore', (payload) => {
            this.opponentScoreElement.textContent = payload.score;
        });

        this.socket.on('opponentQuit', () => {
             if (this.game && !this.game.isGameOver && !this.isSpectator) {
                 this.game.stop();
                 window.menuUI.showGameOver("Opponent Quit. You Win!");
             }
        });

        // Spectator events
        this.socket.on('startSpectator', (data) => {
            console.log('Joined as spectator! Room ID:', data.roomId);
            this.startSpectating(data.players);
        });

        this.socket.on('spectatorBoardUpdate', (payload) => {
            if (this.isSpectator) {
                if (payload.playerId === this.spectatorPlayers[0]) {
                    // Update main canvas directly as Player 1
                    this.drawSpectatorMainBoard(payload.board);
                } else if (payload.playerId === this.spectatorPlayers[1]) {
                    // Update opponent canvas as Player 2
                    this.drawOpponentBoard(payload.board);
                }
            }
        });

        this.socket.on('spectatorScoreUpdate', (payload) => {
            if (this.isSpectator) {
                if (payload.playerId === this.spectatorPlayers[0]) {
                    document.getElementById('player1-score').textContent = payload.score;
                } else if (payload.playerId === this.spectatorPlayers[1]) {
                    this.opponentScoreElement.textContent = payload.score;
                }
            }
        });

        this.socket.on('spectatorGameEnded', (payload) => {
            if (this.isSpectator) {
                window.menuUI.showGameOver(`Match Ended: ${payload.reason}`);
                // 3초 후 메인 메뉴로 자동 복귀
                setTimeout(() => {
                    window.menuUI.showMainMenu();
                }, 3000);
            }
        });
    }

    startGame() {
        // UI 전환: 대기 화면 숨기고 게임 화면 표시
        window.menuUI.waitingScreen.classList.add('hidden');
        window.menuUI.opponentPanel.classList.remove('hidden');
        window.menuUI.gameScreen.classList.remove('hidden');

        // Restore normal game UI 
        document.getElementById('score-panel').classList.remove('hidden');
        document.getElementById('next-panel').classList.remove('hidden');
        document.getElementById('btn-quit').textContent = 'Quit Game';
        
        const p1ScoreContainer = document.getElementById('player1-score-container');
        if (p1ScoreContainer) p1ScoreContainer.classList.add('hidden');
        
        const p1Name = document.getElementById('player1-name');
        if (p1Name) p1Name.classList.add('hidden');
        document.getElementById('player2-name').textContent = "OPPONENT";

        this.opponentScoreElement.textContent = "0";

        if (!this.game) {
            this.game = new Game(true); // 멀티플레이어 모드로 생성
        }
        
        this.game.start();
        
        // 주기적으로 보드 상태 전송 (예: 200ms)
        this.syncInterval = setInterval(() => {
            if (this.game && !this.game.isGameOver && !this.isSpectator) {
                this.socket.emit('boardUpdate', { board: this.game.board.grid });
            }
        }, 200);
    }
    
    startSpectating(players) {
        this.isSpectator = true;
        this.spectatorPlayers = players; // Array of 2 player IDs
        
        window.menuUI.waitingScreen.classList.add('hidden');
        window.menuUI.opponentPanel.classList.remove('hidden');
        window.menuUI.gameScreen.classList.remove('hidden');
        
        // Hide normal score and next panels in spectator view
        document.getElementById('score-panel').classList.add('hidden');
        document.getElementById('next-panel').classList.add('hidden');
        
        // Show player 1 score container
        const p1ScoreContainer = document.getElementById('player1-score-container');
        if (p1ScoreContainer) p1ScoreContainer.classList.remove('hidden');
        
        // Change quit button to initially text
        document.getElementById('btn-quit').textContent = '처음으로';
        
        // Update UI headers
        const p1Name = document.getElementById('player1-name');
        if (p1Name) {
            p1Name.textContent = "Player 1";
            p1Name.classList.remove('hidden');
        }
        document.getElementById('player2-name').textContent = "Player 2";
        
        document.getElementById('player1-score').textContent = "0";
        this.opponentScoreElement.textContent = "0";
        
        // Clear canvases initially
        const mainCanvas = document.getElementById('game-canvas');
        const mainCtx = mainCanvas.getContext('2d');
        mainCtx.fillStyle = '#111';
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        
        this.opponentCtx.fillStyle = '#000';
        this.opponentCtx.fillRect(0, 0, 10, 20);
    }
    
    sendGarbage(lines) {
        if (this.socket) {
            this.socket.emit('garbageAttack', { lines });
        }
    }

    sendGameOver() {
        if (this.socket) {
            this.socket.emit('gameOver');
            clearInterval(this.syncInterval);
        }
    }

    sendScore(score) {
        if (this.socket) {
            this.socket.emit('scoreUpdate', { score });
        }
    }

    quitMatch() {
        if (this.socket) {
            this.socket.emit('quitMatch');
            clearInterval(this.syncInterval);
        }
    }

    drawOpponentBoard(grid) {
        const COLORS = [
            'none', '#00ffff', '#0000ff', '#ffa500', '#ffff00', '#00ff00', '#800080', '#ff0000', '#888888' // 8은 garbage
        ];
        
        this.opponentCtx.fillStyle = '#000';
        this.opponentCtx.fillRect(0, 0, 10, 20); // 스케일링된 크기로 그림
        
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] > 0) {
                    this.opponentCtx.fillStyle = COLORS[grid[y][x]];
                    this.opponentCtx.fillRect(x, y, 1, 1);
                    this.opponentCtx.lineWidth = 0.1;
                    this.opponentCtx.strokeStyle = '#222';
                    this.opponentCtx.strokeRect(x, y, 1, 1);
                }
            }
        }
    }
    
    drawSpectatorMainBoard(grid) {
        // Draw the main board when spectating (does not use Game object to avoid logic interference)
        const mainCanvas = document.getElementById('game-canvas');
        const mainCtx = mainCanvas.getContext('2d');
        const BLOCK_SIZE = 30;
        
        const COLORS = [
            'none', '#00ffff', '#0000ff', '#ffa500', '#ffff00', '#00ff00', '#800080', '#ff0000', '#888888'
        ];
        
        mainCtx.fillStyle = '#111';
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] > 0) {
                    mainCtx.fillStyle = COLORS[grid[y][x]];
                    mainCtx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    mainCtx.strokeStyle = '#222';
                    mainCtx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
}

window.multiplayerHandler = new MultiplayerHandler();
