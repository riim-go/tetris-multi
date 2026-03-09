# Architecture

## Frontend

- HTML5
- Vanilla JavaScript
- Canvas rendering
- GitHub Pages 배포

## Backend

- Node.js
- Express
- Socket.io

## Server Hosting

- Railway / Render / VPS

## System Structure

Frontend (HTML5 + JS) ↓ WebSocket ↓ Game Server (Node.js)

## Multiplayer Flow

1. Player connect
2. joinMulti event
3. server queue push
4. queue size == 2
5. room 생성
6. startGame event

## Data Sync

Client

- 게임 로직 실행
- 블록 이동
- 라인 제거

Server

- 매칭 관리
- 이벤트 중계

## Multiplayer Event

joinMulti startGame boardUpdate garbageAttack gameOver
