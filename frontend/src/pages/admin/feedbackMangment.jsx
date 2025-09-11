import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./sidebar";
import Swal from "sweetalert2"; // SweetAlert for nice input modal

const AdminFeedback = () => {
  const [activeTab, setActiveTab] = useState("known");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:9999/admin/feedbacks", { withCredentials: true })
      .then(res => setFeedbacks(res.data.feedbacks))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const knownFeedbacks = feedbacks.filter(f => !f.isAnonymous);
  const anonymousFeedbacks = feedbacks.filter(f => f.isAnonymous);

  const handleSendAlert = async (userId) => {
    const { value: message } = await Swal.fire({
      title: "Send Alert",
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      showCancelButton: true,
    });

    if (message) {
      try {
        await axios.post(
          `http://localhost:9999/admin/send-alert/${userId}`,
          { message },
          { withCredentials: true }
        );
        Swal.fire("Sent!", "Alert has been sent successfully.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to send alert", "error");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Feedbacks</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("known")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === "known" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Known Users
          </button>
          <button
            onClick={() => setActiveTab("anonymous")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === "anonymous" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Anonymous Users
          </button>
        </div>

        {/* Feedback List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {(activeTab === "known" ? knownFeedbacks : anonymousFeedbacks).map(f => (
              <div
                key={f._id}
                className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex justify-between items-start"
              >
                <div>
                  {!f.isAnonymous && activeTab === "known" && (
                    <p className="font-medium text-gray-800">{f.from?.name || "Unknown User"}</p>
                  )}
                  <p className="text-gray-700 mt-1">{f.comment}</p>
                </div>

                {/* Send Alert Button */}
                {!f.isAnonymous && (
                  <button
                    onClick={() => handleSendAlert(f.from._id)}
                    className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Send Alert
                  </button>
                )}
              </div>
            ))}

            {(activeTab === "known" ? knownFeedbacks : anonymousFeedbacks).length === 0 && (
              <p className="text-gray-400 text-sm">No feedbacks here.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
