import React, { useEffect, useState } from "react";
import POST from "@/api/POST/POST";
import GET from "@/api/GET/GET";
import { getFirestore } from "firebase/firestore";
import { useSelector } from "react-redux";
import { set } from "react-hook-form";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { get } from "http";
import { current } from "@reduxjs/toolkit";

const Chat = () => {
  const currentUserId = useSelector((state) => state.auth.userId);
  const [user, setUser] = useState(null);
  const[currentUser, setCurrentUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const getProfile = async (userId) => {
    J
    POST("/chat/getProfileFromId", { userId }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
    
        return data;
      }
    });
  };
  useEffect(() => {
    GET("/graph/getConnectionsObj", function (err, data) {
      if (err) {
        console.log(err);
      } else {
        
        setConnections(data);
      }
    });
    console.log("CURRENT",currentUserId);
    getProfile(currentUserId).then((data) => {
      setCurrentUser(data);
    });

  }, []);
  const handleSelect = async(connection) => {
    getProfile(connection).then((data) => {
      setUser(data);
      console.log("USER",user);
    });

    //check whether the group(chats in firestore) exists, if not create
    // const combinedId =
    //   currentUserId > userId
    //     ? currentUserId + userId
    //     : userId + currentUserId;
    // try {
    //   const res = await getDoc(doc(db, "chats", combinedId));

    //   if (!res.exists()) {
    //     //create a chat in chats collection
    //     await setDoc(doc(db, "chats", combinedId), { messages: [] });

    //     //create user chats
    //     await updateDoc(doc(db, "userChats", currentUserId), {
    //       [combinedId + ".userInfo"]: {
    //         uid: userId,
    //         displayName: user.displayName,
    //         photoURL: user.photoURL,
    //       },
    //       [combinedId + ".date"]: serverTimestamp(),
    //     });

    //     await updateDoc(doc(db, "userChats", userId), {
    //       [combinedId + ".userInfo"]: {
    //         uid: currentUserId,
    //         displayName: currentUser.displayName,
    //         photoURL: currentUser.photoURL,
    //       },
    //       [combinedId + ".date"]: serverTimestamp(),
    //     });
    //   }
    // } catch (err) {}
  }

  return (
    <div>
      <ul>
      {
        connections.map((connection) => {
          return(
            <li onClick={()=>handleSelect(connection)}>
              connection: {connection}
            </li>
          )
      })
      }
      
      </ul>
    </div>

  )
};

export default Chat;
