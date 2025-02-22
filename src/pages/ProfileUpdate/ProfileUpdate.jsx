import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import PulseLoader from "react-spinners/PulseLoader";

const ProfileUpdate = () => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUserData } = useContext(ChatContext);

  const navigate = useNavigate();

  const profileUpdate = async (evt) => {
    evt.preventDefault();
    try {
      setLoading(true);
      if (!prevImage && !image) {
        toast.error("Upload profile image.", {
          theme: "dark",
          autoClose: 1500,
        });
        setLoading(false);
      }

      const userRef = doc(db, "users", uid);
      if (image) {
        const imgUrl = await handleImageUpload(image);
        console.log(imgUrl);
        setPrevImage(imgUrl);
        await updateDoc(userRef, {
          profileImage: imgUrl,
          name: name,
          bio: bio,
        });
        setLoading(false);
      } else {
        await updateDoc(userRef, {
          name: name,
          bio: bio,
        });
        setLoading(false);
      }
      const userDoc = await getDoc(userRef);
      setUserData(userDoc.data());
      navigate("/chat");
    } catch (error) {
      console.log(error);
      toast.error(error.code.split("/")[1].toUpperCase().split("-").join(" "), {
        theme: "dark",
        autoClose: 1500,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);
        if (userData.data().name) {
          setName(userData.data().name);
        }
        if (userData.data().bio) {
          setBio(userData.data().bio);
        }
        if (userData.data().profileImage) {
          setPrevImage(userData.data().profileImage);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

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

  return (
    <div className="profile">
      <div className="profile-update">
        <div className="profile-details">
          <h1 className="text-xl font-semibold">Profile Details</h1>

          <form onSubmit={profileUpdate} className="profile-form">
            <label htmlFor="avatar">
              <input
                onChange={(evt) => setImage(evt.target.files[0])}
                type="file"
                id="avatar"
                accept=".png, .jpg, .jpeg"
                hidden
              />
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : prevImage
                    ? prevImage
                    : assets.avatar_icon
                }
                alt=""
                className="w-15 rounded-full"
              />
              Upload Profile Picture
            </label>
            <input
              type="text"
              placeholder="Your name here"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
              required
            />
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(evt) => setBio(evt.target.value)}
            />

            {loading ? (
              <button type="submit">
                <PulseLoader size={10} color="#ffffff" />
              </button>
            ) : (
              <button type="submit">Save</button>
            )}
          </form>
        </div>
        <div className="profile-image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : prevImage
                ? prevImage
                : assets.userImage
            }
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
