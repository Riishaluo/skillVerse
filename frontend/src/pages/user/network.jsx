import React, { useState, useEffect } from "react"
import Navbar from "./HomeComponents/navbar"
import axios from "axios"
import ConnectButton from "./reuseComponent/connection"
import { FiMessageCircle, FiSearch, FiUser, FiStar } from "react-icons/fi"
import { Link } from "react-router-dom"

const Network = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [recommendedUsers, setRecommendedUsers] = useState([])
  const [otherUsers, setOtherUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:9999/user/network", {
          withCredentials: true,
        })
        setCurrentUser(res.data.currentUser)
        setRecommendedUsers(res.data.recommended)
        setOtherUsers(res.data.others)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filterUsers = (users) =>
    users.filter((user) => {
      const nameMatch = (user.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const skillMatch = (user.skillsOffered || []).some((skill) =>
        (skill || "").toLowerCase().includes(searchTerm.toLowerCase())
      )

      return nameMatch || skillMatch
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-500 text-lg">Loading connections...</div>
          </div>
        </div>
      </div>
    )
  }

  const filteredRecommended = filterUsers(recommendedUsers)
  const filteredOtherUsers = filterUsers(otherUsers)
  const noResults = filteredRecommended.length === 0 && filteredOtherUsers.length === 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="ml-64 pr-8 px-4 pt-20 pb-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">My Network</h1>
          <p className="text-lg text-gray-600">
            Discover and connect with professionals who share your interests and expertise
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <FiSearch className="text-blue-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Find Connections</h2>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        {filteredRecommended.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <FiStar className="text-yellow-500 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-800">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecommended.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Users Section */}
        <div>
          <div className="flex items-center mb-6">
            <FiUser className="text-blue-500 mr-3" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800">All Users</h2>
          </div>

          {noResults ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto">
              <FiSearch className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No connections found</h3>
              <p className="text-gray-500">Try adjusting your search terms or explore different skills</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOtherUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const UserCard = ({ user, currentUser }) => {
  const [showAllSkills, setShowAllSkills] = useState(false)

  const displayedSkills = showAllSkills
    ? user.skillsOffered
    : user.skillsOffered.slice(0,3)

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="flex flex-col items-center text-center mb-5">
        <div className="relative mb-3">
            <img
              src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />          {user.isPremium && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
              <FiStar className="text-white" size={14} />
            </div>
          )}
        </div>

        <div className="min-w-0 w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate">{user.name}</h3>
          {user.isPremium && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
              <FiStar className="mr-1" size={14} /> Premium Member
            </span>
          )}
        </div>
      </div>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {displayedSkills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {skill}
            </span>
          ))}

          {user.skillsOffered.length > 3 && !showAllSkills && (
            <button
              onClick={() => setShowAllSkills(true)}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              +{user.skillsOffered.length - 3} more
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <ConnectButton
            userId={user._id}
            initialStatus={user.isFollowing ? "Connected" : null}
          />
        </div>
      </div>
    </div>
  )
}

export default Network