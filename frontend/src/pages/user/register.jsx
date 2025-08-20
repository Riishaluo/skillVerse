  import { useState } from "react";
  import axios from "axios";
  import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";

  export default function SignupPage() {

    const navigate = useNavigate()

    const [form, setForm] = useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!form.fullName.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
        return setMessage("Please fill in all the fields.");
      }

      if (form.password.length < 6) {
        return setMessage("Password must be at least 6 characters long.");
      }

      if (form.password !== form.confirmPassword) {
        return setMessage("Passwords do not match");
      }

      try {
        setLoading(true);
        setMessage("");

        const { data } = await axios.post("http://localhost:9999/user/send-otp", {
          name: form.fullName,
          email: form.email,
          password: form.password,
        });

        if (data.success) {
          navigate("/verify-otp", { state: { email: form.email } });
        } else {
          setMessage(data.message || "Something happened");
        }
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="flex h-screen">
        <div className="w-1/2 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white">
          <div className="text-center px-10">
            <h1 className="text-3xl font-bold mb-4">Swap skills. Grow together.</h1>
            <p className="text-lg">Welcome to SkillVerse</p>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-2">Create your account</h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              Join SkillVerse to start sharing and learning
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
              >
                {loading ? "Sending OTP..." : "Create Account"}
              </button>
            </form>

            {message && (
              <p className="text-center text-sm mt-4 text-red-500">{message}</p>
            )}

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 hover:underline">Login</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
