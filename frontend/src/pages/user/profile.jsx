import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./HomeComponents/navbar";
import ProfileAvatar from "./reuseComponent/profileAvatar";
import LikeButton from "./reuseComponent/like"
import CommentButton from "./reuseComponent/comment"
import CommentInput from "./reuseComponent/commentInput"


const ProfileSection = () => {
    const [activeTab, setActiveTab] = useState("posts")
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const [bio, setBio] = useState("")
    const [isEditingBio, setIsEditingBio] = useState(false)
    const [tempBio, setTempBio] = useState("")

    const [skills, setSkills] = useState([])
    const [isEditingSkills, setIsEditingSkills] = useState(false)
    const [newSkill, setNewSkill] = useState("")
    const [tempSkills, setTempSkills] = useState([])

    const [openComments, setOpenComments] = useState(null)
    const [commentTexts, setCommentTexts] = useState({})

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:9999/user/profile/me", {
                    withCredentials: true,
                });
                setUser(res.data.user)
                setBio(res.data.user.bio || "")
                setSkills(res.data.user.skillsOffering || [])
            } catch (err) {
                console.error("Failed to load profile:", err)
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveBio = async () => {
        try {
            const res = await axios.put(
                "http://localhost:9999/user/update-bio",
                { bio: tempBio },
                { withCredentials: true }
            );
            setBio(res.data.user.bio);
            setIsEditingBio(false);
        } catch (err) {
            console.error("Failed to update bio:", err)
        }
    };

    const handleSaveSkills = async () => {
        try {
            const res = await axios.put(
                "http://localhost:9999/user/update-skills",
                { skillsOffered: tempSkills },
                { withCredentials: true }
            );
            setSkills(res.data.user.skillsOffered)
            setIsEditingSkills(false);
            setNewSkill("")
        } catch (err) {
            console.error("Failed to update skills:", err)
        }
    }

    const formatConnections = (count) => {
        if (count >= 100 && count < 200) return "100+ connections"
        if (count >= 200 && count < 300) return "200+ connections"
        if (count >= 500) return "500+ connections"
        return `${count} connections`
    }

    const formatCommentTime = (date) => {
        if (!date) return ""
        const d = new Date(date)
        return d.toLocaleString()
    }

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="flex justify-center items-center h-64 text-red-600">
                    <div className="text-center">
                        <div className="text-2xl mb-2">⚠️</div>
                        <p>Failed to load profile</p>
                    </div>
                </div>
            </div>
        )
    }

    const onlyPosts = user?.posts?.filter((p) => p.type?.toLowerCase() === "post") || []
    const onlyEvents = user?.posts?.filter((p) => p.type?.toLowerCase() === "event") || []

    const handleLike = async (itemId, newLiked) => {
        try {
            const res = await axios.post(
                `http://localhost:9999/user/${itemId}/like`,
                {},
                { withCredentials: true }
            )

            setUser(prev => ({
                ...prev,
                posts: prev.posts.map(p =>
                    p._id === itemId
                        ? { ...p, likesCount: res.data.likesCount, likedByCurrentUser: res.data.liked }
                        : p
                )
            }))
        } catch (err) {
            console.error("Error toggling like:", err)
        }
    }
    
    const handleComment = async (itemId, text) => {
        try {
            const res = await axios.post(
                `http://localhost:9999/user/${itemId}/comment`,
                { text },
                { withCredentials: true }
            )
            setCommentTexts(prev => ({ ...prev, [itemId]: "" }))
            setUser(prev => ({
                ...prev,
                posts: prev.posts.map(p =>
                    p._id === itemId ? { ...p, comments: res.data.comments } : p
                )
            }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative">
                    <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6bS0yLTIyYzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6TTYgNjBjLTEuMSAwLTItLjktMi0yVjJjMC0xLjEuOS0yIDItMmg1NmMxLjEgMCAyIC45IDIgMnY1NmMwIDEuMS0uOSAyLTIgMkg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

                        <div className="absolute top-4 right-6 w-12 h-12 rounded-full bg-white opacity-5"></div>
                        <div className="absolute bottom-6 left-8 w-16 h-16 rounded-full bg-white opacity-5"></div>
                    </div>

                    <div className="px-6 pb-6 -mt-12 relative">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="relative flex-shrink-0">
                                <div className="absolute -inset-2 bg-blue-50 rounded-full opacity-0 sm:opacity-100 transition-opacity"></div>
                                <ProfileAvatar
                                    user={user}
                                    onAvatarUpdate={(newAvatar) =>
                                        setUser((prev) => ({ ...prev, avatar: newAvatar }))
                                    }
                                    className="relative z-10 border-4 border-white shadow-md"
                                />
                            </div>

                            <div className="flex flex-col flex-grow text-center sm:text-left">
                                <div className="sm:bg-transparent bg-white/80 sm:backdrop-blur-none backdrop-blur-sm rounded-lg py-2 sm:py-0 -mx-2 sm:mx-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user?.name}</h1>
                                </div>

                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium">
                                            {formatConnections(user?.followers?.length || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            About
                        </h2>
                        {bio && !isEditingBio && (
                            <button onClick={() => { setTempBio(bio); setIsEditingBio(true); }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {!bio && !isEditingBio ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tell your story</h3>
                            <p className="text-gray-500 text-sm mb-4">Share what makes you unique</p>
                            <button onClick={() => setIsEditingBio(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                                Add bio
                            </button>
                        </div>
                    ) : isEditingBio ? (
                        <div className="space-y-4">
                            <textarea
                                value={tempBio}
                                onChange={(e) => setTempBio(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={5}
                                placeholder="Write something about yourself..."
                            />
                            <div className="flex gap-3">
                                <button onClick={handleSaveBio}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors">
                                    Save
                                </button>
                                <button onClick={() => setIsEditingBio(false)}
                                    className="px-6 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-gray-700 leading-relaxed">{bio}</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Skills
                        </h2>
                        {skills.length > 0 && !isEditingSkills && (
                            <button onClick={() => { setTempSkills([...skills]); setIsEditingSkills(true); }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {!skills.length && !isEditingSkills ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Showcase your skills</h3>
                            <p className="text-gray-500 text-sm mb-4">Let others know what you're good at</p>
                            <button onClick={() => setIsEditingSkills(true)}
                                className="px-6 py-3 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
                                Add skills
                            </button>
                        </div>
                    ) : isEditingSkills ? (
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Type a skill and press Enter"
                                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && newSkill.trim() && !tempSkills.includes(newSkill.trim())) {
                                            setTempSkills([...tempSkills, newSkill.trim()]);
                                            setNewSkill("");
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        if (newSkill.trim() && !tempSkills.includes(newSkill.trim())) {
                                            setTempSkills([...tempSkills, newSkill.trim()]);
                                            setNewSkill("");
                                        }
                                    }}
                                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tempSkills.map((skill, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 rounded-full flex items-center gap-2 border border-green-200">
                                        {skill}
                                        <button onClick={() => setTempSkills(tempSkills.filter((_, i) => i !== idx))}
                                            className="text-red-500 hover:text-red-700 ml-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSaveSkills}
                                    className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
                                    Save
                                </button>
                                <button onClick={() => setIsEditingSkills(false)}
                                    className="px-6 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, idx) => (
                                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-full text-sm font-medium border border-blue-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Posts/Events Tabs */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-100 bg-gray-50">
                        <button
                            className={`px-6 py-4 text-sm font-semibold flex-1 text-center transition-all duration-200 ${activeTab === "posts"
                                ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("posts")}
                        >
                            📝 Posts ({onlyPosts.length})
                        </button>
                        <button
                            className={`px-6 py-4 text-sm font-semibold flex-1 text-center transition-all duration-200 ${activeTab === "events"
                                ? "text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("events")}
                        >
                            🎉 Events ({onlyEvents.length})
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === "posts" && (
                            <div>
                                {onlyPosts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                        {onlyPosts.map((post) => (
                                            <div key={post._id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                                                {post.photo ? (
                                                    <div className="aspect-square overflow-hidden">
                                                        <img src={post.photo} alt="Post" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                                    </div>
                                                ) : (
                                                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <p className="text-gray-400 text-sm">Text Post</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="p-4">
                                                    <p className="text-gray-700 text-sm line-clamp-3 mb-3 leading-relaxed">
                                                        {post.content || post.description || "No content available"}
                                                    </p>
                                                    {post.createdAt && (
                                                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {new Date(post.createdAt).toLocaleDateString()}
                                                        </p>
                                                    )}

                                                    <div className="flex gap-4 pt-2 border-t border-gray-50">
                                                        <LikeButton
                                                            initialLiked={post.likedByCurrentUser}
                                                            initialCount={post.likesCount || 0}
                                                            onLike={(newLiked) => handleLike(post._id, newLiked)}
                                                        />
                                                        <CommentButton
                                                            count={post.comments?.length || 0}
                                                            onClick={() => setOpenComments(openComments === post._id ? null : post._id)}
                                                        />
                                                    </div>

                                                    {openComments === post._id && (
                                                        <div className="mt-4 space-y-3 border-t border-gray-50 pt-4">
                                                            <div className="max-h-48 overflow-y-auto space-y-3">
                                                                {post.comments?.map((c) => (
                                                                    <div key={c._id} className="flex items-start gap-3">
                                                                        <div className="flex-shrink-0">
                                                                            {c.commentedBy?.avatar ? (
                                                                                <img
                                                                                    src={c.commentedBy.avatar}
                                                                                    alt={c.commentedBy.name}
                                                                                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                                                                    {c.commentedBy?.name?.charAt(0) || "U"}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                                                                <strong className="text-gray-800 text-sm font-semibold block mb-1">
                                                                                    {c.commentedBy?.name || "User"}
                                                                                </strong>
                                                                                <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
                                                                            </div>
                                                                            <div className="text-xs text-gray-400 mt-2 ml-3">
                                                                                {formatCommentTime(c.createdAt)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <CommentInput
                                                                value={commentTexts[post._id] || ""}
                                                                onChange={(text) =>
                                                                    setCommentTexts(prev => ({ ...prev, [post._id]: text }))
                                                                }
                                                                onSubmit={() => handleComment(post._id, commentTexts[post._id] || "")}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No posts yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Share your first post to get started</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "events" && (
                            <div className="space-y-6">
                                {onlyEvents.length > 0 ? (
                                    onlyEvents.map((event) => (
                                        <div key={event._id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300 bg-white">
                                            <div className="flex items-start gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                        
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-800 leading-relaxed mb-3">{event.description || "No description available"}</p>
                                                    {event.createdAt && (
                                                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {new Date(event.createdAt).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {event.photo && (
                                                <div className="rounded-xl overflow-hidden mb-4">
                                                    <img src={event.photo} alt="Event" className="w-full max-h-64 object-cover hover:scale-105 transition-transform duration-300" />
                                                </div>
                                            )}

                                            <div className="flex gap-4 pt-3 border-t border-gray-50">
                                                <LikeButton
                                                    initialLiked={event.likedByCurrentUser}
                                                    initialCount={event.likesCount || 0}
                                                    onLike={(newLiked) => handleLike(event._id, newLiked)}
                                                />
                                                <CommentButton
                                                    count={event.comments?.length || 0}
                                                    onClick={() => setOpenComments(openComments === event._id ? null : event._id)}
                                                />
                                            </div>

                                            {openComments === event._id && (
                                                <div className="mt-4 space-y-3 border-t border-gray-50 pt-4">
                                                    <div className="max-h-48 overflow-y-auto space-y-3">
                                                        {event.comments?.map((c) => (
                                                            <div key={c._id} className="flex items-start gap-3">
                                                                <div className="flex-shrink-0">
                                                                    {c.commentedBy?.avatar ? (
                                                                        <img
                                                                            src={c.commentedBy.avatar}
                                                                            alt={c.commentedBy.name}
                                                                            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                                                            {c.commentedBy?.name?.charAt(0) || "U"}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                                                        <strong className="text-gray-800 text-sm font-semibold block mb-1">
                                                                            {c.commentedBy?.name || "User"}
                                                                        </strong>
                                                                        <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
                                                                    </div>
                                                                    <div className="text-xs text-gray-400 mt-2 ml-3">
                                                                        {formatCommentTime(c.createdAt)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <CommentInput
                                                        value={commentTexts[event._id] || ""}
                                                        onChange={(text) =>
                                                            setCommentTexts(prev => ({ ...prev, [event._id]: text }))
                                                        }
                                                        onSubmit={() => handleComment(event._id, commentTexts[event._id] || "")}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No events yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Create your first event to bring people together</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileSection