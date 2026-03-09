export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30; // 픽셀 크기 (캔버스 비율 계산용)

export const COLORS = [
    'none',           // 0
    '#00ffff',        // 1: I (Cyan)
    '#0000ff',        // 2: J (Blue)
    '#ffa500',        // 3: L (Orange)
    '#ffff00',        // 4: O (Yellow)
    '#00ff00',        // 5: S (Green)
    '#800080',        // 6: T (Purple)
    '#ff0000'         // 7: Z (Red)
];

export const TETROMINOS = {
    I: {
        shape: [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        colorIndex: 1
    },
    J: {
        shape: [
            [2,0,0],
            [2,2,2],
            [0,0,0]
        ],
        colorIndex: 2
    },
    L: {
        shape: [
            [0,0,3],
            [3,3,3],
            [0,0,0]
        ],
        colorIndex: 3
    },
    O: {
        shape: [
            [4,4],
            [4,4]
        ],
        colorIndex: 4
    },
    S: {
        shape: [
            [0,5,5],
            [5,5,0],
            [0,0,0]
        ],
        colorIndex: 5
    },
    T: {
        shape: [
            [0,6,0],
            [6,6,6],
            [0,0,0]
        ],
        colorIndex: 6
    },
    Z: {
        shape: [
            [7,7,0],
            [0,7,7],
            [0,0,0]
        ],
        colorIndex: 7
    }
};

export class Tetromino {
    constructor(type) {
        this.type = type;
        this.shape = TETROMINOS[type].shape;
        this.colorIndex = TETROMINOS[type].colorIndex;
        // Spawn at top center
        this.x = Math.floor(COLS / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
    }

    rotate() {
        // 행렬 전치 후 각 행 반전 (시계방향 90도 회전)
        const newShape = [];
        for (let i = 0; i < this.shape.length; i++) {
            newShape.push([]);
            for (let j = 0; j < this.shape[i].length; j++) {
                newShape[i][j] = this.shape[this.shape.length - 1 - j][i];
            }
        }
        return newShape;
    }
}
