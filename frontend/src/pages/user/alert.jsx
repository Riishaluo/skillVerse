import React, { useEffect, useState } from "react";
import Navbar from "./HomeComponents/navbar";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Bell, X, Check } from "lucide-react";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:9999/user/alerts", {
          withCredentials: true,
        });

        let data = res.data;

        // Auto-mark follow alerts as read
        const unreadFollow = data.filter(
          (a) => a.type === "follow" && !a.isRead
        );

        if (unreadFollow.length > 0) {
          await Promise.all(
            unreadFollow.map((a) =>
              axios.put(
                `http://localhost:9999/user/alerts/${a._id}/read`,
                {},
                { withCredentials: true }
              )
            )
          );
          data = data.map((a) =>
            a.type === "follow" ? { ...a, isRead: true } : a
          );
        }

        setAlerts(data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  // Mark as read (for admin alerts only)
  const markAsRead = async (alertId) => {
    try {
      await axios.put(
        `http://localhost:9999/user/alerts/${alertId}/read`,
        {},
        { withCredentials: true }
      );
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? { ...a, isRead: true } : a))
      );
    } catch (err) {
      console.error("Error marking alert as read:", err);
    }
  };

  // Dismiss alert
  const clearAlert = async (alertId) => {
    try {
      await axios.delete(
        `http://localhost:9999/user/alerts/${alertId}`,
        { withCredentials: true }
      );
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    } catch (err) {
      console.error("Error clearing alert:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-20 px-4 pb-10">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700">
              No notifications yet
            </h3>
            <p className="text-gray-500 mt-1">
              We’ll notify you when something arrives
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`flex items-start gap-4 p-4 rounded-xl shadow-sm border transition ${
                  alert.isRead
                    ? "bg-white border-gray-200"
                    : "bg-indigo-50 border-indigo-100"
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                  {alert.type === "admin" ? (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      SV
                    </div>
                  ) : alert.sender?.avatar ? (
                    <img
                      src={alert.sender.avatar}
                      alt={alert.sender.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                      {alert.sender?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {alert.type === "admin" ? (
                    <>
                      <p className="text-gray-900 font-semibold">
                        SkillVerse
                      </p>
                      <p className="text-gray-800 text-sm">{alert.message}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-900 font-semibold">
                        {alert.sender?.name || "Someone"}
                      </p>
                      <p className="text-gray-800 text-sm">
                        {alert.message || "You got a new connection"}
                      </p>
                    </>
                  )}

                  <span className="text-xs text-gray-500 block mt-2">
                    {formatDistanceToNow(new Date(alert.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {alert.type === "admin" && !alert.isRead && (
                    <button
                      onClick={() => markAsRead(alert._id)}
                      className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => clearAlert(alert._id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                    title="Dismiss"
                  >
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
