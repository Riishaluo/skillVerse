import React, { useState, useEffect, useRef } from "react";
import { FaComments } from "react-icons/fa";
import Swal from "sweetalert2";

// Mock WebSocket service
const useWebSocket = (userId, receiverId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    if (!userId || !receiverId) return;

    // Simulate WebSocket connection
    console.log(`Connecting to chat with ${receiverId}`);
    
    // Mock connection success
    const timer = setTimeout(() => {
      setIsConnected(true);
      
      // Load mock previous messages
      const mockMessages = [
        { id: 1, sender: receiverId, text: "Hi there!", timestamp: new Date(Date.now() - 3600000) },
        { id: 2, sender: userId, text: "Hello! How are you?", timestamp: new Date(Date.now() - 3500000) },
        { id: 3, sender: receiverId, text: "I'm good, thanks!", timestamp: new Date(Date.now() - 3400000) },
      ];
      setMessages(mockMessages);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (ws.current) {
        console.log("Disconnecting from chat");
        ws.current.close();
      }
    };
  }, [userId, receiverId]);

  const sendMessage = (text) => {
    if (!isConnected) return false;
    
    // Create a new message object
    const newMessage = {
      id: Date.now(),
      sender: userId,
      text,
      timestamp: new Date(),
    };
    
    // Add to local messages
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate response after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: receiverId,
        text: "Thanks for your message!",
        timestamp: new Date(),
      }]);
    }, 1000);
    
    return true;
  };

  return { messages, sendMessage, isConnected };
};

const ChatWindow = ({ receiver, onClose, user }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, isConnected } = useWebSocket(user?._id, receiver?._id);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (text.trim() === "") return;
    
    const success = sendMessage(text);
    if (success) {
      setText("");
    } else {
      Swal.fire({ icon: "error", text: "Failed to send message" });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg flex flex-col h-96 w-80">
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <div>
          <span className="font-medium">Chat with {receiver?.name}</span>
          <div className="text-xs opacity-80 flex items-center">
            <span className={`h-2 w-2 rounded-full mr-1 ${isConnected ? 'bg-green-400' : 'bg-gray-300'}`}></span>
            {isConnected ? 'Online' : 'Connecting...'}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:bg-blue-700 rounded-full h-6 w-6 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {isConnected ? 'Start a conversation!' : 'Connecting...'}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === user?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === user?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
                <div className={`text-xs mt-1 ${msg.sender === user?._id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 outline-none"
          disabled={!isConnected}
        />
        <button
          onClick={handleSend}
          disabled={!isConnected || text.trim() === ""}
          className="bg-blue-600 text-white px-4 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

const ChatDropdown = ({ user }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  // Mock following list
  const following = [
    { _id: "2", name: "Alice Smith", online: true },
    { _id: "3", name: "Robert Lee", online: false },
    { _id: "4", name: "Emma Wilson", online: true },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.chat-container')) {
        setChatOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="chat-container flex items-center gap-4 text-gray-700 text-xl relative">
      <button
        onClick={() => {
          if (user) setChatOpen((prev) => !prev);
          else Swal.fire({ icon: "info", text: "Please login to use chat" });
        }}
        className="hover:text-blue-600 transition p-1 rounded-full hover:bg-blue-50 relative"
      >
        <FaComments />
        {following.filter(f => f.online).length > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></span>
        )}
      </button>

      {chatOpen && !activeChatUser && (
        <div className="absolute right-0 top-12 w-60 bg-white shadow-lg border rounded-lg z-50">
          <h3 className="p-3 border-b font-semibold">Following</h3>
          <div className="max-h-64 overflow-y-auto">
            {following.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-500">
                You're not following anyone yet
              </div>
            ) : (
              following.map((f) => (
                <div
                  key={f._id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    setActiveChatUser(f);
                    setChatOpen(false);
                  }}
                >
                  <span className="h-2 w-2 rounded-full mr-2 bg-green-400"></span>
                  {f.name}
                  {f.online && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-green-400"></span>
                  )}
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
            onClose={() => setActiveChatUser(null)}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

export default ChatDropdown;