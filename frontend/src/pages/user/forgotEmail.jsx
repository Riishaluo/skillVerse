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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            <header className="bg-white shadow-sm py-4 px-6">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold text-indigo-700">Skill Verse</h1>
                </div>
            </header>
            
            <div className="flex flex-col flex-1 justify-center items-center py-8 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
                        <p className="text-gray-600 mt-2">
                            Enter your email address and we'll send you an OTP to reset your password.
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition
                                ${loading 
                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => navigate('/login')}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;