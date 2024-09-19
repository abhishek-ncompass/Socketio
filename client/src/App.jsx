import { useState, useEffect } from "react";
import "./App.css";
import  io  from "socket.io-client";
const socket = io.connect("http://localhost:3000")

function App() {
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");
  

  useEffect(()=>{
    socket.on("recieved_message", (data)=>{
      setMessageRecieved(data.message)
      console.log(data.message)
    })
  },[socket])

  const sendMessage = ()=>{
    socket.emit('send_message', {message})
    // socket.emit('send_message', {message: "You have been added to an event as a participant."})
    console.log('socketing')
    setMessage("")
  }

  return (
    <>
      <h1>{message}</h1>
        <input type="text" onChange={(event)=>setMessage(event.target.value)} placeholder="text" />
        <button type="submit" onClick={sendMessage}>Submit</button>
      <h2>Message: {messageRecieved}</h2>
    </>
  );
}

export default App;