const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const setupSocketEvents = require('./socket/events');

const app = express();
app.use(cors({ origin: "*" }));
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize socket networking
setupSocketEvents(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Tetris Server listening on port ${PORT}`);
});
