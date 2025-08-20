import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const LikeButton = ({ initialLiked = false, initialCount = 0, onLike }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);

    const toggleLike = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setCount(prev => prev + (newLiked ? 1 : -1));

        if (onLike) onLike(newLiked);
    };

    return (
        <button
            className={`flex items-center gap-2 transition-colors ${
                liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
            onClick={toggleLike}
        >
            {liked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
            <span>{count}</span>
        </button>
    );
};

export default LikeButton;
