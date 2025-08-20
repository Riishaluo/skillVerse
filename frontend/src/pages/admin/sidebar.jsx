import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUserCog, FaUsers, FaSignOutAlt, FaBrain } from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/admin-login");
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      {/* Logo / Header */}
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
        Admin Panel
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition"
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/skills-management"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition"
        >
          <FaBrain />
          <span>Skill Management</span>
        </Link>

        <Link
          to="/user-management"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition"
        >
          <FaUsers />
          <span>User Management</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
