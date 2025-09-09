import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./sidebar";

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, skills: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSkills, setRecentSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:9999/admin/dashboard", { withCredentials: true });
        setStats({ users: res.data.totalUsers, skills: res.data.totalSkills });
        setRecentUsers(res.data.recentUsers);
        setRecentSkills(res.data.recentSkills);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((item) => (
          <div key={item} className="bg-white rounded-2xl shadow-md p-6">
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        <div className="flex-1 bg-gray-50 p-6">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Total Users</h2>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold mt-2">{stats.users}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Skills Added</h2>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-3xl font-bold mt-2">{stats.skills}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Recent Users</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <li key={user._id} className="py-3 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email || "No email provided"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Recent Skills</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {recentSkills.map((skill, index) => (
                <li key={index} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-purple-100 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{skill}</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;