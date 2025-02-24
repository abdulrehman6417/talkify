import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import "./LeftSidebar.css";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { ChatContext } from "../../context/ChatContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
    messagesId,
    chatVisible,
    setChatVisible,
  } = useContext(ChatContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // search for another user to add to chat function here

  const inputHandler = async (evt) => {
    try {
      const input = evt.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // add another user to chat function here

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);

      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const uSnap = await getDoc(doc(db, "users", user.id));
      const uData = uSnap.data();
      setChat({
        messagesId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: uData,
      });

      setShowSearch(false);
      setChatVisible(true);
    } catch (error) {
      console.log(error);
      toast.error(error.code.split("/")[1].toUpperCase().split("-").join(" "), {
        theme: "dark",
        autoClose: 1500,
      });
    }
  };

  // open chat of the user we click on function

  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item);
      const userChatsRef = doc(db, "chats", userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chatsData.findIndex(
        (c) => c.messageId === item.messageId
      );
      userChatsData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, {
        chatsData: userChatsData.chatsData,
      });
      setChatVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser((prev) => ({ ...prev, userData: userData }));
      }
    };

    updateChatUserData();
  }, [chatData]);

  return (
    <div className={`leftSide ${chatVisible ? "hide" : ""}`}>
      <div className="left-top">
        <div className="left-nav">
          <img src={assets.nav_logo} alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p
                onClick={() => {
                  navigate("/profile");
                }}
                className="text-[15px] text-slate-700 font-medium  "
              >
                Edit Profile
              </p>
              <hr />
              <p className="text-[15px] text-slate-700 font-medium  ">Logout</p>
            </div>
          </div>
        </div>
        <div className="left-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Searh here..."
          />
        </div>
      </div>
      <div className="left-list">
        {showSearch && user ? (
          <div onClick={addChat} className="users">
            <img src={user.profileImage} alt="" />
            <p className="text-[15px] font-medium">{user.name}</p>
          </div>
        ) : (
          chatData?.map((user, index) => (
            <div
              onClick={() => setChat(user)}
              key={index}
              className={`users ${
                user.messageSeen || user.messageId === messagesId
                  ? ""
                  : "not-seen"
              }`}
            >
              <img src={user.userData.profileImage} alt="" />
              <div className="flex flex-col hover:text-white">
                <p className="text-[15px] font-medium">{user.userData.name}</p>
                <span
                  style={{ marginLeft: "-4px" }}
                  className="text-[13px] text-gray-400 "
                >
                  {user.lastMessage}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
