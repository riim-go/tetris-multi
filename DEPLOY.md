# Deployment Guide

이 프로젝트는 프론트엔드와 서버를 분리 배포한다.

---

# Repository Structure

project/

src/ frontend/ server/

docs/ tasks/ ai/

---

# Frontend Deployment

Platform GitHub Pages

Source Directory src/frontend

Build 정적 HTML / JS 프로젝트이므로 별도 build 과정 없음

Deployment Steps

1. GitHub repository 생성
2. 프로젝트 push
3. GitHub Pages 설정

Settings → Pages

Source Deploy from branch

Branch main

Folder /src/frontend

Frontend URL Example

https://username.github.io/project-name

---

# Server Deployment

Platform Render 또는 Railway

Source Directory src/server

Required Files

src/server/

package.json index.js

Example package.json

{ "name": "tetris-server", "version": "1.0.0", "main": "index.js", "scripts": { "start": "node index.js" }, "dependencies": { "express": "^4.18.0", "socket.io": "^4.7.0", "cors": "^2.8.5" } }

---

# Render Deployment

1. Render 가입
2. New Web Service 선택
3. GitHub repository 연결

Settings

Root Directory src/server

Build Command npm install

Start Command npm start

---

# Environment

Server Example URL

https://tetris-server.onrender.com

---

# Frontend Server Connection

frontend/network/socket.js

Example

const socket = io("https://tetris-server.onrender.com");

---

# CORS Configuration

src/server/index.js

Example

const cors = require("cors");

app.use(cors({ origin: "\*" }));

---

# Deployment Result

Frontend

GitHub Pages

Server

Render / Railway

Architecture

Frontend (GitHub Pages) ↓ WebSocket ↓ Node Server (Render)
