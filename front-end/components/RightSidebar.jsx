import React, { useEffect,useState } from 'react';
import POST from "@/api/POST/POST";



const Sidebar = ({ nodeid  }) => {
  const [node, setNode] = useState()
    useEffect(() => {
      const jsonData = JSON.stringify({nodeid})
      console.log(jsonData)
        POST ("/chat/getProfileFromId", jsonData, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            if (data) {
              console.log(data)
              setNode(data)
            }
            

          }
        })
    },[nodeid])

    
  return (
    <div className="fixed top-0 right-0 w-64 h-screen bg-gray-200 p-4 shadow">
      {/* User Information */}
      {node ? (
        <div>
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
      <p>
        <strong>Email:</strong> {node.email}
      </p>
      <p>
        <strong>Occupation:</strong> {node.occupation}
      </p>
      <p>
        <strong>Education:</strong> {node.education}
      </p>
      <p>
        <strong>Hobbies:</strong> {node.hobbies}
      </p>
      <p>
        <strong>Connections:</strong> {node.num_connections}
      </p>
    </div>
    </div>

      ) : (
        <p className="text-red-500">No user information available.</p>
      )}
    </div>
  );
};

export default Sidebar;
