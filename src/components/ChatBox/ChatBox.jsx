import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { LuImagePlus } from "react-icons/lu";
import { BiSolidSend } from "react-icons/bi";
import { ChatContext } from "../../context/ChatContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { toast } from "react-toastify";

const ChatBox = () => {
  const {
    userData,
    messagesId,
    chatUser,
    messages,
    setMessages,
    chatVisible,
    setChatVisible,
  } = useContext(ChatContext);

  const [input, setInput] = useState("");

  // send message to someone function

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: Date.now(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatsData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatsData.chatsData[chatIndex].updatedAt = Date.now();

            if (userChatsData.chatsData[chatIndex].rId === userData.id) {
              userChatsData.chatsData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatsData: userChatsData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error, {
        theme: "dark",
        autoClose: 1500,
      });
    }
    setInput("");
  };

  // send image in chat function

  const sendImage = async (evt) => {
    try {
      const fileUrl = await handleImageUpload(evt.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: Date.now(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatsData.chatsData[chatIndex].lastMessage = "Image";
            userChatsData.chatsData[chatIndex].updatedAt = Date.now();

            if (userChatsData.chatsData[chatIndex].rId === userData.id) {
              userChatsData.chatsData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatsData: userChatsData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, { theme: "dark", autoClose: 1500 });
    }
  };

  // image upload to database function

  const handleImageUpload = (imageFile) => {
    return new Promise((resolve, reject) => {
      try {
        if (!imageFile) {
          reject(
            toast.error("No image selected", { theme: "dark", autoClose: 1500 })
          );
          return;
        }

        // get the file from the pc
        const file = imageFile;
        const reader = new FileReader();

        reader.onloadend = () => {
          // convert the img url in to base64 string
          const base64String = reader.result;
          console.log(`base64: ${base64String}`);
          resolve(base64String);
        };

        reader.onerror = (error) =>
          reject(toast.error(error.code, { theme: "dark", autoClose: 1500 }));

        reader.readAsDataURL(file);
      } catch (error) {
        console.log(error);
        reject(
          toast.error(
            error.code.split("/")[1].toUpperCase().split("-").join(" "),
            {
              theme: "dark",
              autoClose: 1500,
            }
          )
        );
      }
    });
  };

  // convert time stamp into the am/pm variant

  const convertTimeStamp = (timestamp) => {
    let date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours > 12) {
      return hours - 12 + ":" + minutes.toString().padStart(2, "0") + " PM";
    } else {
      return hours + ":" + minutes.toString().padStart(2, "0") + " AM";
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });

      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hide"}`}>
      <div className="chat-user">
        <img
          className="w-10 rounded-full"
          src={chatUser.userData.profileImage}
          alt=""
        />
        <p className="flex items-center">
          {chatUser.userData.name}{" "}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img src={assets.green_dot} alt="" />
          ) : null}
        </p>
        <img className="help-icon" src={assets.help_icon} alt="" />
        <img
          onClick={() => setChatVisible(false)}
          className="arrow"
          src={assets.arrow_icon}
          alt=""
        />
      </div>

      <div className="message-area">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "sender-msg" : "rec-msg"}
          >
            {msg["image"] ? (
              <img src={msg.image} alt="" className="w-[150px] rounded-lg" />
            ) : (
              <p className="message">{msg.text}</p>
            )}

            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.profileImage
                    : chatUser.userData.profileImage
                }
                alt=""
              />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          onChange={(evt) => {
            setInput(evt.target.value);
          }}
          value={input}
          type="text"
          placeholder="Type your message here..."
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />

        <label htmlFor="image">
          <LuImagePlus className="text-[25px] text-gray-600/90 cursor-pointer hover:scale-105" />
        </label>
        <BiSolidSend
          onClick={sendMessage}
          className="text-[32px] text-blue-600/90 -rotate-45 cursor-pointer hover:scale-110"
        />
      </div>
    </div>
  ) : (
    <div className={`no-chat ${chatVisible ? "" : "hide"}`}>
      <img src={assets.talkify_logo} alt="" className="w-1/2" />
      <p className="text-3xl font-medium text-slate-800">Your Yap Partner!</p>
    </div>
  );
};

export default ChatBox;
