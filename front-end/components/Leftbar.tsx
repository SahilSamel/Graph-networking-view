import React, { useState } from "react";
import {
  AiFillHome,
  AiOutlineUser,
  AiOutlineMessage,
  AiOutlineSetting,
} from "react-icons/ai";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import GET from "@/api/GET/GET";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Leftbar = () => {

  const router = useRouter();

  useEffect(() => {
    GET(`/profile/getProfile`, function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        setProfileData(data.profile);
      }
    });
  }, []);

  const [isLeftbarVisible, setLeftbarVisible] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const renderProfile = () => {
    if (!profileData) {
      return null; // Return null or any loading indicator while data is being fetched
    }

    const { profile_image_url, username, name } = profileData;

    return (
      <div className="flex flex-col mb-5">
        <div className="flex justify-center p-5">
          <img
            src={profile_image_url}
            alt="Profile"
            style={{
              height: "175px",
              width: "175px",
            }}
            className="rounded-full"
          />
        </div>

        <div className="flex justify-center text-gray-500">@{username}</div>

        <div className="flex justify-center">{name}</div>
      </div>
    );
  };

  const handleToggleLeftbar = () => {
    console.log("Button clicked")
    setLeftbarVisible((prev) => !prev);
  };

  return (
    <div className="relative mobile:absolute mobile:z-10">
      <div
        style={{
          position: "relative" ,
          left: isLeftbarVisible ? "0px" : "-450px",
          transition: "left 0.3s ease-in-out",
        }}
        className="border-r-2 drop-shadow-md"
      >
        <div className="flex flex-col content-between px-7 py-5 h-screen">
          <div className="flex flex-col content-start">
            {renderProfile()}

            <div className="flex flex-col justify-end mr-8">
              <button className="flex flex-row mb-7 " onClick={()=> router.push("/home")}>
                <AiFillHome size={24} style={{ marginRight: "8px" }} />
                Home
              </button>
              <button className="flex flex-row mb-7 " onClick={()=> router.push("/profile")}>
                <AiOutlineUser size={24} style={{ marginRight: "8px" }} />
                Profile
              </button>
              <button className="flex flex-row mb-7 " onClick={()=> router.push("/messages")}>
                <AiOutlineMessage size={24} style={{ marginRight: "8px" }} />
                Messages
              </button>
              <button className="flex flex-row mb-7 " onClick={()=> router.push("/settings")}>
                <AiOutlineSetting size={24} style={{ marginRight: "8px" }} />
                Settings
              </button>
            </div>
          </div>

          <div className="flex flex-row">
            <RiLogoutCircleLine size={24} style={{ marginRight: "8px" }} />
            Logout
          </div>
        </div>
      </div>

      <button
        className={`toggle-button top-0 absolute p-2 rounded-full border mt-3 ${
          isLeftbarVisible ? "right-3" : "left-0"
        }`}
        style={{
          transition: "left 0.8s ease-in-out",
          left: isLeftbarVisible ? "auto" : "10px",
        }}
        onClick={handleToggleLeftbar}
      >
        {isLeftbarVisible ? (
          <IoIosArrowBack size={24} />
        ) : (
          <IoIosArrowForward size={24} />
        )}
      </button>
    </div>
  );
};

export default Leftbar;
