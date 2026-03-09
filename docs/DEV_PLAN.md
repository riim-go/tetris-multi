# Development Plan

이 문서는 AI가 프로젝트를 단계적으로 개발하기 위한 실행 계획이다.

---

## Phase 1 - Project Setup

목표프로젝트 기본 구조 생성

Tasks

- HTML 프로젝트 생성
- Canvas 게임 화면 생성
- 기본 폴더 구조 생성
- 메인 메뉴 UI 구현

Deliverables

- index.html 실행 가능
- Canvas 게임 화면 표시

---

## Phase 2 - Tetris Core Engine

목표  
테트리스 핵심 로직 구현

Tasks

- 보드 데이터 구조 생성 (10x20)
- 테트로미노 정의
- 블록 이동
- 블록 회전
- 충돌 감지
- 블록 고정
- 라인 검사
- 라인 제거
- 점수 시스템

Deliverables

- 싱글 플레이 가능한 게임

---

## Phase 3 - Single Player Mode

목표  
싱글 플레이 완성

Tasks

- 게임 시작 버튼
- 게임 오버 처리
- 점수 표시
- 다음 블록 표시
- Hold 블록 기능

Deliverables

- 완전한 싱글 플레이

---

## Phase 4 - Multiplayer Server

목표  
멀티플레이 서버 구축

Tasks

- Node.js 서버 생성
- Express 설정
- Socket.io 연결
- 매칭 큐 구현

Deliverables

- WebSocket 연결 가능 서버

---

## Phase 5 - Matchmaking System

목표  
멀티 플레이 매칭 구현

Tasks

- 플레이어 큐 관리
- 두 명 매칭 시 room 생성
- 게임 시작 이벤트 전송

Deliverables

- 두 플레이어 자동 매칭

---

## Phase 6 - Multiplayer Gameplay

목표  
멀티 게임 로직 구현

Tasks

- 보드 상태 동기화
- 라인 제거 시 garbage 공격
- 상대 보드 표시
- 게임 결과 처리

Deliverables

- 플레이어 간 실시간 대전

---

## Phase 7 - UI Improvements

목표  
게임 UI 개선

Tasks

- 상대 보드 미리보기
- 매칭 대기 화면
- 승리 / 패배 화면

Deliverables

- 완성된 게임 UI

---

## Phase 8 - Deployment

목표  
서비스 배포

Tasks

- 프론트 GitHub Pages 배포
- 서버 Railway / Render 배포
- WebSocket 연결 확인

Deliverables

- 온라인 플레이 가능
