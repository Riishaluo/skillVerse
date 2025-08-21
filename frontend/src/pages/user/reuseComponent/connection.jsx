import React, { useState } from "react"
import axios from "axios"

const ConnectButton = ({ userId, initialStatus = null }) => {
  const [status, setStatus] = useState(initialStatus)

  const handleConnect = async () => {
    try {
      const res = await axios.post(
        `http://localhost:9999/user/follow/${userId}`,
        {},
        { withCredentials: true }
      )

      if (res.data.status === "Connected") {
        setStatus("Connected")
      } else if (res.data.status === "Unfollowed") {
        setStatus(null)
      }
    } catch (error) {
      console.error("Connection error:", error)
      setStatus(null)
    }
  }

  return (
    <button
      onClick={handleConnect}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors
        ${status === "Connected"
          ? "bg-green-100 text-green-700"
          : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
    >
      {status === "Connected" ? "Connected" : "Connect"}
    </button>
  )
}

export default ConnectButton
