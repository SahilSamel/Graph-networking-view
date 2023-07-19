import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import io from 'socket.io-client';

const Message = () => {
  const userId = useSelector((state: any) => state.auth.userId);

  const socket = io("http://localhost:4200", {
    query: {
      customId: userId,
    },
  });

  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [receiverUserId, setReceiverUserId] = useState(""); // State variable to hold the receiver's user ID

  const sendMessage = () => {
    if (message.trim() !== "" && receiverUserId.trim() !== "") {
      socket.emit("sendMessage", { message, receiverUserId });
      setMessage(""); // Clear the input field after sending the message
    }
  };

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setReceivedMessage(data.message); // Update the receivedMessage state with the new message
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  return (
    <div>
      <div>
        <strong>Received Message:</strong> {receivedMessage}
      </div>
      <input
        type="text"
        placeholder="Receiver's User ID"
        value={receiverUserId}
        onChange={(e) => setReceiverUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}> Send </button>
    </div>
  );
};

export default Message;
