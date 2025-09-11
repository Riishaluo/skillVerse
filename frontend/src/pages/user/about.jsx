import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Eye, MapPin, Mail, Phone } from "lucide-react";

const About = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-20 px-6">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 font-semibold transition-all duration-200 hover:gap-3 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">About SkillVerse</h1>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        SkillVerse is a cutting-edge platform that connects learners and instructors.
                        Share your skills, book sessions, communicate in real-time, and grow your network.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-10 hover:shadow-xl transition-all duration-300 border border-white/50">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            To make skill-sharing easy, accessible, and rewarding for learners and instructors
                            across India and beyond.
                        </p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-10 hover:shadow-xl transition-all duration-300 border border-white/50">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            To build a global community where knowledge is shared, skills are nurtured,
                            and meaningful connections are created.
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mb-20">
                    <h2 className="text-4xl font-black text-gray-900 text-center mb-12">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <h3 className="text-2xl font-bold mb-4">Smart Skill Matching</h3>
                            <p className="text-blue-100 leading-relaxed">
                                Find the right instructor or learner based on your skill and interest.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <h3 className="text-2xl font-bold mb-4">Real-Time Chat</h3>
                            <p className="text-purple-100 leading-relaxed">
                                Communicate instantly with connections and manage your skill sessions easily.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <h3 className="text-2xl font-bold mb-4">Ratings & Reviews</h3>
                            <p className="text-green-100 leading-relaxed">
                                Give and receive feedback to improve your skill-sharing experience.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="mb-20">
                    <h2 className="text-4xl font-black text-gray-900 text-center mb-12">Contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 border border-white/50">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Email</h3>
                            <p className="text-gray-700 text-lg">SkillVerse@gmail.com</p>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 border border-white/50">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Phone</h3>
                            <p className="text-gray-700 text-lg">+91 986676534567</p>
                        </div>

                    </div>
                </div>


                {/* Call To Action */}
                <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                    <h2 className="text-4xl font-black mb-6">Join the SkillVerse Community</h2>
                    <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                        Start sharing your skills and learning from others today.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default About;