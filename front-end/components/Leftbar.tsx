import React, { useState } from 'react';
import { AiFillHome, AiOutlineUser, AiOutlineMessage, AiOutlineSetting } from 'react-icons/ai';
import { RiLogoutCircleLine } from 'react-icons/ri';
import {IoIosArrowForward, IoIosArrowBack} from 'react-icons/io'

const Leftbar = () => {
    const [isLeftbarVisible, setLeftbarVisible] = useState(true);

    const handleToggleLeftbar = () => {
        setLeftbarVisible((prev) => !prev);
    };

    return (
        <div className="relative mobile:absolute mobile:z-10">
            <div
                style={{
                    position: isLeftbarVisible ? "relative":"absolute",
                    left: isLeftbarVisible ? "0" : "-450px",
                    transition: "left 0.3s ease-in-out",
                }}
                className='border-r-2 drop-shadow-md'
            >
                <div className="flex flex-col content-between px-7 py-5 h-screen">
                    <div className="flex flex-col content-start">
                        <div className="flex flex-col mb-5">
                            <div className="flex justify-center p-5">
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/graph-networking-app.appspot.com/o/apex_logo.jpg?alt=media&token=3f195bee-a2b4-470a-a363-aa4bce548aa4"
                                    alt="Profile"
                                    style={{
                                        height: "175px",
                                        width: "175px",
                                    }}
                                    className="rounded-full"
                                />
                            </div>

                            <div className="flex justify-center">
                                @sahil
                            </div>

                            <div className="flex justify-center">
                                Sahil Samel
                            </div>
                        </div>

                        <div className="flex flex-col justify-end mr-8">
                            <div className="flex flex-row mb-7 ">
                                <AiFillHome size={24} style={{ marginRight: "8px" }} />
                                Home
                            </div>
                            <div className="flex flex-row mb-7 ">
                                <AiOutlineUser size={24} style={{ marginRight: "8px" }} />
                                Profile
                            </div>
                            <div className="flex flex-row mb-7 ">
                                <AiOutlineMessage size={24} style={{ marginRight: "8px" }} />
                                Messages
                            </div>
                            <div className="flex flex-row mb-7 ">
                                <AiOutlineSetting size={24} style={{ marginRight: "8px" }} />
                                Settings
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-end">
                        <RiLogoutCircleLine size={24} style={{ marginRight: "8px" }} />
                        Logout
                    </div>
                </div>
            </div>

            <button
                className={`toggle-button top-0 absolute p-2 rounded-full border mt-3 ${isLeftbarVisible ? 'right-3' : 'left-0'}`}
                style={{
                    transition: 'left 0.8s ease-in-out',
                    left: isLeftbarVisible ? 'auto' : '10px'
                }}
                onClick={handleToggleLeftbar}
            >
                {isLeftbarVisible ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
            </button>
        </div>
    );
}

export default Leftbar;

