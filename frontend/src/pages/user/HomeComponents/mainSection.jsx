import React, { useState, useEffect, useRef } from "react"
import { FaUserCircle, FaEllipsisV } from "react-icons/fa"
import axios from "axios"
import LikeButton from "../reuseComponent/like"
import CommentButton from "../reuseComponent/comment"
import Swal from "sweetalert2"

const formatCommentTime = (timestamp) => {
    if (!timestamp) return "Just now";

    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - commentTime) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const CommentInput = React.memo(({ itemId, value, onChange }) => {
    const inputRef = useRef(null)
    const selectionRef = useRef({ start: null, end: null })

    const handleChange = e => {
        selectionRef.current = {
            start: e.target.selectionStart,
            end: e.target.selectionEnd,
        }
        onChange(e)
    }

    useEffect(() => {
        const input = inputRef.current
        if (input && selectionRef.current.start !== null) {
            input.setSelectionRange(selectionRef.current.start, selectionRef.current.end)
        }
    }, [value])

    return (
        <input
            id={`comment-input-${itemId}`}
            ref={inputRef}
            type="text"
            placeholder="Write a comment..."
            value={value}
            onChange={handleChange}
            className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-sm transition-colors duration-200 focus:bg-white"
        />
    )
})

const PostCard = React.memo(({
    item,
    activeTab,
    menuOpen,
    setMenuOpen,
    openComments,
    setOpenComments,
    commentTexts,
    setCommentTexts,
    setPosts,
    timeAgo,
    reportModal,
    setReportModal,
    reportReason,
    setReportReason
}) =>
(
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col gap-5 border border-gray-100">
        <header className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                {item.createdBy?.avatar ? (
                    <img
                        src={item.createdBy.avatar}
                        alt={item.createdBy.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-300" />
                )}
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{item.createdBy?.name || "Unknown User"}</h3>
                    <time
                        dateTime={item.createdAt}
                        className="text-gray-400 text-xs"
                        title={new Date(item.createdAt).toLocaleString()}
                    >
                        {timeAgo(item.createdAt)}
                    </time>
                </div>
            </div>
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(menuOpen === item._id ? null : item._id)}
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200"
                    aria-label="More options"
                >
                    <FaEllipsisV className="text-sm" />
                </button>
                {menuOpen === item._id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-20 animate-fadeIn overflow-hidden py-1">
                        <button
                            onClick={() => setReportModal(item._id)}
                            className="block w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                            Report {activeTab === "events" ? "Event" : "Post"}
                        </button>
                    </div>
                )}
            </div>
        </header>

        <section className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{item.description}</section>

        {item.photo && (
            <img
                src={item.photo}
                alt="Post visual content"
                className="rounded-xl max-h-96 w-full object-cover shadow-sm"
            />
        )}

        <footer className="flex items-center mt-2 pt-0 gap-4">
            <LikeButton
                initialLiked={item.likedByCurrentUser}
                initialCount={item.likesCount || 0}
                onLike={newLiked => {
                    axios
                        .post(
                            `http://localhost:9999/user/${item._id}/like`,
                            { liked: newLiked },
                            { withCredentials: true }
                        )
                        .then(res => {
                            setPosts(posts =>
                                posts.map(p =>
                                    p._id === item._id
                                        ? {
                                            ...p,
                                            likesCount: res.data.likesCount,
                                            likedByCurrentUser: res.data.liked,
                                        }
                                        : p
                                )
                            )
                        })
                        .catch(console.error)
                }}
            />

            <CommentButton
                onClick={() => {
                    setOpenComments(openComments === item._id ? null : item._id)
                    setTimeout(() => {
                        document.getElementById(`comment-input-${item._id}`)?.focus()
                    }, 50)
                }}
                count={item.comments?.length || 0}
            />
        </footer>

        {openComments !== item._id && (
            <div className="mt-3">
                {item.comments?.length > 0 ? (
                    <div className="space-y-2">
                        {item.comments.slice(-2).map(c => (
                            <div
                                key={c._id}
                                className="flex items-start gap-2 animate-fadeIn"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium shadow-sm flex-shrink-0">
                                    {c.commentedBy?.avatar ? (
                                        <img
                                            src={c.commentedBy.avatar}
                                            alt={c.commentedBy.name}
                                            className="w-6 h-6 rounded-full object-cover border border-white shadow-sm flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium shadow-sm flex-shrink-0">
                                            {c.commentedBy?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="bg-gray-50 rounded-2xl px-3 py-2 border border-gray-100">
                                        <strong className="text-gray-800 text-xs font-medium block mb-0.5">
                                            {c.commentedBy?.name || "User"}
                                        </strong>
                                        <p className="text-gray-600 text-xs leading-relaxed">{c.text}</p>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 ml-2.5">
                                        {formatCommentTime(c.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-xs italic py-1">No comments yet. Be the first to comment!</p>
                )}

                {item.comments?.length > 2 && (
                    <button
                        onClick={() => setOpenComments(openComments === item._id ? null : item._id)}
                        className="text-blue-500 hover:text-blue-600 text-xs font-medium mt-2 flex items-center transition-colors duration-200"
                    >
                        View all {item.comments.length} comments
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        )}
        {openComments === item._id && (
            <div className="mt-4 bg-gray-50 rounded-2xl border border-gray-200 p-4 animate-slideDown">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-700 flex items-center uppercase tracking-wide">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        Comments ({item.comments.length})
                    </h3>
                    <button
                        onClick={() => setOpenComments(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {item.comments.map(c => {
                        return (
                            <div
                                key={c._id}
                                className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl shadow-sm border border-gray-100"
                            >
                                {c.commentedBy?.avatar ? (
                                    <img
                                        src={c.commentedBy.avatar}
                                        alt={c.commentedBy.name}
                                        className="w-7 h-7 rounded-full object-cover border border-white shadow-sm flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium shadow-sm flex-shrink-0">
                                        {c.commentedBy?.name?.charAt(0) || "U"}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between">
                                        <strong className="text-gray-800 text-xs font-medium">
                                            {c.commentedBy?.name || "User"}
                                        </strong>
                                        <span className="text-xs text-gray-400">
                                            {formatCommentTime(c.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-xs mt-0.5">{c.text}</p>
                                </div>
                            </div>
                        )
                    })}

                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <CommentInput
                            itemId={item._id}
                            value={commentTexts[item._id] || ""}
                            onChange={e =>
                                setCommentTexts(prev => ({
                                    ...prev,
                                    [item._id]: e.target.value,
                                }))
                            }
                            placeholder="Add a comment..."
                        />
                        <button
                            onClick={() => {
                                if (!commentTexts[item._id]?.trim()) return;
                                axios
                                    .post(
                                        `http://localhost:9999/user/${item._id}/comment`,
                                        { text: commentTexts[item._id] },
                                        { withCredentials: true }
                                    )
                                    .then(res => {
                                        setCommentTexts(prev => ({
                                            ...prev,
                                            [item._id]: "",
                                        }));
                                        setPosts(posts =>
                                            posts.map(p =>
                                                p._id === item._id
                                                    ? { ...p, comments: res.data.comments }
                                                    : p
                                            )
                                        );
                                    })
                                    .catch(console.error);
                            }}
                            disabled={!commentTexts[item._id]?.trim()}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        )}

        {reportModal === item._id && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 animate-scaleIn">
                    <h2 className="text-base font-semibold mb-3 text-gray-800">Report {item.type}</h2>
                    <textarea
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-300 resize-none"
                        rows="3"
                        placeholder="Enter reason for reporting..."
                        value={reportReason}
                        onChange={e => setReportReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => {
                                setReportReason("")
                                setReportModal(null)
                            }}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (!reportReason.trim()) return
                                axios
                                    .post(
                                        `http://localhost:9999/user/${item._id}/report`,
                                        { reason: reportReason },
                                        { withCredentials: true }
                                    )
                                    .then(res => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Reported!",
                                            text: res.data.message,
                                            confirmButtonText: "OK",
                                            confirmButtonColor: "#3085d6"
                                        })
                                        setReportReason("")
                                        setReportModal(null)
                                    })
                                    .catch(err => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Oops...",
                                            text: err.response?.data?.message || "Failed to report",
                                            confirmButtonText: "Try Again"
                                        })
                                    })

                            }}
                            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition-colors duration-200 shadow-sm"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )}
    </article>
))

const PostSection = () => {
    const [activeTab, setActiveTab] = useState("posts")
    const [menuOpen, setMenuOpen] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [commentTexts, setCommentTexts] = useState({})
    const [openComments, setOpenComments] = useState(null)
    const [reportModal, setReportModal] = useState(null)
    const [reportReason, setReportReason] = useState("")


    useEffect(() => {
        setLoading(true)
        axios
            .get("http://localhost:9999/user/", { withCredentials: true })
            .then(res => {
                const avatar = res.data.user.avatar
                const allPosts = res.data.posts || []
                setPosts(allPosts.filter(p => p.type === (activeTab === "posts" ? "Post" : "Event")))
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [activeTab])

    const timeAgo = date => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000)
        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 },
        ]
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds)
            if (count > 0) return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`
        }
        return "just now"
    }

    return (
        <section className="w-full max-w-2xl mx-auto mt-6 px-4">
            <nav className="flex justify-center gap-2 mb-6 bg-white rounded-2xl shadow-sm p-1.5 border border-gray-100">
                {["posts", "events"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-xl px-5 py-2 text-sm font-medium transition-all duration-300 ${activeTab === tab
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        aria-current={activeTab === tab ? "page" : undefined}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </nav>

            {loading ? (
                <div className="flex flex-col gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No {activeTab} yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {posts.map(item => (
                        <PostCard
                            key={item._id}
                            item={item}
                            activeTab={activeTab}
                            menuOpen={menuOpen}
                            setMenuOpen={setMenuOpen}
                            openComments={openComments}
                            setOpenComments={setOpenComments}
                            commentTexts={commentTexts}
                            setCommentTexts={setCommentTexts}
                            setPosts={setPosts}
                            timeAgo={timeAgo}
                            reportModal={reportModal}
                            setReportModal={setReportModal}
                            reportReason={reportReason}
                            setReportReason={setReportReason}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default PostSection

