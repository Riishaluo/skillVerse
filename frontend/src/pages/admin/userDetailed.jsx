import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./sidebar";

const UserDetailed = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  console.log(userId)

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:9999/admin/users/${userId}`, {
        withCredentials: true,
      });
      console.log(res.data)
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const sendAlert = async () => {
    try {
      await axios.post(
        `http://localhost:9999/admin/send-alert/${userId}`,
        { message: alertMessage || "Please follow community guidelines" },
        { withCredentials: true }
      );
      alert("Alert sent successfully!");
      setAlertMessage("");
    } catch (err) {
      console.error("Error sending alert:", err);
    }
  };

  if (!user) return <p className="p-6">Loading user details...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-md">
        <AdminSidebar />
      </div>

      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          User Details - {user.name}
        </h1>

        <div className="bg-white shadow rounded-lg p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {user.name}
                {user.isPremium && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    ★ Premium
                  </span>
                )}
                {user.isBlocked && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Blocked
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">
                Skills Offered:
              </h3>
              {user.skillsOffered?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-600">
                  {user.skillsOffered.map((skill, i) => (
                    <li key={i} className="text-sm">{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No skills offered</p>
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">
                Skills Wanted:
              </h3>
              {user.skillsWanted?.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-600">
                  {user.skillsWanted.map((skill, i) => (
                    <li key={i} className="text-sm">{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No skills wanted</p>
              )}
            </div>
          </div>

          {/* Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">User Reports:</h3>
              {user.userReports?.length > 0 ? (
                <div className="space-y-2">
                  {user.userReports.map((r, i) => (
                    <div
                      key={i}
                      className="bg-red-50 p-2 rounded text-sm text-red-700"
                    >
                      {r.reason}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No user reports</p>
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Post Reports:</h3>
              {user.postReports?.length > 0 ? (
                <div className="space-y-2">
                  {user.postReports.map((r, i) => (
                    <div
                      key={i}
                      className="bg-red-50 p-2 rounded text-sm text-red-700"
                    >
                      {r.reason}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No post reports</p>
              )}
            </div>
          </div>

          {/* Alerts */}
          <div>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              placeholder="Write an alert message..."
              className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={sendAlert}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600"
            >
              Send Alert
            </button>
          </div>

          {/* Posts */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">User Posts:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.posts?.filter((post) => post.type === "Post").length > 0 ? (
                user.posts
                  .filter((post) => post.type === "Post")
                  .map((post) => (
                    <div
                      key={post._id}
                      className={`rounded-lg overflow-hidden border shadow-sm ${
                        post.isReported
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      {post.photo ? (
                        <img
                          src={post.photo}
                          alt="user post"
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-200 text-gray-500">
                          No Image
                        </div>
                      )}

                      <div className="p-3">
                        {post.description && (
                          <p className="font-medium mb-1 text-sm line-clamp-2">
                            {post.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>

                        {post.isReported && (
                          <p className="mt-2 text-red-700 font-semibold text-xs">
                            ⚠ Reported ({post.reportReason || "No reason"})
                          </p>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">No posts available</p>
              )}
            </div>
          </div>

          {/* Events */}
          {user.posts?.some((p) => p.type === "Event") && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">User Events:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.posts
                  .filter((post) => post.type === "Event")
                  .map((event) => (
                    <div
                      key={event._id}
                      className={`rounded-lg border p-4 ${
                        event.isReported
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <p className="font-semibold mb-2 text-sm">
                        {event.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>

                      {event.isReported && (
                        <p className="mt-2 text-red-700 font-semibold text-xs">
                          ⚠ Reported ({event.reportReason || "No reason"})
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailed;
