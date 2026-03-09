const { Queue } = require('../matchmaking/queue');
const { RoomManager } = require('../rooms/roomManager');

module.exports = function setupSocketEvents(io) {
    const queue = new Queue();
    const roomManager = new RoomManager();

    io.on('connection', (socket) => {
        console.log(`Player connected: ${socket.id}`);
        
        socket.on('joinMulti', () => {
            console.log(`Player ${socket.id} joined matchmaking`);
            
            // Check if there's already an active room to spectate
            const activeRoom = roomManager.getActiveRoom();
            if (activeRoom) {
                console.log(`Player ${socket.id} joined as spectator to room ${activeRoom.id}`);
                roomManager.addSpectator(activeRoom.id, socket);
                socket.emit('startSpectator', { roomId: activeRoom.id, players: activeRoom.players.map(p => p.id) });
                return;
            }
            
            queue.addPlayer(socket);
            socket.emit('waitingPlayer', { status: 'waiting' });
            
            checkMatch();
        });

        socket.on('boardUpdate', (payload) => {
            if (socket.roomId && !socket.isSpectator) {
                const opponent = roomManager.getOpponent(socket.roomId, socket.id);
                if (opponent) {
                    opponent.emit('opponentBoard', payload);
                }
                
                // Broadcast to spectators
                socket.to(socket.roomId).emit('spectatorBoardUpdate', { 
                    playerId: socket.id, 
                    board: payload.board 
                });
            }
        });

        socket.on('garbageAttack', (payload) => {
            if (socket.roomId && !socket.isSpectator) {
                const opponent = roomManager.getOpponent(socket.roomId, socket.id);
                if (opponent) {
                    opponent.emit('receiveGarbage', payload);
                }
            }
        });

        socket.on('gameOver', () => {
             if (socket.roomId) {
                 const opponent = roomManager.getOpponent(socket.roomId, socket.id);
                 if (opponent) {
                     // Opponent wins
                     opponent.emit('gameResult', { winner: opponent.id });
                     socket.emit('gameResult', { winner: opponent.id });
                 }
                 
                 // Clean up room
                 roomManager.removeRoom(socket.roomId);
             }
        });

        socket.on('scoreUpdate', (payload) => {
             if (socket.roomId && !socket.isSpectator) {
                 const opponent = roomManager.getOpponent(socket.roomId, socket.id);
                 if (opponent) {
                     opponent.emit('opponentScore', payload);
                 }
                 
                 // Broadcast to spectators
                 socket.to(socket.roomId).emit('spectatorScoreUpdate', {
                     playerId: socket.id,
                     score: payload.score
                 });
             }
        });

        socket.on('quitMatch', () => {
             if (socket.roomId) {
                 const room = roomManager.getRoom(socket.roomId);
                 
                 if (socket.isSpectator) {
                     // Just leave if spectator
                     if (room) {
                         room.spectators = room.spectators.filter(s => s.id !== socket.id);
                     }
                     socket.leave(socket.roomId);
                     delete socket.roomId;
                     return;
                 }
                 
                 const opponent = roomManager.getOpponent(socket.roomId, socket.id);
                 if (opponent) {
                     opponent.emit('opponentQuit');
                     opponent.leave(socket.roomId);
                     delete opponent.roomId;
                 }
                 
                 // Notify spectators
                 socket.to(socket.roomId).emit('spectatorGameEnded', { reason: 'Player quit' });
                 if (room && room.spectators) {
                     room.spectators.forEach(s => {
                         s.leave(socket.roomId);
                         delete s.roomId;
                     });
                 }
                 
                 socket.leave(socket.roomId);
                 roomManager.removeRoom(socket.roomId);
                 delete socket.roomId;
             }
             if (queue.has(socket)) {
                 queue.removePlayer(socket);
             }
        });

        socket.on('disconnect', () => {
            console.log(`Player disconnected: ${socket.id}`);
            if (queue.has(socket)) {
                queue.removePlayer(socket);
            }
            
            if (socket.roomId) {
                const room = roomManager.getRoom(socket.roomId);
                
                if (socket.isSpectator) {
                    if (room) {
                        room.spectators = room.spectators.filter(s => s.id !== socket.id);
                    }
                    delete socket.roomId;
                    return;
                }
                
                const opponent = roomManager.getOpponent(socket.roomId, socket.id);
                if (opponent) {
                    opponent.emit('gameResult', { winner: opponent.id });
                    opponent.leave(socket.roomId);
                    delete opponent.roomId;
                }
                
                // Notify spectators
                socket.to(socket.roomId).emit('spectatorGameEnded', { reason: 'Player disconnected' });
                if (room && room.spectators) {
                     room.spectators.forEach(s => {
                         s.leave(socket.roomId);
                         delete s.roomId;
                     });
                 }
                
                roomManager.removeRoom(socket.roomId);
            }
        });

        function checkMatch() {
            const match = queue.getMatch();
            if (match) {
                const [p1, p2] = match;
                const roomId = roomManager.createRoom(p1, p2);
                console.log(`Match created: ${roomId} with ${p1.id} and ${p2.id}`);
                
                io.to(roomId).emit('startGame', { roomId });
            }
        }
    });
};
