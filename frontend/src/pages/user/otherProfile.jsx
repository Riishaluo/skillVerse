import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./HomeComponents/navbar";

const OtherUserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("Post"); // 🔹 For switching tabs

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const meRes = await axios.get("http://localhost:9999/user/me", {
          withCredentials: true,
        });
        setCurrentUserId(meRes.data._id);

        const res = await axios.get(
          `http://localhost:9999/user/profile/${userId}`,
          { withCredentials: true }
        );
        setUser(res.data.user);

        setIsFollowing(
          res.data.user.followers.some(
            (follower) => follower._id === meRes.data._id
          )
        );
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:9999/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.status === "Connected") {
        setUser((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), { _id: currentUserId }],
        }));
        setIsFollowing(true);
      } else if (res.data.status === "Unfollowed") {
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((f) => f._id !== currentUserId),
        }));
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Failed to update follow status:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-64 pt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-64 pt-20">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-600">
            The user profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Filter posts based on active tab
  const filteredPosts =
    user.posts?.filter((p) => p.type === activeTab) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="ml-64 pr-8 px-4 pt-20 pb-8 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600 text-sm max-w-xl">
              {user.bio ||
                "Welcome to my profile! I'm excited to connect and share skills."}
            </p>

            {/* 🔹 Stats */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {user.followers?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {user.following?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {user.posts?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
            </div>

            {currentUserId !== user._id && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`px-5 py-2 rounded-full text-sm font-medium transition shadow-sm ${
                  isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } disabled:opacity-50`}
              >
                {followLoading
                  ? "Processing..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* 🔹 Skills Offering */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-blue-600"></span> Skills Offering
          </h2>

          {user.skillsOffered?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user.skillsOffered.map((skill, i) => (
                <div
                  key={i}
                  className="px-3 py-2 text-sm font-medium text-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full shadow-sm hover:shadow-md hover:from-blue-100 hover:to-blue-200 transition"
                >
                  {skill}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
              <span className="text-gray-400 text-2xl mb-2">📭</span>
              <p className="text-gray-500 text-sm">No skills offered yet</p>
            </div>
          )}
        </div>

        {/* 🔹 Skills Wanted */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-green-600"></span> Skills Wanted
          </h2>

          {user.skillsWanted?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user.skillsWanted.map((skill, i) => (
                <div
                  key={i}
                  className="px-3 py-2 text-sm font-medium text-green-800 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-full shadow-sm hover:shadow-md hover:from-green-100 hover:to-green-200 transition"
                >
                  {skill}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">No skills wanted yet</p>
            </div>
          )}
        </div>

        {/* 🔹 Posts & Events Tabs */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg text-gray-800 mb-4">
            Recent {activeTab}s ({filteredPosts.length})
          </h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("Post")}
              className={`pb-2 px-3 text-sm font-medium ${
                activeTab === "Post"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("Event")}
              className={`pb-2 px-3 text-sm font-medium ${
                activeTab === "Event"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Events
            </button>
          </div>

          {/* Content */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex flex-col border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition duration-200"
                >
                  {post.photo && (
                    <div className="h-48 w-full overflow-hidden rounded-t-xl">
                      <img
                        src={post.photo}
                        alt="Post"
                        className="w-full h-[180px] object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-4">
                    <p className="text-gray-700 text-sm line-clamp-3 flex-1">
                      {post.content || post.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-6">
              No {activeTab.toLowerCase()}s yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
