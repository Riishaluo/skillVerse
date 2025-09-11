import React, { useState, useEffect } from "react";
import { Lock, AlertTriangle, Mail, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const BlockedPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
                <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {/* Main card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 text-center max-w-md mx-auto">
                        {/* Icon with animation */}
                        <div className="relative mb-8">
                            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto shadow-lg animate-bounce">
                                <Lock className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute inset-0 w-24 h-24 bg-red-500 rounded-full mx-auto animate-ping opacity-20"></div>
                        </div>

                        {/* Warning badge */}
                        <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <AlertTriangle className="w-4 h-4" />
                            Security Alert
                        </div>

                        {/* Main content */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Access Denied
                        </h1>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Your account has been temporarily restricted due to suspicious activity or policy violations.
                        </p>

                        {/* Details section */}
                        <div className="mb-8">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="text-red-600 hover:text-red-700 font-medium text-sm underline underline-offset-2 transition-colors"
                            >
                                {showDetails ? 'Hide Details' : 'View Details'}
                            </button>

                            <div className={`mt-4 transition-all duration-300 overflow-hidden ${showDetails ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-red-50 rounded-2xl p-4 text-left">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-red-900 text-sm mb-1">Restriction Reason</h3>
                                            <p className="text-red-700 text-sm">Inappropriate Action Taken By This Account.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to='/login' > <div className="space-y-3">
                            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </button>
                        </div>
                        </Link>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700">SkillVerse@gmail.com</p>
                            <p className="text-xs text-gray-500 mt-1">Response time: Usually within 24 hours</p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                            If you believe this restriction was applied in error, our support team will review your case and restore access as soon as possible.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockedPage;