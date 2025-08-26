import React, { useRef } from "react";
import axios from "axios";

const ProfileAvatar = ({ user, onAvatarUpdate }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axios.put(
        "http://localhost:9999/user/updateProfilePicture",  
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (onAvatarUpdate) {
        onAvatarUpdate(res.data.avatar); 
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  };

  return (
    <div className="relative">
      <img
        src={
          user?.avatar ||
          "https://placehold.co/120x120/0a66c2/ffffff?text=U"
        }
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        📷
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatar;
