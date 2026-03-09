const crypto = require('crypto');

class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(player1, player2) {
        const roomId = crypto.randomUUID();
        const room = {
            id: roomId,
            players: [player1, player2], // length 2 max
            spectators: [], // array of spectator sockets
            createdAt: Date.now()
        };
        this.rooms.set(roomId, room);
        
        // Add sockets to the socket.io room
        player1.join(roomId);
        player2.join(roomId);
        
        // Save room info to socket
        player1.roomId = roomId;
        player2.roomId = roomId;
        
        return roomId;
    }

    getRoom(roomId) {
        return this.rooms.get(roomId);
    }

    removeRoom(roomId) {
        this.rooms.delete(roomId);
    }

    addSpectator(roomId, spectator) {
        const room = this.getRoom(roomId);
        if (room && room.players.length === 2) {
            room.spectators.push(spectator);
            spectator.join(roomId);
            spectator.roomId = roomId;
            spectator.isSpectator = true;
            return true;
        }
        return false;
    }

    getActiveRoom() {
        // Find the first room that is currently playing (has 2 players max)
        for (const [roomId, room] of this.rooms.entries()) {
            console.log(`Checking room ${roomId}: players=${room.players.length}`);
            if (room.players.length === 2) {
                return room;
            }
        }
        console.log('No active rooms found for spectating');
        return null;
    }

    getOpponent(roomId, playerId) {
        const room = this.getRoom(roomId);
        if (!room) return null;
        return room.players.find(p => p.id !== playerId);
    }
}

module.exports = { RoomManager };
