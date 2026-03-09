import { COLS, ROWS, COLORS, BLOCK_SIZE } from './tetromino.js';

export class Board {
    constructor(ctx, nextCtx) {
        this.ctx = ctx;
        this.nextCtx = nextCtx;
        // Hold removed
        this.grid = this.getEmptyBoard();
    }

    getEmptyBoard() {
        return Array.from({length: ROWS}, () => Array(COLS).fill(0));
    }

    reset() {
        this.grid = this.getEmptyBoard();
    }

    // 블록이 보드 내에 있고 다른 블록과 충돌하지 않는지 확인
    isValidPos(piece, newX, newY, newShape) {
        let shape = newShape || piece.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] > 0) {
                    let nextX = newX + x;
                    let nextY = newY + y;
                    
                    // 벽 충돌 (좌, 우, 하단)
                    if (nextX < 0 || nextX >= COLS || nextY >= ROWS) {
                        return false;
                    }
                    // 기존 블록과 충돌 (위쪽 뚫고 나가는 경우는 무시 가능, 하지만 실제 게임에선 게임오버 조건)
                    if (nextY >= 0 && this.grid[nextY][nextX] > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // 보드에 블록 고정
    freeze(piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] > 0) {
                    // 블록이 보드 바깥에 고정되려고 하면 무시하거나 게임오버 처리 필요
                    if (piece.y + y >= 0) {
                        this.grid[piece.y + y][piece.x + x] = piece.colorIndex;
                    }
                }
            }
        }
    }

    // 완성된 줄 제거하고 제거된 줄 수 반환
    clearLines() {
        let linesCleared = 0;
        
        for (let y = ROWS - 1; y >= 0; y--) {
            let isFull = true;
            for (let x = 0; x < COLS; x++) {
                if (this.grid[y][x] === 0) {
                    isFull = false;
                    break;
                }
            }
            
            if (isFull) {
                // 해당 줄 삭제 후 맨 위에 빈 줄 추가
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++; // 줄이 내려왔으므로 현재 y 인덱스 다시 검사
            }
        }
        
        return linesCleared;
    }

    draw(piece) {
        // 화면 지우기
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // 보드에 고정된 블록 그리기
        this.drawMatrix(this.ctx, this.grid, 0, 0);

        // 현재 조작 중인 블록 그리기
        if (piece) {
            // Drop 위치 미리보기 (Ghost piece) 그리기 (선택사항)
            let ghostY = piece.y;
            while(this.isValidPos(piece, piece.x, ghostY + 1)) {
                ghostY++;
            }
            this.ctx.globalAlpha = 0.2;
            this.drawMatrix(this.ctx, piece.shape, piece.x, ghostY);
            this.ctx.globalAlpha = 1.0;

            // 실제 블록 그리기
            this.drawMatrix(this.ctx, piece.shape, piece.x, piece.y);
        }
    }

    drawMatrix(ctx, matrix, offsetX, offsetY) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] > 0) {
                    ctx.fillStyle = COLORS[matrix[y][x]];
                    // 셀 크기에 맞춰 그리기
                    let drawX = (offsetX + x) * BLOCK_SIZE;
                    let drawY = (offsetY + y) * BLOCK_SIZE;
                    ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                    // 윤곽선
                    ctx.strokeStyle = '#222';
                    ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    drawNext(piece) {
        this.nextCtx.fillStyle = '#1e1e1e';
        this.nextCtx.fillRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
        // 중앙 정렬을 위한 offset 계산 필요 (간략화하여 1, 1 부터)
        let offsetX = (4 - piece.shape[0].length) / 2;
        let offsetY = (4 - piece.shape.length) / 2;
        this.drawMatrix(this.nextCtx, piece.shape, offsetX, offsetY);
    }
    
    // Hold removed
}
