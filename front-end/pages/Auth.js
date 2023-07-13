import React from "react";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { useState } from "react";

const auth = () => {
  const [isLogin, setMode] = useState(false);

  const toggleForm = () => {
    setMode(!isLogin);
  };


  return (
    <div className="flex justify-center flex-col">
      {isLogin ? <Login toggleForm={toggleForm} />:<SignUp toggleForm={toggleForm} />}
    </div>
  );
};

export default auth;