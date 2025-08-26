import React, { useState, useEffect, useRef } from "react"
import { FaComments, FaUserCircle, FaHome, FaBell, FaUsers, FaPlusCircle, FaSignOutAlt } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import { HiOutlineMenuAlt3 } from "react-icons/hi"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    setMobileMenuOpen(false)

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
    <>
      <nav className="bg-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-100">
        {/* Logo */}
        <div
          className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer flex items-center"
          onClick={() => navigate("/")}
        >
          <span className="hidden sm:inline">SkillVerse</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">
          <Link to="/">
            <NavItem icon={<FaHome />} label="Home" />
          </Link>
          <Link to='/network'>
            <NavItem icon={<FaUsers />} label="Network" />
          </Link>
          <Link to="/post">
            <NavItem icon={<FaPlusCircle />} label="Post" />
          </Link>
          <NavItem icon={<FaBell />} label="Alerts" />
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4 text-gray-700 text-xl relative" ref={menuRef}>
          <button className="hover:text-blue-600 transition p-1 rounded-full hover:bg-blue-50">
            <FaComments />
          </button>

          {isLoggedIn && !isPremium && <PremiumButton userEmail={userEmail} />}

          <button
            onClick={handleUserIconClick}
            className="hover:text-blue-600 transition p-1 rounded-full hover:bg-blue-50"
          >
            <FaUserCircle />
          </button>

          {/* Mobile menu button */}
          <button 
            className="md:hidden ml-2 p-1 rounded-md hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IoMdClose size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </button>

          {/* User dropdown menu */}
          {menuOpen && isLoggedIn && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50 overflow-hidden py-1">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-medium text-gray-500">Signed in as</p>
                <p className="text-sm text-gray-800 font-medium truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => {
                  navigate("/profile")
                  setMenuOpen(false)
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
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40 md:hidden py-3">
          <div className="flex flex-col">
            <MobileNavItem 
              icon={<FaHome />} 
              label="Home" 
              onClick={() => {
                navigate("/")
                setMobileMenuOpen(false)
              }} 
            />
            <MobileNavItem 
              icon={<FaUsers />} 
              label="Network" 
              onClick={() => {
                navigate("/network")
                setMobileMenuOpen(false)
              }} 
            />
            <MobileNavItem 
              icon={<FaPlusCircle />} 
              label="Post" 
              onClick={() => {
                navigate("/post")
                setMobileMenuOpen(false)
              }} 
            />
            <MobileNavItem 
              icon={<FaBell />} 
              label="Alerts" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            
            {isLoggedIn && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <MobileNavItem 
                  icon={<FaUserCircle />} 
                  label="Your Profile" 
                  onClick={() => {
                    navigate("/profile")
                    setMobileMenuOpen(false)
                  }} 
                />
                <MobileNavItem 
                  icon={<FaSignOutAlt />} 
                  label="Sign Out" 
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }} 
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const NavItem = ({ icon, label }) => (
  <div className="flex flex-col items-center cursor-pointer group py-1 px-2 rounded-lg hover:bg-blue-50 transition-all">
    <div className="text-xl text-gray-600 group-hover:text-blue-600 transition-colors">{icon}</div>
    <span className="text-xs mt-1 text-gray-500 group-hover:text-blue-600 transition-colors">{label}</span>
  </div>
)

const MobileNavItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
  >
    <div className="text-gray-500">{icon}</div>
    <span className="font-medium">{label}</span>
  </button>
)

export default Navbar