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
             if (this.game && !this.game.isGameOver) {
                 this.game.stop();
                 window.menuUI.showGameOver("Opponent Quit. You Win!");
             }
        });
    }

    startGame() {
        // UI 전환: 대기 화면 숨기고 게임 화면 표시
        window.menuUI.waitingScreen.classList.add('hidden');
        window.menuUI.opponentPanel.classList.remove('hidden');
        window.menuUI.gameScreen.classList.remove('hidden');

        this.opponentScoreElement.textContent = "0";

        if (!this.game) {
            this.game = new Game(true); // 멀티플레이어 모드로 생성
        }
        
        this.game.start();
        
        // 주기적으로 보드 상태 전송 (예: 200ms)
        this.syncInterval = setInterval(() => {
            if (this.game && !this.game.isGameOver) {
                this.socket.emit('boardUpdate', { board: this.game.board.grid });
            }
        }, 200);
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
}

window.multiplayerHandler = new MultiplayerHandler();
