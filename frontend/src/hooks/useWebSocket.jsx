import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const useWebSocket = (userId, receiverId) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!userId || !receiverId) return;
            try {
                const res = await axios.get(
                    `http://localhost:9999/api/messages/${userId}/${receiverId}`,
                    { withCredentials: true }
                );
                setMessages(res.data || []);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [userId, receiverId]);

    useEffect(() => {
        if (!userId) return;

        socketRef.current = io("http://localhost:9999", {
            withCredentials: true,
            transports: ["websocket"],
        });

        socketRef.current.on("connect", () => {
            setIsConnected(true);
            console.log("Socket connected:", socketRef.current.id);

            socketRef.current.emit("join", userId);
        });

        socketRef.current.on("receive-message", (message) => {
            if (
                (message.sender === userId && message.receiver === receiverId) ||
                (message.sender === receiverId && message.receiver === userId)
            ) {
                setMessages((prev) => [...prev, message]);
            }
        });

        socketRef.current.on("disconnect", () => {
            setIsConnected(false);
            console.log("Socket disconnected");
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [userId, receiverId]);

    const sendMessage = (text) => {
        if (!isConnected || !text.trim()) return false;

        const newMessage = {
            sender: userId,
            receiver: receiverId,
            message: text,
        };

        socketRef.current.emit("send-message", newMessage);

        return true;
    };

    return { messages, sendMessage, isConnected };
};

export default useWebSocket;
