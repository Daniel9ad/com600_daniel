const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

console.log("Servidor websocket escuchando en ws://localhost:8080");

server.on("connection")