import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const useWebSocket = (userId, receiverId) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    // Fetch messages & mark as read
    useEffect(() => {
        if (!userId || !receiverId) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:9999/api/messages/${userId}/${receiverId}`,
                    { withCredentials: true }
                );
                setMessages(res.data || []);

                // Mark messages from receiver as read
                await axios.put(
                    `http://localhost:9999/api/messages/${receiverId}/mark-read`,
                    {},
                    { withCredentials: true }
                );
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMessages();
    }, [userId, receiverId]);

    // Socket.IO connection - Only depend on userId
    useEffect(() => {
        if (!userId) return;

        // Only create socket if it doesn't exist
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:9999", {
                withCredentials: true,
                transports: ["websocket"],
            });

            socketRef.current.on("connect", () => {
                setIsConnected(true);
                socketRef.current.emit("join", userId);
                console.log("Socket connected:", socketRef.current.id);
            });

            socketRef.current.on("disconnect", () => {
                setIsConnected(false);
                console.log("Socket disconnected");
            });
        }

        const handleReceiveMessage = async (message) => {
            if (message.sender === receiverId && message.receiver === userId) {
                setMessages((prev) => [...prev, message]);

                if (!message.isRead) {
                    try {
                        await axios.put(
                            `http://localhost:9999/api/messages/${receiverId}/mark-read`,
                            {},
                            { withCredentials: true }
                        );
                    } catch (err) {
                        console.error("Failed to mark message as read:", err);
                    }
                }
            }
        };


        socketRef.current.on("receive-message", handleReceiveMessage);

        // Cleanup only the message listener when dependencies change
        return () => {
            if (socketRef.current) {
                socketRef.current.off("receive-message", handleReceiveMessage);
            }
        };
    }, [userId, receiverId]); // Keep dependencies

    // Send message (optimistic update)
    const sendMessage = (text) => {
        if (!isConnected || !receiverId || !text.trim()) return false;

        const tempMessage = {
            sender: userId,
            receiver: receiverId,
            message: text,
            isRead: false,
            createdAt: new Date(),
        };

        // Update UI immediately
        setMessages((prev) => [...prev, tempMessage]);

        // Emit to server
        socketRef.current.emit("send-message", tempMessage);

        return true;
    };

    // Sort by createdAt only
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    return { messages: sortedMessages, sendMessage, isConnected };
};


export default useWebSocket;
