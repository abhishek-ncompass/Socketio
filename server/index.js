const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors")

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket)=>{
    console.log(`User connected: ${socket.id}`)

    socket.on("send_message", (data)=>{
        socket.broadcast.emit("recieved_message",data)
        console.log(data)
    })
})

server.listen(3000, ()=>{
    console.log('server is running on port: 3000')
})
