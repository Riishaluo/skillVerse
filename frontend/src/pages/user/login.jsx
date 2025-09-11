import React, { useState } from "react"
import { FaEnvelope, FaLock } from "react-icons/fa"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:9999/user/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(res.data.user);
      setUser(res.data.user);

      navigate("/");
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.isBlocked) {
        navigate("/block");
        return;
      }

      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <div className="backdrop-blur-lg bg-white/70 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <span className="bg-blue-600 text-white text-sm font-semibold px-5 py-1 rounded-full shadow-md">
            SkillVerse
          </span>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Sign in to continue your journey with SkillVerse
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative group">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>

          <div className="relative group">
            <FaLock className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>

          <div className="text-right -mt-2 mb-4">
            <a
              href="/forgotEmail"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-semibold hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
