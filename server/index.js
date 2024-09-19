const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let connectedSockets = new Set();
let socketObjects = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  connectedSockets.add(socket.id);
  socketObjects.push(socket);

  console.log("Connected sockets:", [...connectedSockets]);

  socket.emit("update_connected_sockets", [...connectedSockets].filter(id => id !== socket.id));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    connectedSockets.delete(socket.id);
    socketObjects = socketObjects.filter((socketObject) => socketObject.id !== socket.id);
    console.log("Connected sockets:", [...connectedSockets]);

    socketObjects.forEach((socketObject) => {
      socketObject.emit("update_connected_sockets", [...connectedSockets].filter(id => id !== socketObject.id));
    });
  });

  socket.on("get_string_length", (userInput) => {
    const length = userInput.length;
    socket.emit("string_length", length);
    console.log(socket.id)
  });

  socket.on("send_message", (targetSocketId, message) => {
    const targetSocket = socketObjects.find((socketObject) => socketObject.id === targetSocketId);
    if (targetSocket) {
      targetSocket.emit("message", message);
      console.log(`Sent message to socket ${targetSocketId}: ${message}`);
    } else {
      console.log(`Socket ${targetSocketId} not found`);
    }
  });

  socket.on("getAllSocketIds", () => {
    socket.emit("allSocketIds", [...connectedSockets].filter(id => id !== socket.id));
    socket.broadcast.emit("allSocketIds", [...connectedSockets].filter(id => id !== socket.id));
  });
});



server.listen(3005, () => {
  console.log("Server is running on port: 3005");
});