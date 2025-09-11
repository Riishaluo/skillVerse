import React, { useState, useEffect, useRef } from "react";
import {
  FaComments,
  FaUserCircle,
  FaHome,
  FaBell,
  FaUsers,
  FaPlusCircle,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { RiFlashlightFill } from "react-icons/ri";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation, Link } from "react-router-dom";
import PremiumButton from "../reuseComponent/premiumButton";
import { useAuth } from "../../../context/authContext";
import ChatDropdown from "../chat";
import io from "socket.io-client";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, setUser } = useAuth();
  const menuRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user info
  useEffect(() => {
    axios
      .get("http://localhost:9999/user/", { withCredentials: true })
      .then((res) => setUser(res.data.user || null))
      .catch(() => setUser(null));
  }, [location, setUser]);

  // Real-time alerts
  useEffect(() => {
    if (!user?._id) return;

    axios
      .get("http://localhost:9999/user/alerts", { withCredentials: true })
      .then((res) => setUnreadCount(res.data.unreadCount || 0))
      .catch((err) => console.error(err));

    const socket = io("http://localhost:9999", { withCredentials: true });

    socket.emit("join", user._id);

    socket.on("receive-alert", (alert) => {
      if (alert.user === user._id) setUnreadCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
  }, [user]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target) && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const handleUserIconClick = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please login",
        text: "You must be logged in to access this option.",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2563eb",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:9999/user/logout", {}, { withCredentials: true });
    setUser(null);
    setMenuOpen(false);
    setMobileMenuOpen(false);

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#1e40af",
      color: "#ffffff",
    });
  };

  return (
    <div className="flex">
      <aside className="hidden md:flex flex-col w-64 h-screen bg-blue-900 text-white fixed top-0 left-0 z-40 shadow-lg">
        <div
          className="flex items-center gap-2 text-2xl font-bold px-6 py-5 cursor-pointer hover:text-blue-300"
          onClick={() => navigate("/")}
        >
          <RiFlashlightFill className="text-white" />
          <span>SkillVerse</span>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-2">
          <Link to="/">
            <NavItem icon={<FaHome />} label="Home" isActive={location.pathname === "/"} />
          </Link>
          <Link to="/network">
            <NavItem icon={<FaUsers />} label="Network" isActive={location.pathname === "/network"} />
          </Link>
          <Link to="/post">
            <NavItem icon={<FaPlusCircle />} label="Post" isActive={location.pathname === "/post"} />
          </Link>
          <Link to="/alerts">
            <NavItem
              icon={<FaBell />}
              label="Alerts"
              isActive={location.pathname === "/alerts"}
              badgeCount={unreadCount}
            />
          </Link>
        </nav>

        {user && !user.isPremium && (
          <div className="mt-auto mb-4 mx-4 p-4 bg-blue-800 rounded-xl border border-blue-700">
            <h3 className="font-semibold text-sm text-white mb-1">Upgrade to Premium</h3>
            <p className="text-xs text-white mb-3">Unlock exclusive features and resources</p>
            <PremiumButton userEmail={user.email} variant="small" />
          </div>
        )}
      </aside>

      <header className="fixed top-0 right-0 left-0 md:left-64 bg-white text-white px-4 sm:px-6 py-3 flex justify-end items-center shadow-lg z-50">
  <div className="flex items-center gap-4 relative" ref={menuRef}>

    <ChatDropdown user={user} />

    <button
      onClick={handleUserIconClick}
      className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-gray-300 transition-all"
    >
      {user?.avatar ? (
        <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <FaUserCircle className="text-2xl text-gray-700" />
      )}
      <span className="hidden lg:block text-sm font-medium text-black">
        {user?.name || user?.email?.split("@")[0]}
      </span>
    </button>

    <button
      className="md:hidden ml-2 p-2 rounded-md hover:bg-blue-700"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? <IoMdClose size={20} /> : <HiOutlineMenuAlt3 size={20} />}
    </button>

    {/* Profile dropdown */}
    {menuOpen && user && (
      <div className="absolute right-0 top-12 bg-blue-800 text-white border border-blue-700 rounded-xl shadow-lg w-56 z-50 overflow-hidden py-1">
        <div className="px-4 py-3 border-b border-blue-700 bg-blue-900">
          <p className="text-xs font-medium text-blue-200">Signed in as</p>
          <p className="text-sm text-white font-medium truncate">{user.email}</p>
        </div>
        <button
          onClick={() => {
            navigate("/profile");
            setMenuOpen(false);
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-blue-700 transition-colors text-sm"
        >
          <FaUserCircle className="text-white" />
          <span>Your Profile</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-700 transition-colors text-sm"
        >
          <FaSignOutAlt className="text-white" />
          <span>Sign Out</span>
        </button>
      </div>
    )}
  </div>
</header>

    </div>
  );
};

const NavItem = ({ icon, label, isActive, badgeCount }) => (
  <div
    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
      isActive ? "bg-blue-700 text-white font-medium" : "hover:bg-blue-800 text-white"
    }`}
  >
    <div className={`relative text-lg ${isActive ? "text-white" : "text-white"}`}>
      {icon}
      {badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badgeCount}
        </span>
      )}
    </div>
    <span className="text-sm">{label}</span>
  </div>
);

export default Navbar;
