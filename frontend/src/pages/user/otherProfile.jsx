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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get logged-in user
        const meRes = await axios.get("http://localhost:9999/user/me", {
          withCredentials: true,
        });
        setCurrentUserId(meRes.data._id);

        // Get the other user's profile
        const res = await axios.get(
          `http://localhost:9999/user/profile/${userId}`,
          { withCredentials: true }
        );
        setUser(res.data.user);

        // Check if following
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

  // 🔹 Loading state
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

  // 🔹 Not found state
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
    <div className="ml-64 pr-8 px-4 pt-20 pb-8 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 text-sm mt-1 max-w-xl">
                {user.bio ||
                  "Welcome to my profile! I'm excited to connect and share skills."}
              </p>

              <div className="flex justify-center lg:justify-start gap-6 mt-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800 mb-3">
                Skills Offering
              </h2>
              {user.skillsOffered?.length > 0 ? (
                <div className="space-y-2">
                  {user.skillsOffered.map((skill, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-blue-50 rounded text-sm text-blue-700 border border-blue-200"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills offered yet</p>
              )}
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800 mb-3">
                Skills Wanted
              </h2>
              {user.skillsWanted?.length > 0 ? (
                <div className="space-y-2">
                  {user.skillsWanted.map((skill, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-green-50 rounded text-sm text-green-700 border border-green-200"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills wanted yet</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800 mb-4">
                Recent Posts ({user.posts?.length || 0})
              </h2>
              {user.posts?.length > 0 ? (
                <div className="space-y-4">
                  {user.posts.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition"
                    >
                      {post.photo && (
                        <img
                          src={post.photo}
                          alt="Post"
                          className="w-full h-48 object-cover rounded-md mb-3"
                        />
                      )}
                      <p className="text-gray-700 text-sm">
                        {post.content || post.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-6">
                  No posts yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;