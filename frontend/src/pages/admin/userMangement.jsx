import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./sidebar";

const UserManagement = () => {
    const [expandedUser, setExpandedUser] = useState(null);
    const [users, setUsers] = useState([]);
    console.log(users);
    console.log(expandedUser);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:9999/admin/users", {
                withCredentials: true,
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const toggleBlockUser = async (userId) => {
        try {
            await axios.put(
                `http://localhost:9999/admin/block-user/${userId}`,
                {},
                { withCredentials: true }
            );
            fetchUsers();
        } catch (err) {
            console.error("Error toggling block:", err);
        }
    };

    const sendAlert = async (userId) => {
        try {
            await axios.post(
                `http://localhost:9999/admin/send-alert/${userId}`,
                { message: "Please follow community guidelines" },
                { withCredentials: true }
            );
            alert("Alert sent successfully!");
        } catch (err) {
            console.error("Error sending alert:", err);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <AdminSidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">User Management</h1>

                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className={`border p-4 rounded-lg shadow-md transition-colors ${
                                user.isPremium ? "bg-blue-500 text-white" : "bg-white"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        {user.name}
                                        {user.isPremium && (
                                            <span className="text-white font-bold text-sm">
                                                ★ Premium
                                            </span>
                                        )}
                                    </h2>
                                    <p
                                        className={`${
                                            user.isPremium
                                                ? "text-gray-100"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {user.email}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => toggleBlockUser(user._id)}
                                        className={`px-4 py-2 rounded-lg text-white ${
                                            user.isBlocked
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {user.isBlocked ? "Unblock" : "Block"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            setExpandedUser(
                                                expandedUser === user._id
                                                    ? null
                                                    : user._id
                                            )
                                        }
                                        className="px-4 py-2 rounded-lg bg-yellow-500 text-white"
                                    >
                                        {expandedUser === user._id
                                            ? "Hide Details"
                                            : "View Details"}
                                    </button>
                                </div>
                            </div>

                            {expandedUser === user._id && (
                                <div className="mt-4 border-t pt-4 rounded-lg bg-gray-50 text-gray-900">
                                    {/* Skills Offered */}
                                    <h3 className="font-semibold">Skills Offered:</h3>
                                    <ul className="list-disc ml-6 text-gray-700">
                                        {user.skillsOffered?.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>

                                    {/* Skills Wanted */}
                                    <h3 className="font-semibold mt-2">Skills Wanted:</h3>
                                    <ul className="list-disc ml-6 text-gray-700">
                                        {user.skillsWanted?.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>

                                    {/* Reports */}
                                    <h3 className="font-semibold mt-4">Reports:</h3>
                                    <div className="ml-4">
                                        <p className="font-medium">User Reports:</p>
                                        {user.userReports?.length > 0 ? (
                                            user.userReports.map((r, i) => (
                                                <p key={i} className="text-sm text-red-600">
                                                    {r.reason}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No user reports
                                            </p>
                                        )}

                                        <p className="font-medium mt-2">Post Reports:</p>
                                        {user.postReports?.length > 0 ? (
                                            user.postReports.map((r, i) => (
                                                <p key={i} className="text-sm text-red-600">
                                                    {r.reason}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No post reports
                                            </p>
                                        )}
                                    </div>

                                    {/* Alert Button */}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => sendAlert(user._id)}
                                            className="px-4 py-2 rounded-lg bg-yellow-500 text-white"
                                        >
                                            Send Alert
                                        </button>
                                    </div>

                                    {/* User Posts */}
                                    <h3 className="font-semibold mt-4">User Posts:</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                                        {user.posts
                                            ?.filter((post) => post.type === "Post")
                                            .map((post) => {
                                                const isReported = post.isReported;
                                                const reason =
                                                    post.reportReason || "No reason";

                                                return (
                                                    <div
                                                        key={post._id}
                                                        className={`rounded-lg overflow-hidden border shadow-sm group p-2 ${
                                                            isReported
                                                                ? "border-red-500 bg-red-50"
                                                                : "border-gray-200 bg-white"
                                                        }`}
                                                    >
                                                        {post.photo ? (
                                                            <img
                                                                src={post.photo}
                                                                alt="user post"
                                                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                                                                No Image
                                                            </div>
                                                        )}

                                                        {post.description && (
                                                            <p className="font-semibold mb-1 mt-2 text-sm">
                                                                {post.description}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(
                                                                post.createdAt
                                                            ).toLocaleString()}
                                                        </p>

                                                        {isReported && (
                                                            <p className="mt-2 text-red-700 font-semibold text-xs">
                                                                ⚠ Reported ({reason})
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>

                                    {/* User Events */}
                                    {user.posts?.some((p) => p.type === "Event") && (
                                        <>
                                            <h3 className="font-semibold mt-6">
                                                User Events:
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                {user.posts
                                                    .filter(
                                                        (post) => post.type === "Event"
                                                    )
                                                    .map((event) => {
                                                        const isReported =
                                                            event.isReported;
                                                        const reason =
                                                            event.reportReason ||
                                                            "No reason provided";

                                                        return (
                                                            <div
                                                                key={event._id}
                                                                className={`rounded-lg border p-4 shadow ${
                                                                    isReported
                                                                        ? "border-red-500 bg-red-50"
                                                                        : "border-gray-200 bg-white"
                                                                }`}
                                                            >
                                                                <p className="font-semibold mb-2">
                                                                    {event.description}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {new Date(
                                                                        event.createdAt
                                                                    ).toLocaleString()}
                                                                </p>

                                                                {isReported && (
                                                                    <p className="mt-2 text-red-700 font-semibold text-sm">
                                                                        ⚠ Reported (
                                                                        {reason})
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
