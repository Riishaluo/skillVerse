import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./HomeComponents/navbar";
import ProfileAvatar from "./reuseComponent/profileAvatar";
import LikeButton from "./reuseComponent/like";
import CommentButton from "./reuseComponent/comment";
import CommentInput from "./reuseComponent/commentInput";

const ProfileSection = () => {
    const [activeTab, setActiveTab] = useState("posts");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [bio, setBio] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState("");

    const [skills, setSkills] = useState([]);
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [tempSkills, setTempSkills] = useState([]);

    const [openComments, setOpenComments] = useState(null);
    const [commentTexts, setCommentTexts] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:9999/user/profile/me", {
                    withCredentials: true,
                });
                setUser(res.data.user);
                setBio(res.data.user.bio || "");
                setSkills(res.data.user.skillsOffering || []);
            } catch (err) {
                console.error("Failed to load profile:", err);
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
            console.error("Failed to update bio:", err);
        }
    };

    const handleSaveSkills = async () => {
        try {
            const res = await axios.put(
                "http://localhost:9999/user/update-skills",
                { skillsOffered: tempSkills },
                { withCredentials: true }
            );
            setSkills(res.data.user.skillsOffered);
            setIsEditingSkills(false);
            setNewSkill("");
        } catch (err) {
            console.error("Failed to update skills:", err);
        }
    };

    const formatConnections = (count) => {
        if (count >= 100 && count < 200) return "100+ connections";
        if (count >= 200 && count < 300) return "200+ connections";
        if (count >= 500) return "500+ connections";
        return `${count} connections`;
    };

    const formatCommentTime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleString();
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="flex justify-center items-center h-64 text-gray-600">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <Navbar />
                <div className="flex justify-center items-center h-64 text-red-600">
                    Failed to load profile
                </div>
            </div>
        );
    }

    const onlyPosts = user?.posts?.filter((p) => p.type?.toLowerCase() === "post") || [];
    const onlyEvents = user?.posts?.filter((p) => p.type?.toLowerCase() === "event") || [];

    const handleLike = async (itemId, newLiked) => {
        try {
            const res = await axios.post(
                `http://localhost:9999/user/${itemId}/like`,
                { liked: newLiked },
                { withCredentials: true }
            );

            setUser(prev => ({
                ...prev,
                posts: prev.posts.map(p =>
                    p._id === itemId
                        ? { ...p, likesCount: res.data.likesCount, likedByCurrentUser: res.data.liked }
                        : p
                )
            }));
        } catch (err) {
            console.error(err);
        }
    }



    const handleComment = async (itemId, text) => {
        try {
            const res = await axios.post(
                `http://localhost:9999/user/${itemId}/comment`,
                { text },
                { withCredentials: true }
            );
            setCommentTexts(prev => ({ ...prev, [itemId]: "" }));
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
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    <div className="px-6 pb-6 -mt-12">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <ProfileAvatar
                                user={user}
                                onAvatarUpdate={(newAvatar) =>
                                    setUser((prev) => ({ ...prev, avatar: newAvatar }))
                                }
                            />
                            <div className="flex-1 mt-4 sm:mt-8">
                                <h1 className="text-2xl font-semibold text-gray-900 mb-1">{user?.name}</h1>
                                <p className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                                    {formatConnections(user?.followers?.length || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 mb-4 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">About</h2>
                        {bio && !isEditingBio && (
                            <button onClick={() => { setTempBio(bio); setIsEditingBio(true); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                                ✏️
                            </button>
                        )}
                    </div>
                    {!bio && !isEditingBio ? (
                        <div className="text-center py-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Add a bio</h3>
                            <button onClick={() => setIsEditingBio(true)} className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700">Add bio</button>
                        </div>
                    ) : isEditingBio ? (
                        <div className="space-y-4">
                            <textarea
                                value={tempBio}
                                onChange={(e) => setTempBio(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                rows={5}
                            />
                            <div className="flex gap-2">
                                <button onClick={handleSaveBio} className="px-4 py-2 bg-blue-600 text-white rounded-full">Save</button>
                                <button onClick={() => setIsEditingBio(false)} className="px-4 py-2 border rounded-full">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-800">{bio}</p>
                    )}
                </div>
                <div className="bg-white rounded-lg border border-gray-200 mb-4 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                        {skills.length > 0 && !isEditingSkills && (
                            <button onClick={() => { setTempSkills([...skills]); setIsEditingSkills(true); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">✏️</button>
                        )}
                    </div>
                    {!skills.length && !isEditingSkills ? (
                        <div className="text-center py-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Add skills</h3>
                            <button onClick={() => setIsEditingSkills(true)} className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700">Add skills</button>
                        </div>
                    ) : isEditingSkills ? (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Type a skill"
                                    className="flex-1 p-2 border rounded-lg"
                                />
                                <button
                                    onClick={() => {
                                        if (newSkill.trim() && !tempSkills.includes(newSkill.trim())) {
                                            setTempSkills([...tempSkills, newSkill.trim()]);
                                            setNewSkill("");
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tempSkills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full flex items-center">
                                        {skill}
                                        <button onClick={() => setTempSkills(tempSkills.filter((_, i) => i !== idx))} className="ml-2 text-red-500">✕</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSaveSkills} className="px-4 py-2 bg-blue-600 text-white rounded-full">Save</button>
                                <button onClick={() => setIsEditingSkills(false)} className="px-4 py-2 border rounded-full">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{skill}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-4 py-3 text-sm font-medium flex-1 text-center ${activeTab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={() => setActiveTab("posts")}
                        >
                            Posts ({onlyPosts.length})
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium flex-1 text-center ${activeTab === "events" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={() => setActiveTab("events")}
                        >
                            Events ({onlyEvents.length})
                        </button>
                    </div>

                    <div className="p-4">
                        {activeTab === "posts" && (
                            <div>
                                {onlyPosts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                        {onlyPosts.map((post) => (
                                            <div key={post._id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                                {post.photo ? (
                                                    <div className="aspect-square overflow-hidden">
                                                        <img src={post.photo} alt="Post" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <div className="p-3">
                                                    <p className="text-gray-700 text-sm line-clamp-3 mb-2">
                                                        {post.content || post.description || "No content available"}
                                                    </p>
                                                    {post.createdAt && (
                                                        <p className="text-xs text-gray-400 mb-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                                                    )}

                                                    <div className="flex gap-3 mt-2">
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
                                                        <div className="mt-4 space-y-3">
                                                            <div className="max-h-48 overflow-y-auto space-y-2">
                                                                {post.comments?.map((c) => (
                                                                    <div key={c._id} className="flex items-start gap-2">
                                                                        <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-medium">
                                                                            {c.commentedBy?.name?.charAt(0) || "U"}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="bg-gray-50 rounded-2xl px-3 py-2 border border-gray-100">
                                                                                <strong className="text-gray-800 text-xs font-medium block mb-0.5">
                                                                                    {c.commentedBy?.name || "User"}
                                                                                </strong>
                                                                                <p className="text-gray-600 text-xs">{c.text}</p>
                                                                            </div>
                                                                            <div className="text-xs text-gray-400 mt-1 ml-2.5">
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
                                    <div className="text-center py-6 text-gray-500 text-sm">No posts yet</div>
                                )}
                            </div>
                        )}

                        {activeTab === "events" && (
                            <div className="space-y-4">
                                {onlyEvents.length > 0 ? (
                                    onlyEvents.map((event) => (
                                        <div key={event._id} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                            <p className="text-gray-800 text-sm mb-2">{event.description || "No description available"}</p>
                                            {event.photo && <img src={event.photo} alt="Event" className="rounded-md max-h-60 object-cover w-full mb-2" />}
                                            {event.createdAt && (
                                                <p className="text-xs text-gray-400 mb-2">{new Date(event.createdAt).toLocaleString()}</p>
                                            )}

                                            <div className="flex gap-3 mt-2">
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
                                                <div className="mt-4 space-y-3">
                                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                                        {event.comments?.map((c) => (
                                                            <div key={c._id} className="flex items-start gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-medium">
                                                                    {c.commentedBy?.name?.charAt(0) || "U"}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="bg-gray-50 rounded-2xl px-3 py-2 border border-gray-100">
                                                                        <strong className="text-gray-800 text-xs font-medium block mb-0.5">
                                                                            {c.commentedBy?.name || "User"}
                                                                        </strong>
                                                                        <p className="text-gray-600 text-xs">{c.text}</p>
                                                                    </div>
                                                                    <div className="text-xs text-gray-400 mt-1 ml-2.5">
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
                                    <div className="text-center py-6 text-gray-500 text-sm">No events yet</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileSection;
