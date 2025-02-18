import React, { useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";

const ProfileUpdate = () => {
  const [image, setImage] = useState(false);

  return (
    <div className="profile">
      <div className="profile-update">
        <div className="profile-details">
          <h1 className="text-xl font-semibold">Profile Details</h1>

          <form className="profile-form">
            <label htmlFor="avatar">
              <input
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                type="file"
                id="avatar"
                accept=".png, .jpg, .jpeg"
                hidden
              />
              <img
                src={image ? URL.createObjectURL(image) : assets.avatar_icon}
                alt=""
                className="w-15 rounded-full"
              />
              Upload Profile Picture
            </label>
            <input type="text" placeholder="Your name here" />
            <textarea placeholder="Description" c></textarea>
            <button type="submit">Save</button>
          </form>
        </div>
        <div className="profile-image">
          <img
            src={image ? URL.createObjectURL(image) : assets.userImage}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
