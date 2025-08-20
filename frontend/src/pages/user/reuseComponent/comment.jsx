import React from "react";
import { FaRegComment } from "react-icons/fa";

const CommentButton = ({ count = 0, onClick }) => {
    return (
        <button
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            onClick={onClick}
        >
            <FaRegComment className="text-lg" /> <span>{count}</span>
        </button>
    );
};

export default CommentButton;
