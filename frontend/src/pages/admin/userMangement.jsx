import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./sidebar";

const UserManagement = () => {
  const [expandedUser, setExpandedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [alertMessages, setAlertMessages] = useState({}); 

  console.log(users)
  const limit = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/admin/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const toggleBlockUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:9999/admin/block-user/${userId}`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  const sendAlert = async (userId) => {
    try {
      const message =
        alertMessages[userId] || "Please follow community guidelines";
      await axios.post(
        `http://localhost:9999/admin/send-alert/${userId}`,
        { message },
        { withCredentials: true }
      );
      alert("Alert sent successfully!");
      setAlertMessages((prev) => ({ ...prev, [userId]: "" })); 
    } catch (err) {
      console.error("Error sending alert:", err);
    }
  };

  const totalPages = Math.ceil(users.length / limit);
  const startIndex = (page - 1) * limit;
  const currentUsers = users.slice(startIndex, startIndex + limit);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-md">
        <AdminSidebar />
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          User Management
        </h1>

        <div className="space-y-4">
          {currentUsers.map((user) => (
            <div
              key={user._id}
              className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
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

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBlockUser(user._id)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      user.isBlocked
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() =>
                      setExpandedUser(
                        expandedUser === user._id ? null : user._id
                      )
                    }
                    className="px-3 py-1.5 rounded-md bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
                  >
                    {expandedUser === user._id ? "Hide Details" : "View Details"}
                  </button>
                </div>
              </div>

              {expandedUser === user._id && (
                <div className="border-t border-gray-200">
                  <div className="max-h-96 overflow-y-auto p-4 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Skills Offered:
                        </h3>
                        {user.skillsOffered?.length > 0 ? (
                          <ul className="list-disc ml-5 text-gray-600">
                            {user.skillsOffered.map((skill, i) => (
                              <li key={i} className="text-sm">
                                {skill}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No skills offered
                          </p>
                        )}
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Skills Wanted:
                        </h3>
                        {user.skillsWanted?.length > 0 ? (
                          <ul className="list-disc ml-5 text-gray-600">
                            {user.skillsWanted.map((skill, i) => (
                              <li key={i} className="text-sm">
                                {skill}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No skills wanted
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">
                          User Reports:
                        </h3>
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
                          <p className="text-sm text-gray-500">
                            No user reports
                          </p>
                        )}
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Post Reports:
                        </h3>
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
                          <p className="text-sm text-gray-500">
                            No post reports
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Alert Section */}
                    <div className="mt-3">
                      <textarea
                        value={alertMessages[user._id] || ""}
                        onChange={(e) =>
                          setAlertMessages((prev) => ({
                            ...prev,
                            [user._id]: e.target.value,
                          }))
                        }
                        placeholder="Write an alert message..."
                        className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />

                      <div className="flex justify-end">
                        <button
                          onClick={() => sendAlert(user._id)}
                          className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600"
                        >
                          Send Alert
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        User Posts:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {user.posts?.filter((post) => post.type === "Post")
                          .length > 0 ? (
                          user.posts
                            .filter((post) => post.type === "Post")
                            .map((post) => {
                              const isReported = post.isReported;
                              const reason = post.reportReason || "No reason";

                              return (
                                <div
                                  key={post._id}
                                  className={`rounded-lg overflow-hidden border shadow-sm ${
                                    isReported
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
                                      {new Date(
                                        post.createdAt
                                      ).toLocaleString()}
                                    </p>

                                    {isReported && (
                                      <p className="mt-2 text-red-700 font-semibold text-xs">
                                        ⚠ Reported ({reason})
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                        ) : (
                          <p className="text-sm text-gray-500">
                            No posts available
                          </p>
                        )}
                      </div>
                    </div>

                    {user.posts?.some((p) => p.type === "Event") && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">
                          User Events:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {user.posts
                            .filter((post) => post.type === "Event")
                            .map((event) => {
                              const isReported = event.isReported;
                              const reason =
                                event.reportReason || "No reason provided";

                              return (
                                <div
                                  key={event._id}
                                  className={`rounded-lg border p-4 ${
                                    isReported
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-200 bg-white"
                                  }`}
                                >
                                  <p className="font-semibold mb-2 text-sm">
                                    {event.description}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      event.createdAt
                                    ).toLocaleString()}
                                  </p>

                                  {isReported && (
                                    <p className="mt-2 text-red-700 font-semibold text-xs">
                                      ⚠ Reported ({reason})
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

  
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                page === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
