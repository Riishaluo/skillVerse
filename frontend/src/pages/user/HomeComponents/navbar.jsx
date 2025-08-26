import React, { useState, useEffect, useRef } from "react"
import { FaComments, FaUserCircle, FaHome, FaBell, FaUsers, FaPlusCircle,FaSignOutAlt } from "react-icons/fa"
import axios from "axios"
import Swal from "sweetalert2"
import { useNavigate, useLocation, Link } from "react-router-dom"
import PremiumButton from "../reuseComponent/premiumButton"
import { useAuth } from "../../../context/authContext"


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { setUser } = useAuth()
  const menuRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    axios
      .get("http://localhost:9999/user/", { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(true)
        setUserEmail(res.data.user.email || "")
        setIsPremium(res.data.user.isPremium || false)
      })
      .catch(() => {
        setIsLoggedIn(false)
        setUserEmail("")
      })
  }, [location])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleUserIconClick = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Please login",
        text: "You must be logged in to access this option.",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2563eb",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login")
        }
      })
      return
    }
    setMenuOpen((prev) => !prev)
  }

  const handleLogout = async () => {
    await axios.post("http://localhost:9999/user/logout", {}, { withCredentials: true })
    setUser(null);
    setIsLoggedIn(false)
    setUserEmail("")
    setMenuOpen(false)

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
        icon: "text-green-500"
      }
    })
  }

  return (
    <nav className="bg-white px-6 py-3 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50">
      <div
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        SkillVerse
      </div>

      <div className="hidden md:flex items-center gap-8 text-gray-700">
        <Link to="/">
          <NavItem icon={<FaHome />} label="Home" />
        </Link>
        <Link to='/network'>
          <NavItem icon={<FaUsers />} label="Network" />
        </Link>
        <Link to="/post">
          <NavItem icon={<FaPlusCircle />} label="Post" />
        </Link>
        <NavItem icon={<FaBell />} label="Alert" />
      </div>

      <div className="flex items-center gap-4 text-gray-700 text-2xl relative" ref={menuRef}>
        <button className="hover:text-blue-600 transition">
          <FaComments />
        </button>

        {isLoggedIn && !isPremium && <PremiumButton userEmail={userEmail} />}


        <button
          onClick={handleUserIconClick}
          className="hover:text-blue-600 transition"
        >
          <FaUserCircle />
        </button>

        {menuOpen && isLoggedIn && (
          <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">Signed in as</p>
              <p className="text-sm text-gray-500 truncate">{userEmail}</p>
            </div>
            <button
              onClick={() => navigate("/profile")} // <-- navigate to profile route
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <FaUserCircle className="text-lg" />
              <span className="font-medium">Go to Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>

          </div>
        )}
      </div>
    </nav>
  )
}

const NavItem = ({ icon, label }) => (
  <div className="flex flex-col items-center cursor-pointer hover:text-blue-600 transition">
    <div className="text-2xl">{icon}</div>
    <span className="text-xs">{label}</span>
  </div>
)

export default Navbar
