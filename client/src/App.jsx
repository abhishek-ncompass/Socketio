import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import '../App.css'

const socket = io.connect("http://localhost:3005");

function App() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [connectedSockets, setConnectedSockets] = useState([]); 
  const [customMessages, setCustomMessages] = useState({}); 
  const [receivedMessage, setReceivedMessage] = useState(""); 
  const [user, setUser] = useState([socket.id])
  const email = localStorage.getItem("email");

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleCustomMessageChange = (socketId, event) => {
    setCustomMessages((prevMessages) => ({ ...prevMessages, [socketId]: event.target.value }));
  };

  const handleButtonClick = () => {
    socket.emit("get_string_length", userInput);
  };

  const handleSendMessage = (socketId, message) => {
    socket.emit("send_message", socketId, message);
  };

  useEffect(() => {
    socket.on("string_length", (length) => {
      setResult(`The length of the string is: ${length}`);
    });

    socket.on("update_connected_sockets", (users) => {
      setConnectedSockets(users);
    });

    socket.on("message", (message, senderSocketId) => {
      if (senderSocketId !== socket.id) {
        setReceivedMessage(message);
      }
    });

    socket.on("broadcast_message", (message, senderSocketId) => {
      if (senderSocketId !== socket.id) {
        setReceivedMessage(message); 
      }
    });
  }, [socket]);

  return (
    <div className="App">
      <h3>{email}:- {socket.id}</h3>
      <input type="text" value={userInput} onChange={handleInputChange} />
      <button onClick={handleButtonClick}>Get String Length</button>
      <p>{result}</p>
      <h2>Connected Sockets (except current one):</h2>
      <ul className="socketList">
        {connectedSockets.map((socketId, index) => (
          <li key={index}>
            {socket.id == socketId ? email : socketId}
            <input
              type="text"
              value={customMessages[socketId] || ""} 
              onChange={(event) => handleCustomMessageChange(socketId, event)}
              placeholder="Enter custom message"
            />
            <button onClick={() => handleSendMessage(socketId, customMessages[socketId])}>Send Message</button>
          </li>
        ))}
      </ul>
      <h3>{receivedMessage}</h3>
    </div>
  );
}

export default App;