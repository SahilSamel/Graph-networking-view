import React, { useEffect, useState } from "react";
import POST from "@/api/POST/POST";

const DisplayCommunity = ({ commName }) => {
  const [comm, setComm] = useState(null);
  useEffect(() => {
    console.log("commName: " + commName);
    const jsonData = JSON.stringify({ commName });
    console.log(jsonData);

    POST("/chat/getProfileFromCommName", jsonData, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        if (data) {
          console.log(data);
          setComm(data);
        }
      }
    });
  }, [commName]);
  return (
    <div>
      {comm && (
        <div>
          <div className="flex justify-center mb-4">
            <img
              src={comm.profImgURL}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">{comm.commName}</h2>

            <p className="text-gray-700">{comm.commBio}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayCommunity;
