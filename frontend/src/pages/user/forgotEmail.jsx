import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire("Error", "Please enter your email", "error");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("http://localhost:9999/user/forgot-password", { email });

            navigate("/verify-otp", { state: { email, flow: "forgotPassword" } });
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                <p className="text-gray-600 text-sm mb-6 text-center">
                    Enter your email address and we’ll send you an OTP to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
