import React from "react";
import AdminSidebar from "./sidebar";

function Dashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl font-bold mt-2">120</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold">Skills Added</h2>
            <p className="text-3xl font-bold mt-2">45</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold">Active Sessions</h2>
            <p className="text-3xl font-bold mt-2">18</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p className="text-3xl font-bold mt-2">₹25,000</p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <ul className="space-y-2">
              <li className="p-2 border-b">John Doe</li>
              <li className="p-2 border-b">Sarah Smith</li>
              <li className="p-2 border-b">Michael Johnson</li>
              <li className="p-2">Emily Davis</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Skills</h2>
            <ul className="space-y-2">
              <li className="p-2 border-b">Web Development</li>
              <li className="p-2 border-b">Graphic Design</li>
              <li className="p-2 border-b">Digital Marketing</li>
              <li className="p-2">Data Analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
