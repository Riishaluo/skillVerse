import React, { useState } from "react";
import { FaImage, FaVideo, FaLightbulb, FaClock, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { FiUpload, FiX, FiCheckCircle } from "react-icons/fi";
import Navbar from "./HomeComponents/navbar";
import axios from "axios";
import Swal from "sweetalert2";

const CreatePost = () => {
    const [type, setType] = useState("Post");
    const [description, setDescription] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        if (!description.trim()) {
            return Swal.fire({ icon: "warning", text: "Description is required" });
        }

        setLoading(true)

        try {
            const formData = new FormData();
            formData.append("type", type);
            formData.append("description", description);

            if (photoFile && type === "Post") {
                formData.append("photo", photoFile);
            }

            await axios.post("http://localhost:9999/user/createPost", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });

            Swal.fire({ icon: "success", text: `${type} published successfully!` });
            setDescription("");
            setPhotoFile(null);
            setPhotoPreview(null);
        } catch (err) {
            Swal.fire({ icon: "error", text: "Failed to publish post" });
        }
        setLoading(false);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhotoFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(null);
        }
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="ml-64 pr-8 px-4 pt-20 pb-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Create Content</h1>
                    <p className="text-lg text-gray-600">
                        Share your knowledge, skills, or organize events with the community
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Creation Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            {/* Post Type Selection */}
                            <div className="flex items-center mb-8">
                                <div className="flex items-center mr-4">
                                    {type === "Post" ? (
                                        <FaEdit className="text-blue-500 mr-3" size={24} />
                                    ) : (
                                        <FaCalendarAlt className="text-purple-500 mr-3" size={24} />
                                    )}
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Create a {type}
                                    </h2>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content Type
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setType("Post")}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            type === "Post"
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                                        }`}
                                    >
                                        <FaEdit className="mx-auto mb-2" size={20} />
                                        <div className="font-medium">Post</div>
                                        <div className="text-sm opacity-75">Share skills or requests</div>
                                    </button>
                                    <button
                                        onClick={() => setType("Event")}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            type === "Event"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                                        }`}
                                    >
                                        <FaCalendarAlt className="mx-auto mb-2" size={20} />
                                        <div className="font-medium">Event</div>
                                        <div className="text-sm opacity-75">Organize gatherings</div>
                                    </button>
                                </div>
                            </div>

                            {/* Description Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={
                                        type === "Post"
                                            ? "What skills do you want to share or learn? Be specific about your expertise or what you're looking for..."
                                            : "Describe your event - what it's about, when it's happening, and what participants can expect..."
                                    }
                                    className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                                    rows="6"
                                ></textarea>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm text-gray-500">
                                        {description.length}/500 characters
                                    </div>
                                </div>
                            </div>

                            {/* Media Upload Section (Post only) */}
                            {type === "Post" && (
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Add Media (Optional)
                                    </label>
                                    
                                    {!photoPreview ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
                                            <FiUpload className="mx-auto text-gray-400 mb-4" size={48} />
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="photoUpload"
                                                    className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer font-medium"
                                                >
                                                    <FaImage className="mr-2" />
                                                    Choose Image
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                    id="photoUpload"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                JPG, PNG or GIF up to 10MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-full max-h-80 object-cover rounded-2xl shadow-sm"
                                            />
                                            <button
                                                onClick={removePhoto}
                                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    {type === "Post" ? "Share your expertise with the community" : "Create engaging events for others"}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setDescription("");
                                            setPhotoFile(null);
                                            setPhotoPreview(null);
                                        }}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={handlePublish}
                                        disabled={loading}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheckCircle className="mr-2" />
                                                Publish {type}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Tips */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <div className="flex items-center mb-4">
                                <FaLightbulb className="text-yellow-500 mr-2" size={20} />
                                <h3 className="font-semibold text-gray-800">Tips for Better {type}s</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <div className="font-medium text-gray-700 text-sm mb-1">Be Specific</div>
                                        <div className="text-xs text-gray-500">
                                            {type === "Post" 
                                                ? "Clearly state what skills you offer or need"
                                                : "Include event details, time, and requirements"
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <div className="font-medium text-gray-700 text-sm mb-1">Add Context</div>
                                        <div className="text-xs text-gray-500">
                                            Share your experience level and availability
                                        </div>
                                    </div>
                                </div>

                                {type === "Post" && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div>
                                            <div className="font-medium text-gray-700 text-sm mb-1">Use Images</div>
                                            <div className="text-xs text-gray-500">
                                                Visual content gets more engagement
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <div className="font-medium text-gray-700 text-sm mb-1">Be Professional</div>
                                        <div className="text-xs text-gray-500">
                                            Use clear, respectful language
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;