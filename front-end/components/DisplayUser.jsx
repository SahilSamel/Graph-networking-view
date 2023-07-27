import React, { useEffect, useState } from "react";
import POST from "@/api/POST/POST";
import {
  IoMdMail,
  IoMdBriefcase,
  IoMdSchool,
  IoMdHeart,
  IoIosPeople,
} from "react-icons/io";
import { get } from "http";
const DisplayUser = ({ nodeid }) => {
  const [node, setNode] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    const getNode = async () => {
      const jsonData = JSON.stringify({ nodeid });
      POST("/chat/getProfileFromId", jsonData, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          if (data) {
            setNode(data);
          }
        }
      });
    };

    const checkConnection = async () => {
      const jsonData = JSON.stringify({ n_userId: nodeid });
      POST("/profile/getIfConnected", jsonData, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          if (data) {
            console.log(data);
            setIsFollowing(data.isConnected);
          }
        }
      });
    };
    getNode();
    checkConnection();
  }, [nodeid]);

  const sendConnectionRequest = () => {
    POST(
      "/graph/sendRequest",
      JSON.stringify({ n_userId: nodeid }),
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      }
    );
  };

  const removeConnection = () => {
    POST(
      "/graph/deleteConnection",
      JSON.stringify({ n_userId: nodeid }),
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      }
    );
  };

  return (
    <div>
      {node && (
        <>
          <div className="flex justify-center mb-4">
            <img
              src={node.profile_image_url}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full"
            />
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold">{node.name}</h2>
            <p className="text-gray-600">@{node.username}</p>
            <p className="text-gray-700">{node.bio}</p>
          </div>

          <div className="mt-4">
            <p className="flex items-center mb-2">
              <IoMdMail className="mr-2 text-gray-600" />
              <strong>Email:</strong> {node.email}
            </p>
            <p className="flex items-center mb-2">
              <IoMdBriefcase className="mr-2 text-gray-600" />
              <strong>Occupation:</strong> {node.occupation}
            </p>
            <p className="flex items-center mb-2">
              <IoMdSchool className="mr-2 text-gray-600" />
              <strong>Education:</strong> {node.education}
            </p>
            <p className="flex items-center mb-2">
              <IoMdHeart className="mr-2 text-gray-600" />
              <strong>Hobbies:</strong> {node.hobbies}
            </p>
            <p className="flex items-center">
              <IoIosPeople className="mr-2 text-gray-600" />
              <strong>Connections:</strong> {node.num_connections}
            </p>
          </div>

          {/* Show the "Send Request" button if not following */}
          {!isFollowing && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded"
              onClick={sendConnectionRequest}
            >
              Send Request
            </button>
          )}

          {/* Show "You are following them!" message and "Remove Connection" button if following */}
          {isFollowing && (
            <div>
              <p className="text-green-600 font-semibold mt-4">
                You are following them!
              </p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 mt-2 rounded"
                onClick={removeConnection}
              >
                Remove Connection
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DisplayUser;
