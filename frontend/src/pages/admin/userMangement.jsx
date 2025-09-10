import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./sidebar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const limit = 10

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/admin/users",{
        withCredentials: true,
      });
      setUsers(res.data)
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
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                    className="px-3 py-1.5 rounded-md bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
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
