import { useState } from "react";
import { Star, Send, MessageCircle } from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "./HomeComponents/navbar";
import axios from "axios";

const FeedbackForm = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = async () => {
        if (!rating || !feedback.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Oops!",
                text: "Please provide both rating and feedback",
            });
            return;
        }

        const payload = { rating, comment: feedback, isAnonymous };

        try {
            const res = await axios.post(
                "http://localhost:9999/user/feedback",
                payload,
                { withCredentials: true }
            );

            console.log(res.data);

            Swal.fire({
                icon: "success",
                title: "Thank you!",
                text: "Your feedback has been submitted successfully.",
                confirmButtonText: "OK",
            });
            
            setRating(0);
            setFeedback("");
            setIsAnonymous(false);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Something went wrong. Please try again.",
            });
        }
    };


    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="ml-64 pr-8 px-4 pt-20 pb-8 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <MessageCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            We'd love your feedback
                        </h1>
                        <p className="text-gray-600">Help us improve your experience</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 border border-gray-100">
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                How was your experience?
                            </label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1"
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-colors ${star <= (hoveredStar || rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-center text-sm text-gray-600 mt-2 animate-in fade-in duration-300">
                                    {rating === 1 && "We're sorry to hear that"}
                                    {rating === 2 && "We'll work to improve"}
                                    {rating === 3 && "Thanks for the feedback"}
                                    {rating === 4 && "Great to hear!"}
                                    {rating === 5 && "Fantastic! Thank you!"}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Tell us more about your experience
                            </label>
                            <div className="relative">
                                <textarea
                                    value={feedback}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 250) {
                                            setFeedback(e.target.value);
                                        }
                                    }}
                                    placeholder="Share your thoughts, suggestions, or concerns..."
                                    className="w-full border-2 border-gray-200 rounded-2xl p-4 pr-16 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-700"
                                    rows="4"
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                                    {feedback.length}/250
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={() => setIsAnonymous(!isAnonymous)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-5 h-5 rounded border-2 transition-all duration-200 ${isAnonymous
                                            ? "bg-blue-600 border-blue-600  "
                                            : "border-gray-300 group-hover:border-blue-400"
                                            }`}
                                    >
                                        {isAnonymous && (
                                            <svg
                                                className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                    Submit feedback anonymously
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!rating || !feedback.trim()}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-medium text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600 flex items-center justify-center gap-2 group"
                        >
                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            Send Feedback
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-500 mt-6">
                        Your feedback helps us create better experiences for everyone
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
