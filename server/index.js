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
        if(data.room == ""){
            socket.broadcast.emit("recieved_message",data.message)
        }
        else{
            socket.to(data.room).emit("recieved_message",data.message)
        }
        console.log(data.message)
        console.log(data.room)
    })
    socket.on("join_room", room =>{
        socket.join(room)
    })
})

server.listen(3000, ()=>{
    console.log('server is running on port: 3000')
})
