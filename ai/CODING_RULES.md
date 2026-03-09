# Coding Rules

## Frontend

Language

- JavaScript (ES6)

Rendering

- HTML5 Canvas

Structure

src/ game/ network/ ui/

Rules

- 게임 로직은 game 폴더에 구현
- WebSocket 코드는 network 폴더에 구현
- UI 이벤트는 ui 폴더에 구현
- Canvas 기반 렌더링 사용

Example Structure

frontend/ index.html style.css

game/ board.js tetromino.js game.js

network/ socket.js

ui/ menu.js
