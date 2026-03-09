const crypto = require('crypto');

class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(player1, player2) {
        const roomId = crypto.randomUUID();
        const room = {
            id: roomId,
            players: [player1, player2],
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

    getOpponent(roomId, playerId) {
        const room = this.getRoom(roomId);
        if (!room) return null;
        return room.players.find(p => p.id !== playerId);
    }
}

module.exports = { RoomManager };
