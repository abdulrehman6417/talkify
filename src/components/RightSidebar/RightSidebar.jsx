import React from "react";
import "./RightSidebar.css";
import assets from "../../assets/assets";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { toast } from "react-toastify";

const RightSidebar = () => {
  // FIREBASE LOGOUT FUNCTION

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.code);
      toast.error(error.code.split("/")[1].toUpperCase().split("-").join(" "), {
        theme: "dark",
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="rightSide">
      <div className="right-top">
        <img src={assets.profile} alt="" />
        <p className="font-medium text-xl">John Doe</p>
        <p className="text-[11px] text-gray-300/90">
          Hey there, I am using Talkify.
        </p>
      </div>

      <div className="media">
        <p>Media</p>
        <div>
          <img src={assets.profile} alt="" />
          <img src={assets.profile} alt="" />
          <img src={assets.profile} alt="" />
          <img src={assets.profile} alt="" />
          <img src={assets.profile} alt="" />
          <img src={assets.profile} alt="" />
          <img src={assets.profile} alt="" />
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={logout} className="logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
