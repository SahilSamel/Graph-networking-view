import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import io, { Socket } from 'socket.io-client'; // Import the Socket type

const Message: React.FC = () => {
  const userId = useSelector((state: any) => state.auth.userId);

  const [socket, setSocket] = useState<Socket | null>(null); // Use the Socket type
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [receiverUserId, setReceiverUserId] = useState("");

  useEffect(() => {
    // Create the socket connection only once during the component's lifecycle
    const newSocket = io("http://localhost:4200", {
      query: {
        customId: userId,
      },
    });

    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const sendMessage = () => {
    if (message.trim() !== "" && receiverUserId.trim() !== "" && socket) {
      socket.emit("sendMessage", { message, receiverUserId });
      setMessage(""); // Clear the input field after sending the message
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (data: { message: string }) => {
        setReceivedMessage(data.message);
      });
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
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
