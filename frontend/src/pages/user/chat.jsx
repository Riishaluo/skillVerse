import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaTimes, FaCircle } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import Swal from "sweetalert2";
import axios from "axios";
import useWebSocket from "../../hooks/useWebSocket";

const ChatWindow = ({ receiver, onClose, user }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, isConnected } = useWebSocket(user?._id, receiver?._id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    const success = sendMessage(text);
    if (!success) Swal.fire({ icon: "error", text: "Failed to send message" });
    else setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col h-96 w-80 overflow-hidden">
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative mr-3">
            <img
              src={receiver?.avatar}
              alt={receiver?.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                isConnected ? "bg-green-400" : "bg-gray-300"
              }`}
            />
          </div>
          <div>
            <div className="font-medium text-sm">{receiver?.name}</div>
            <div className="text-xs opacity-90">
              {isConnected ? "Online" : "Connecting..."}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-indigo-700 rounded-full h-7 w-7 flex items-center justify-center"
        >
          <FaTimes size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8 flex flex-col items-center">
            <div className="rounded-full bg-gray-100 p-3 mb-2">
              <FaComments className="text-gray-400" size={20} />
            </div>
            <p className="text-sm">{isConnected ? "Start a conversation!" : "Connecting..."}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === user?._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[70%] shadow-sm ${
                  msg.sender === user?._id
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender === user?._id ? "text-indigo-100" : "text-gray-500"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t border-gray-200 p-3 bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          className="flex-1 px-4 py-2 outline-none text-sm bg-gray-100 rounded-l-full"
          disabled={!isConnected}
        />
        <button
          onClick={handleSend}
          disabled={!isConnected || text.trim() === ""}
          className="bg-indigo-600 text-white px-4 rounded-r-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <IoIosSend size={18} />
        </button>
      </div>
    </div>
  );
};

const ChatDropdown = ({ user }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [followingChats, setFollowingChats] = useState([]);

  const fetchFollowingChats = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(
        "http://localhost:9999/user/following-chats",
        { withCredentials: true }
      );
      console.log(res.data)
      setFollowingChats(res.data || []);
    } catch {
      setFollowingChats([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowingChats();
      const interval = setInterval(fetchFollowingChats, 30000);
      return () => clearInterval(interval);
    }
  }, [user?._id]);

  const markMessagesAsRead = async (userId) => {
    try {
      await axios.put(
        `http://localhost:9999/api/messages/${userId}/mark-read`,
        {},
        { withCredentials: true }
      );
      setFollowingChats(prev => 
        prev.map(chat => 
          chat._id === userId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  return (
    <div className="chat-container relative flex items-center gap-4 text-gray-700 text-xl">
      <button
        onClick={() => {
          if (user) {
            setChatOpen(prev => !prev);
            if (!chatOpen) {
              fetchFollowingChats(); 
            }
          } else {
            Swal.fire({ icon: "info", text: "Please login to use chat" });
          }
        }}
        className="hover:text-indigo-600 transition p-2 rounded-full hover:bg-indigo-50 relative"
      >
        <FaComments />
      </button>

      {chatOpen && !activeChatUser && (
        <div className="absolute right-0 top-12 w-80 bg-white shadow-lg border border-gray-200 rounded-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Messages</h3>
            <button 
              onClick={fetchFollowingChats}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Refresh
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {followingChats.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                You're not following anyone yet
              </div>
            ) : (
              followingChats.map((f) => (
                <div
                  key={f._id}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                    f.unreadCount > 0 ? "bg-blue-50" : ""
                  }`}
                  onClick={async () => {
                    setActiveChatUser(f);
                    setChatOpen(false);
                    if (f.unreadCount > 0) {
                      await markMessagesAsRead(f._id);
                    }
                  }}
                >
                  <div className="relative">
                    <img 
                      src={f.avatar} 
                      alt={f.name} 
                      className="h-12 w-12 rounded-full object-cover" 
                    />

                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-gray-800 truncate">{f.name}</p>
                      <div className="flex items-center gap-2">
                        {f.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                            {f.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {f.lastTime 
                            ? new Date(f.lastTime).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })
                            : ''
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {f.online ? (
                        <>
                          <FaCircle className="text-green-500 text-[8px]" />
                          <p className="text-xs text-gray-500 truncate">Online</p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-500 truncate">
                          {f.lastMessage || "No messages yet"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeChatUser && (
        <div className="absolute right-0 top-12 z-50">
          <ChatWindow 
            receiver={activeChatUser} 
            onClose={() => {
              setActiveChatUser(null);
              fetchFollowingChats(); 
            }} 
            user={user} 
          />
        </div>
      )}
    </div>
  );
};


export default ChatDropdown;
