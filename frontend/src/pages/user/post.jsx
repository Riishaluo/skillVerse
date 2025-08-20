import React, { useState } from "react";
import { FaImage, FaVideo, FaLightbulb, FaClock } from "react-icons/fa";
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

    return (
        <div className="pt-[72px] bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <Navbar />
            <div className="flex justify-center p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl border border-gray-100">
                    <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                        Create a {type}
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">
                        {type === "Post"
                            ? "Share your skills or request to learn"
                            : "Share details about your event"}
                    </p>

                    <div className="mb-5">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        >
                            <option value="Post">Post</option>
                            <option value="Event">Event</option>
                        </select>
                    </div>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={
                            type === "Post"
                                ? "What would you like to share or learn?"
                                : "Describe your event..."
                        }
                        className="w-full border border-gray-300 rounded-lg p-4 mb-5 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition"
                        rows="4"
                    ></textarea>

                    {type === "Post" && (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-5 hover:border-purple-400 transition bg-gray-50">
                            <div className="flex justify-center gap-8 mb-3 text-gray-600">
                                <label
                                    htmlFor="photoUpload"
                                    className="flex items-center gap-2 cursor-pointer hover:text-purple-500 transition"
                                >
                                    <FaImage /> Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    id="photoUpload"
                                />
                                {/* <button className="flex items-center gap-2 hover:text-purple-500 transition">
                                    <FaVideo /> Video
                                </button> */}
                            </div>
                            {photoPreview && (
                                <div className="mt-4">
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="rounded-lg max-h-64 mx-auto shadow-md"
                                    />
                                </div>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Drag and drop media here or click to upload
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Publishing..." : `Publish ${type}`}
                        </button>
                    </div>
                </div>

                <div className="ml-8 w-64 hidden lg:block">
                    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                        <h3 className="font-semibold mb-4 text-purple-600">Tips for Better {type}s</h3>
                        <ul className="text-sm text-gray-600 space-y-3">
                            <li className="flex items-center gap-2">
                                <FaLightbulb className="text-yellow-500" /> Be specific about your post
                            </li>
                            <li className="flex items-center gap-2">
                                <FaClock className="text-blue-500" /> Include time availability
                            </li>
                            <li className="flex items-center gap-2">
                                <FaImage className="text-green-500" /> Add relevant media (Post only)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
