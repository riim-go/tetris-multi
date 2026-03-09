import { Board } from './board.js';
import { Tetromino } from './tetromino.js';

export class Game {
    constructor(isMultiplayer = false) {
        this.isMultiplayer = isMultiplayer;
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.nextCanvas = document.getElementById('next-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // Hold removed
        
        this.scoreElement = document.getElementById('score');
        
        // 캔버스 크기 고정 (CSS와 동일 비율 유지)
        this.canvas.width = 300;
        this.canvas.height = 600;
        // next, hold 캔버스 블록 크기 맞춤 스케일링 (120/4 = 30픽셀)
        this.board = new Board(this.ctx, this.nextCtx);
        
        this.piece = null;
        this.nextPiece = null;
        this.nextPiece = null;
        // Hold removed
        
        this.score = 0;
        this.lines = 0;
        this.isGameOver = false;
        
        this.dropInterval = 1000;
        this.lastDropTime = 0;
        this.animationId = null;
        
        // Hold removed

        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowDown: false
        };

        this.initControls();
    }

    getRandomPiece() {
        const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        const type = types[Math.floor(Math.random() * types.length)];
        return new Tetromino(type);
    }

    start() {
        this.board.reset();
        this.score = 0;
        this.lines = 0;
        this.isGameOver = false;
        this.piece = this.getRandomPiece();
        this.nextPiece = this.getRandomPiece();
        this.nextPiece = this.getRandomPiece();
        // Hold removed
        this.updateScore();
        
        this.board.drawNext(this.nextPiece);
        // Hold removed
        
        this.lastDropTime = performance.now();
        this.animate();
    }

    stop() {
        cancelAnimationFrame(this.animationId);
        this.isGameOver = true;
    }

    animate(time = 0) {
        if (this.isGameOver) return;

        const deltaTime = time - this.lastDropTime;
        
        // Soft drop
        let currentDropInterval = this.keys.ArrowDown ? 50 : this.dropInterval;

        if (deltaTime > currentDropInterval) {
            this.moveDown();
            this.lastDropTime = time;
        }

        this.board.draw(this.piece);
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    moveDown() {
        if (this.board.isValidPos(this.piece, this.piece.x, this.piece.y + 1)) {
            this.piece.y++;
        } else {
            this.lockPiece();
        }
    }

    hardDrop() {
        while (this.board.isValidPos(this.piece, this.piece.x, this.piece.y + 1)) {
            this.piece.y++;
        }
        this.updateScore();
        this.lockPiece();
    }

    lockPiece() {
        // 블록이 꼭대기를 넘어서 고정되면 게임 오버
        if (this.piece.y <= 0) {
            this.gameOver();
            return;
        }
        
        this.board.freeze(this.piece);
        let linesCleared = this.board.clearLines();
        
        if (linesCleared > 0) {
            this.addScore(linesCleared);
            this.lines += linesCleared;
            
            // 멀티플레이 시 garbage 발송
            if (this.isMultiplayer && window.multiplayerHandler) {
                // 단순화: 2줄 이상일 때 (줄 수 - 1)만큼 공격
                let garbage = linesCleared > 1 ? linesCleared - 1 : 0;
                if (garbage > 0) {
                    window.multiplayerHandler.sendGarbage(garbage);
                }
            }
        }
        
        this.piece = this.nextPiece;
        this.nextPiece = this.getRandomPiece();
        this.board.drawNext(this.nextPiece);
        
        // Hold removed

        if (!this.board.isValidPos(this.piece, this.piece.x, this.piece.y)) {
            this.gameOver();
        }
    }

    // Hold removed

    addScore(lines) {
        const scores = [0, 100, 300, 500, 800];
        this.score += scores[lines] || 0;
        this.updateScore();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        if (this.isMultiplayer && window.multiplayerHandler) {
            window.multiplayerHandler.sendScore(this.score);
        }
    }

    gameOver() {
        this.stop();
        if (this.isMultiplayer && window.multiplayerHandler) {
            window.multiplayerHandler.sendGameOver();
        } else {
            window.menuUI.showGameOver("You Lost!");
        }
    }
    
    addGarbageLines(lines) {
        // 쓰레기 줄을 바닥에 추가하고 맨 윗 줄부터 밀어올림
        for (let i = 0; i < lines; i++) {
            this.board.grid.shift();
            // 빈 칸이 하나 있는 가비지 라인 생성
            let garbageRow = Array(10).fill(8); // 8 represents a gray garbage block
            garbageRow[Math.floor(Math.random() * 10)] = 0;
            this.board.grid.push(garbageRow);
        }
        // 원래 위치된 블록도 위로 밀어올림
        this.piece.y -= lines;
        this.board.draw(this.piece);
    }

    initControls() {
        document.addEventListener('keydown', (e) => {
            if (this.isGameOver) return;
            
            switch(e.code) {
                case 'ArrowLeft':
                    if (this.board.isValidPos(this.piece, this.piece.x - 1, this.piece.y)) {
                        this.piece.x--;
                    }
                    this.keys.ArrowLeft = true;
                    break;
                case 'ArrowRight':
                    if (this.board.isValidPos(this.piece, this.piece.x + 1, this.piece.y)) {
                        this.piece.x++;
                    }
                    this.keys.ArrowRight = true;
                    break;
                case 'ArrowUp':
                    let newShape = this.piece.rotate();
                    if (this.board.isValidPos(this.piece, this.piece.x, this.piece.y, newShape)) {
                        this.piece.shape = newShape;
                    }
                    break;
                case 'ArrowDown':
                    this.keys.ArrowDown = true;
                    break;
                // Hold removed
                case 'Space':
                    this.hardDrop();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.code)) {
                this.keys[e.code] = false;
            }
        });
    }
}
