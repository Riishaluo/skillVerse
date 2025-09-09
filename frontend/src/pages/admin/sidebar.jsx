import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUserCog, FaUsers, FaSignOutAlt, FaBrain } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import Swal from "sweetalert2";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:9999/admin/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);


      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#f0f9ff",
        color: "#0369a1",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "font-semibold",
          icon: "text-green-500",
        },
      });

      navigate("/adminLogin");
    } catch (err) {
      console.error("Admin logout failed:", err);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Please try again",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
        background: "#fff5f5",
        color: "#b91c1c",
        customClass: { popup: "rounded-xl shadow-lg" },
      });
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
        Admin Panel
      </div>

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
