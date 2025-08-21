import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    if (role === "admin") return <Navigate to="/adminLogin" replace />;
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
