import { Navigate } from "react-router-dom"
import { useAuth } from "../context/authContext"


const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  console.log(user)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Loading, please wait...</p>
      </div>
    )
  }

  if (user) {
    if (user.role === "admin") return <Navigate to="/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return children
}


export default PublicRoute
