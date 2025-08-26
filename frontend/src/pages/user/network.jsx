import React, { useState, useEffect } from "react"
import Navbar from "./HomeComponents/navbar"
import axios from "axios"
import ConnectButton from "./reuseComponent/connection"
import { FiMessageCircle, FiSearch, FiUser, FiStar } from "react-icons/fi"

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
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-500">Loading connections...</div>
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

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Network</h1>
          <p className="text-gray-600">Discover and connect with professionals</p>
        </div>

        <div className="mb-10 bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <FiSearch className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Search Connections</h2>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredRecommended.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <FiStar className="text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div>
          <div className="flex items-center mb-4">
            <FiUser className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
          </div>

          {noResults ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <FiSearch className="mx-auto text-gray-400 text-4xl mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No connections found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
    : user.skillsOffered.slice(0, 3)

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>


        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{user.name}</h3>
            {user.isPremium && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <FiStar className="mr-1" size={12} /> Premium
              </span>
            )}
          </div>

          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {displayedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}

              {user.skillsOffered.length > 3 && !showAllSkills && (
                <button
                  onClick={() => setShowAllSkills(true)}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  +{user.skillsOffered.length - 3} more
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <ConnectButton
          userId={user._id}
          initialStatus={user.isFollowing ? "Connected" : null}
        />

        {currentUser?.isPremium && (
          <button
            className="flex items-center justify-center p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            onClick={() => alert(`Open chat with ${user.name}`)}
            title="Send message"
          >
            <FiMessageCircle size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Network