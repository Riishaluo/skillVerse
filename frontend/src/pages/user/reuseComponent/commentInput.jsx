import React from "react";

const CommentInput = ({ value, onChange, onSubmit }) => {
    return (
        <div className="flex gap-2 mt-2">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border rounded-lg"
            />
            <button
                onClick={onSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                Post
            </button>
        </div>
    );
};

export default CommentInput;
