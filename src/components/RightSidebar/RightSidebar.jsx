import React from "react";
import "./RightSidebar.css";
import assets from "../../assets/assets";

const RightSidebar = () => {
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
        <button className="logout">Logout</button>
      </div>
    </div>
  );
};

export default RightSidebar;
