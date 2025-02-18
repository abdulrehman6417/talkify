import React from "react";
import assets from "../../assets/assets";
import "./LeftSidebar.css";

const LeftSidebar = () => {
  return (
    <div className="leftSide">
      <div className="left-top">
        <div className="left-nav">
          <img src={assets.nav_logo} alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p className="text-[15px] text-slate-700 font-medium  ">
                Edit Profile
              </p>
              <hr />
              <p className="text-[15px] text-slate-700 font-medium  ">Logout</p>
            </div>
          </div>
        </div>
        <div className="left-search">
          <img src={assets.search_icon} alt="" />
          <input type="text" placeholder="Searh here..." />
        </div>
      </div>
      <div className="left-list">
        {Array(12)
          .fill("")
          .map((user, index) => (
            <div key={index} className="users">
              <img src={assets.profile} alt="" />
              <div className="flex flex-col hover:text-white">
                <p className="text-[15px] font-medium">John Doe</p>
                <span className="text-[13px] text-gray-400 ">
                  Hello, buddy!
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
