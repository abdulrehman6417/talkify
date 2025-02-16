import React from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { LuImagePlus } from "react-icons/lu";
import { BiSolidSend } from "react-icons/bi";

const ChatBox = () => {
  return (
    <div className="chat-box">
      <div className="chat-user">
        <img className="w-10 rounded-full" src={assets.profile} alt="" />
        <p className="flex items-center">
          John Doe <img src={assets.green_dot} alt="" />
        </p>
        <img className="absolute right-3 w-7" src={assets.help_icon} alt="" />
      </div>

      <div className="message-area">
        <div className="sender-msg">
          <p className="message">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div>
            <img src={assets.profile} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>

        <div className="sender-msg">
          <img className="msg-image" src="/bg.jpg" alt="" />
          <div>
            <img src={assets.profile} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>

        <div className="rec-msg">
          <p className="message">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div>
            <img src={assets.profile} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>
      </div>

      <div className="chat-input">
        <input type="text" placeholder="Type your message here..." />
        <input type="file" id="image" accept="image/png, image/jpeg" hidden />

        <label htmlFor="image">
          <LuImagePlus className="text-[25px] text-gray-600/90 cursor-pointer hover:scale-105" />
        </label>
        <BiSolidSend className="text-[32px] text-blue-600/90 -rotate-45 cursor-pointer hover:scale-110" />
      </div>
    </div>
  );
};

export default ChatBox;
