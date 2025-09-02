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
  FaBookmark,
  FaCog
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

const Navbar = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, setUser } = useAuth();
  const menuRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(user)

  useEffect(() => {
    axios
      .get("http://localhost:9999/user/", { withCredentials: true })
      .then((res) => setUser(res.data.user || null))
      .catch(() => setUser(null));
  }, [location, setUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:9999/user/logout", {}, { withCredentials: true });
    setUser(null);
    setMenuOpen(false);
    setMobileMenuOpen(false);

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
  };

  return (
    <div className="flex">
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-100 fixed top-0 left-0 z-40 shadow-sm">
        <div
          className="flex items-center gap-2 text-2xl font-bold text-blue-600 px-6 py-5 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <RiFlashlightFill className="text-blue-500" />
          <span>SkillVerse</span>
        </div>

        <div className="px-4 mb-4">
    
        </div>

        <nav className="flex flex-col gap-1 px-3 py-2 text-gray-700">
          <Link to="/"><NavItem icon={<FaHome />} label="Home" isActive={location.pathname === "/"} /></Link>
          <Link to="/network"><NavItem icon={<FaUsers />} label="Network" isActive={location.pathname === "/network"} /></Link>
          <Link to="/post"><NavItem icon={<FaPlusCircle />} label="Post" isActive={location.pathname === "/post"} /></Link>
          <Link to="/alerts"><NavItem icon={<FaBell />} label="Alerts" isActive={location.pathname === "/alerts"} /></Link>
        </nav>

        {user && !user.isPremium && (
          <div className="mt-auto mb-4 mx-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-sm text-blue-800 mb-1">Upgrade to Premium</h3>
            <p className="text-xs text-blue-600 mb-3">Unlock exclusive features and resources</p>
            <PremiumButton userEmail={user.email} variant="small" />
          </div>
        )}

      </aside>

      <header className="fixed top-0 right-0 left-0 md:left-64 bg-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm z-50 border-b border-gray-100">
        <div
          className="flex items-center gap-2 text-xl font-bold text-blue-600 md:hidden"
          onClick={() => navigate("/")}
        >
          <RiFlashlightFill className="text-blue-500" />
          <span>SkillVerse</span>
        </div>

        {searchOpen && (
          <div
            ref={searchRef}
            className="absolute top-0 left-0 right-0 bg-white p-3 shadow-md md:hidden z-50"
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <button
                type="button"
                className="p-2 mr-2"
                onClick={() => setSearchOpen(false)}
              >
                <IoMdClose className="text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 py-2 px-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="p-2 ml-2 text-blue-600">
                <FaSearch />
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-4 text-gray-700 relative ml-auto" ref={menuRef}>
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSearchOpen(true)}
          >
            <FaSearch />
          </button>

          <ChatDropdown user={user} />

          <button
            onClick={handleUserIconClick}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-gray-100 transition-all"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-2xl text-gray-500" />
            )}
            <span className="hidden lg:block text-sm font-medium text-gray-700">
              {user?.name || user?.email?.split('@')[0]}
            </span>
          </button>

          <button
            className="md:hidden ml-2 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IoMdClose size={20} /> : <HiOutlineMenuAlt3 size={20} />}
          </button>

          {menuOpen && user && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg w-56 z-50 overflow-hidden py-1">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-medium text-gray-500">Signed in as</p>
                <p className="text-sm text-gray-800 font-medium truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors text-sm"
              >
                <FaUserCircle className="text-gray-500" />
                <span>Your Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-red-50 transition-colors text-sm"
              >
                <FaSignOutAlt className="text-gray-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 w-4/5 max-w-xs h-full bg-white shadow-xl py-4">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
                <RiFlashlightFill className="text-blue-500" />
                <span>SkillVerse</span>
              </div>
            </div>

            <div className="p-4">
              {user && (
                <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <MobileNavItem icon={<FaHome />} label="Home" onClick={() => { navigate("/"); setMobileMenuOpen(false); }} isActive={location.pathname === "/"} />
                <MobileNavItem icon={<FaUsers />} label="Network" onClick={() => { navigate("/network"); setMobileMenuOpen(false); }} isActive={location.pathname === "/network"} />
                <MobileNavItem icon={<FaPlusCircle />} label="Post" onClick={() => { navigate("/post"); setMobileMenuOpen(false); }} isActive={location.pathname === "/post"} />
                <MobileNavItem icon={<FaBell />} label="Alerts" onClick={() => { navigate("/alerts"); setMobileMenuOpen(false); }} isActive={location.pathname === "/alerts"} />
                <MobileNavItem icon={<FaBookmark />} label="Saved" onClick={() => { navigate("/saved"); setMobileMenuOpen(false); }} isActive={location.pathname === "/saved"} />
                <MobileNavItem icon={<FaCog />} label="Settings" onClick={() => { navigate("/settings"); setMobileMenuOpen(false); }} isActive={location.pathname === "/settings"} />

                {user ? (
                  <>
                    <div className="border-t border-gray-100 my-3"></div>
                    <MobileNavItem icon={<FaUserCircle />} label="Your Profile" onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }} />
                    <MobileNavItem icon={<FaSignOutAlt />} label="Sign Out" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} />
                  </>
                ) : (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800 mb-2">Join our community</p>
                    <button
                      onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              {user && !user.isPremium && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-sm text-blue-800 mb-1">Go Premium</h3>
                  <p className="text-xs text-blue-600 mb-3">Unlock exclusive features</p>
                  <PremiumButton userEmail={user.email} variant="small" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, isActive }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100 text-gray-700"}`}>
    <div className={`text-lg ${isActive ? "text-blue-600" : "text-gray-500"}`}>{icon}</div>
    <span className="text-sm">{label}</span>
  </div>
);

const MobileNavItem = ({ icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition-all ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
  >
    <div className={`text-lg ${isActive ? "text-blue-600" : "text-gray-500"}`}>{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
);

export default Navbar;