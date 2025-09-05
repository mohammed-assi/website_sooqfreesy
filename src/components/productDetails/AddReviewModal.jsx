import React, { useState } from "react";

export const AddReviewModal = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ rating, feedback });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-600"
        >
          <i className="fa-solid fa-xmark fa-lg" />
        </button>

        <h2 className="text-xl font-bold mb-4">Add Review</h2>

        <hr className="border-gray-300" />

        <div className="flex justify-center my-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              className="mx-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={star <= rating ? "orange" : "lightgray"}
                className="w-10 h-10"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.383-2.46a1 1 0 00-1.176 0l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              <p className="text-center text-sm mt-1">{star}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-bold mb-2">
            Tell us more <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            className="w-full bg-gray-100 rounded-lg p-3 text-sm mb-4 outline-none"
            placeholder="Write your feedback..."
          />

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryDark text-white py-3 rounded-lg font-medium transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
