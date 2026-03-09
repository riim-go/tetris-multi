# WebSocket API

Transport: Socket.io

## Client → Server

joinMulti 멀티 플레이 매칭 요청

payload { playerId: string }

boardUpdate 현재 보드 상태 전송

payload { board: number[][] }

garbageAttack 라인 제거 시 상대 공격

payload { lines: number }

gameOver 게임 종료

payload { playerId: string }

---

## Server → Client

waitingPlayer 매칭 대기

payload { status: "waiting" }

startGame 게임 시작

payload { roomId: string }

opponentBoard 상대 보드 상태

payload { board: number[][] }

receiveGarbage 상대 공격 수신

payload { lines: number }

gameResult 게임 결과

payload { winner: string }
