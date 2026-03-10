# Tetris Web Game PRD

## Overview

웹 기반 테트리스 게임. 싱글 플레이와 멀티 플레이 지원.

## Game Modes

### Single Mode

- 접속 즉시 게임 시작
- 로컬에서 게임 로직 실행
- 점수 기록

### Multi Mode

- 플레이어 매칭 시스템
- 1명 접속 시 대기
- 2명 접속 시 게임 시작

## Multiplayer Rules

- 각 플레이어는 자신의 보드에서 게임 진행
- 라인 제거 시 상대에게 garbage line 전송
- 먼저 게임오버 되는 플레이어 패배

## UI

### Main Menu

- Single Play
- Multi Play

### Game Screen

- Game board
- Score
- Next block

### Multiplayer UI

- 상대 보드 미리보기
- 매칭 대기 화면

## Platform

- Web Browser
- HTML5 + JavaScript 기반
- Desktop 우선
