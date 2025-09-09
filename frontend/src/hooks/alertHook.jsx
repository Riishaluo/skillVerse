import { useEffect } from "react";
import { io } from "socket.io-client";

const useAlertsSocket = (userId, onAlert) => {
  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:9999", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.emit("join", userId);

    socket.on("receive-alert", (alert) => {
      console.log("📢 New alert:", alert);
      if (onAlert) onAlert(alert);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, onAlert]);
};

export default useAlertsSocket;
