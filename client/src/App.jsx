import { useState, useEffect } from "react";
import "./App.css";
import  io  from "socket.io-client";
const socket = io.connect("http://localhost:3000")

function App() {
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");
  const [room, setRoom] = useState("")
  

  useEffect(()=>{
    socket.on("recieved_message", (data)=>{
      setMessageRecieved(data)
      console.log(data)
    })
  },[socket])

  const sendMessage = ()=>{
    socket.emit('send_message', {message, room})
    // socket.emit('send_message', {message: "You have been added to an event as a participant."})
    console.log('socketing')
    setMessage("")
  }

  const joinRoom = () =>{
    socket.emit("join_room", room)
  }

  return (
    <>
      <h1>{message}</h1>
        <input type="text" onChange={(event)=>setMessage(event.target.value)} placeholder="text" />
        <button type="submit" onClick={sendMessage}>message</button>
        <input type="text" onChange={(event)=>setRoom(event.target.value)} placeholder="text" />
        <button type="submit" onClick={joinRoom}>room</button>
      <h2>Message: {messageRecieved}</h2>
    </>
  );
}

export default App;