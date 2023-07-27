import React, { useEffect, useState } from "react";
import POST from "@/api/POST/POST";
import DisplayUser from "./DisplayUser";
import DisplayCommunity from "./DisplayCommunity";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import GET from "@/api/GET/GET";

const Sidebar = ({ nodeid, commName, isComm }) => {
  // Add state to control the visibility of the sidebar
  const [showSidebar, setShowSidebar] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    console.log("Fetching Recommendations");
    GET(`/graph/getRecommendations`, async function (err, data) {
      if (err) {
        console.log(err, "Error");
      } else {
        await setRecommendations(data);
        console.log(recommendations);
      }
    });
  }, []);

  // Function to toggle the visibility of the sidebar

  return (
    <div className="mobile:absolute mobile:z-10">
      <div
        className={`fixed top-0 right-0 w-64 h-screen p-4 shadow transition-transform duration-300 border-r-2 drop-shadow-md ${
          showSidebar ? "transform translate-x-0" : "transform translate-x-full"
        }`}
      >
        <div>
          {/* User Information */}
          {!isComm && <DisplayUser nodeid={nodeid} />}
          {isComm && <DisplayCommunity commName={commName} />}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <ul className="mt-4 space-y-4">
            {recommendations.map((recommendation) => (
              <li
                key={recommendation.userId}
                className="flex items-center space-x-4 px-2 py-1 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-100"
              >
                <img
                  src={recommendation.profImgURL}
                  alt="Profile Picture"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-600">@{recommendation.userName}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
