import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import io from 'socket.io-client'


const Message = () => {
    const userId = useSelector((state: any) => state.auth.userId);

    const socket = io("http://localhost:4200", {
      query: {
        customId: userId,
      },
    });
    
    const sendMessage = () => {
        socket.emit("sendMessage", {message: userId});
    }

    useEffect(() => {
      return () => {
        socket.on("receiveMessage", (data)=>{
            alert(data.message);
        })
      };
    }, [socket]);

    return (
        <div>
            <input type="text" placeholder='type here...' />
            <button onClick={sendMessage}> Send </button>
        </div>
    );
}

export default Message;