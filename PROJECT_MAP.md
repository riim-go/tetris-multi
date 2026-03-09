# Project Map

이 문서는 프로젝트의 **절대 디렉토리 구조 규칙**을 정의한다.  
AI는 코드 생성 시 반드시 이 구조를 따라야 한다.

---

# Root Directory Rules

프로젝트 루트에는 다음 폴더만 존재해야 한다.

project/

START.md  
PROJECT_MAP.md

src/  
docs/  
tasks/  
ai/

AI는 **루트에 새로운 폴더를 생성하면 안 된다.**

금지 예시

frontend/  
server/  
client/  
backend/

이러한 폴더는 **src 내부에만 생성 가능하다.**

---

# Source Code Location

모든 실행 코드는 반드시 **src 폴더 내부에 생성한다.**

Structure

src/

frontend/  
server/

---

# Frontend

웹 클라이언트 코드

Structure

src/frontend/

index.html  
style.css

game/  
network/  
ui/

---

# frontend/game

게임 엔진 코드

board.js  
tetromino.js  
game.js

---

# frontend/network

멀티플레이 네트워크 코드

socket.js  
multiplayer.js

---

# frontend/ui

UI 코드

menu.js  
game_ui.js

---

# Server

Node.js 멀티플레이 서버

Structure

src/server/

index.js

socket/  
matchmaking/  
rooms/

---

# server/socket

WebSocket 이벤트 처리

events.js

---

# server/matchmaking

플레이어 매칭 로직

queue.js

---

# server/rooms

게임 룸 관리

roomManager.js

---

# Documentation

docs/

PRD.md  
ARCHITECTURE.md  
GAME_RULES.md  
WEBSOCKET_API.md  
DEV_PLAN.md  
GAME_ENGINE_SPEC.md

---

# Tasks

tasks/

TASKS.md

---

# AI Configuration

ai/

PROJECT_CONTEXT.md  
CODING_RULES.md  
AGENT_RULES.md

---

# Critical Rules

AI는 반드시 다음 규칙을 따른다.

1. 모든 코드는 **src 폴더 내부에 생성한다**
2. 루트에 새로운 폴더를 생성하지 않는다
3. 기존 구조를 변경하지 않는다
4. 새 기능은 기존 폴더 구조에 맞게 추가한다
5. 서버와 클라이언트 코드를 분리한다

---

# Correct Example

project/

src/ frontend/ server/

docs/ tasks/ ai/

---

# Incorrect Example

project/

frontend/ server/

docs/
