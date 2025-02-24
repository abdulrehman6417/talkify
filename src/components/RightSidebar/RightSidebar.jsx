import React, { useContext, useEffect, useState } from "react";
import "./RightSidebar.css";
import assets from "../../assets/assets";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { toast } from "react-toastify";
import { ChatContext } from "../../context/ChatContext";

const RightSidebar = () => {
  const { chatUser, messages } = useContext(ChatContext);
  const [messageImages, setMessageImages] = useState([]);

  useEffect(() => {
    let temp = [];
    messages.map((msg) => {
      if (msg.image) {
        temp.push(msg.image);
      }
    });
    setMessageImages(temp);
  }, [messages]);

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

  // convert the base64Strig image into url
  const base64ToUrl = (base64) =>
    URL.createObjectURL(
      new Blob(
        [Uint8Array.from(atob(base64.split(",")[1]), (c) => c.charCodeAt(0))],
        { type: "image/png" }
      )
    );

  return chatUser ? (
    <div className="rightSide">
      <div className="right-top">
        <img src={chatUser.userData.profileImage} alt="" />
        <p className="font-medium text-xl">{chatUser.userData.name}</p>
        <p className="text-[11px] text-gray-300/90">{chatUser.userData.bio}</p>
      </div>

      <div className="media">
        <p>Media</p>
        <div>
          {messageImages.map((msgImage, index) => (
            <img
              onClick={() => {
                const imgUrl = base64ToUrl(msgImage);
                window.open(imgUrl);
              }}
              key={index}
              src={msgImage}
              alt=""
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={logout} className="logout">
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="rightSide">
      <div className="flex justify-center">
        <button onClick={logout} className="logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
