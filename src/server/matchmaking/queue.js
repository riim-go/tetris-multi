class Queue {
    constructor() {
        this.players = [];
    }

    addPlayer(socket) {
        if (!this.players.includes(socket)) {
            this.players.push(socket);
        }
    }

    removePlayer(socket) {
        this.players = this.players.filter(p => p.id !== socket.id);
    }

    getMatch() {
        if (this.players.length >= 2) {
            const p1 = this.players.shift();
            const p2 = this.players.shift();
            return [p1, p2];
        }
        return null;
    }
    
    has(socket) {
        return this.players.some(p => p.id === socket.id);
    }
}

module.exports = { Queue };
