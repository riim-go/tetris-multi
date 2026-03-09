// Will hold the global socket instance
export let socket = null;

// Replace this with your actual Render/Railway server URL (without trailing slash)
const DEPLOYED_SERVER_URL = "https://tetris-multi-server.onrender.com";

// Use empty URL if running locally, otherwise use deployed server
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
const SERVER_URL = isLocal ? "http://localhost:3000" : DEPLOYED_SERVER_URL;

export function initSocket() {
  if (!socket) {
    socket = window.io(SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}
