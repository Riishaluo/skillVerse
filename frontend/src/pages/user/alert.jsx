import React, { useEffect, useState } from "react";
import Navbar from "./HomeComponents/navbar";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, BellRing, Settings, Filter } from "lucide-react";
import useAlertsSocket from "../../hooks/alertHook";

const Alerts = () => {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, unread: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:9999/user/me", {
          withCredentials: true,
        });
        setUser(res.data)
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [])

  useAlertsSocket(user?._id, (newAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    setStats((prev) => ({
      total: prev.total + 1,
      unread: prev.unread + 1,
    }));
  });

  useEffect(() => {
    if (!user?._id) return;
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:9999/user/alerts", {
          withCredentials: true,
        });

        let data = res.data;

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
        setStats({
          total: data.length,
          unread: data.filter((a) => !a.isRead).length,
        });
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, [user]);

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
      setStats((prev) => ({ ...prev, unread: prev.unread - 1 }));
    } catch (err) {
      console.error("Error marking alert as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadAlerts = alerts.filter(
        (a) => !a.isRead && a.type === "admin"
      );
      await Promise.all(
        unreadAlerts.map((a) =>
          axios.put(
            `http://localhost:9999/user/alerts/${a._id}/read`,
            {},
            { withCredentials: true }
          )
        )
      );
      setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
      setStats((prev) => ({ ...prev, unread: 0 }));
    } catch (err) {
      console.error("Error marking all alerts as read:", err);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    switch (filter) {
      case "unread":
        return !alert.isRead;
      case "admin":
        return alert.type === "admin";
      case "follow":
        return alert.type === "follow";
      default:
        return true;
    }
  });

  const getAlertStyle = (alert) => {
    switch (alert.type) {
      case "admin":
        return {
          bg: "bg-blue-100",
          border: "border-blue-200",
          iconBg: "bg-blue-600",
          icon: <Settings className="w-5 h-5 text-white" />,
        };
      case "follow":
        return {
          bg: "bg-green-100",
          border: "border-green-200",
          iconBg: "bg-green-600",
          icon: <Bell className="w-5 h-5 text-white" />,
        };
      case "comment":
        return {
          bg: "bg-yellow-100",
          border: "border-yellow-200",
          iconBg: "bg-yellow-600",
          icon: <Bell className="w-5 h-5 text-white" />,
        }
      default:
        return {
          bg: "bg-gray-100",
          border: "border-gray-200",
          iconBg: "bg-gray-600",
          icon: <Bell className="w-5 h-5 text-white" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="ml-64 pr-8 px-4 pt-20 pb-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Notifications
              </h1>
              <p className="text-lg text-gray-600">
                Stay updated with your latest activities and system updates
              </p>
            </div>
            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Filter className="text-gray-500" size={20} />
                  <div className="flex gap-2">
                    {[
                      { key: "all", label: "All", count: stats.total },
                      {
                        key: "admin",
                        label: "System",
                        count: alerts.filter((a) => a.type === "admin").length,
                      },
                      {
                        key: "follow",
                        label: "Connections",
                        count: alerts.filter((a) => a.type === "follow").length,
                      },
                    ].map((filterOption) => (
                      <button
                        key={filterOption.key}
                        onClick={() => setFilter(filterOption.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === filterOption.key
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {filterOption.label}
                        {filterOption.count > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">
                            {filterOption.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <BellRing className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {filter === "all"
                    ? "No notifications yet"
                    : `No ${filter} notifications`}
                </h3>
                <p className="text-gray-500">
                  {filter === "all"
                    ? "We'll notify you when something important happens"
                    : "Try changing the filter to see more notifications"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => {
                  const alertStyle = getAlertStyle(alert);

                  return (
                    <div
                      key={alert._id}
                      className={`bg-white rounded-2xl shadow-sm border transition-all hover:shadow-md ${alert.isRead
                        ? "border-gray-200"
                        : "border-blue-200 ring-2 ring-blue-50"
                        }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {alert.type === "admin" ? (
                              <div
                                className={`w-12 h-12 rounded-full ${alertStyle.iconBg} flex items-center justify-center`}
                              >
                                {alertStyle.icon}
                              </div>
                            ) : alert.sender?.avatar ? (
                              <div className="relative">
                                <img
                                  src={alert.sender.avatar}
                                  alt={alert.sender.name}
                                  className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm"
                                />
                                <div
                                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${alertStyle.iconBg} flex items-center justify-center`}
                                >
                                  {alertStyle.icon}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`w-12 h-12 rounded-full ${alertStyle.iconBg} flex items-center justify-center text-white font-bold text-lg`}
                              >
                                {alert.sender?.name?.charAt(0).toUpperCase() ||
                                  "?"}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">
                                    {alert.type === "admin"
                                      ? "SkillVerse"
                                      : alert.sender?.name || "Someone"}
                                  </h3>
                                  {!alert.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-gray-700 mb-2">
                                  {alert.message || "You got a new connection"}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>
                                    {alert.createdAt && (
                                      <>
                                        {console.log("Alert createdAt:", alert.createdAt)}
                                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                                      </>
                                    )}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${alertStyle.bg} ${alertStyle.border
                                      .replace("border-", "text-")
                                      .replace("-200", "-700")}`}
                                  >
                                    {alert.type === "admin"
                                      ? "System"
                                      : alert.type === "follow"
                                        ? "Connection"
                                        : "Comment"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 ml-4">
                                {alert.type === "admin" && !alert.isRead && (
                                  <button
                                    onClick={() => markAsRead(alert._id)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center mb-4">
                <Bell className="text-blue-500 mr-2" size={20} />
                <h3 className="font-semibold text-gray-800">
                  Notification Center
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-900 text-sm">
                      Total
                    </div>
                    <div className="text-xs text-blue-600">
                      All notifications
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.total}
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-900 text-sm">
                      Connections
                    </div>
                    <div className="text-xs text-green-600">New followers</div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {alerts.filter((a) => a.type === "follow").length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
