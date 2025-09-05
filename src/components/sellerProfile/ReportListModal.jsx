import React, { useState } from "react";

const reasons = [
  "Seller is threatening me",
  "Seller is insulting me",
  "Inappropriate profile image",
  "Fraud",
  "Spam",
  "Other",
];

const ReportListModal = ({ isOpen, onClose, setShowReportButton }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    setShowReportButton(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="font-bold text-xl mb-4">Report Seller</h2>

        <div className="space-y-3">
          {reasons.map((reason, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="reportReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="accent-cyan-500"
              />
              <span className="text-gray-700">{reason}</span>
            </label>
          ))}
        </div>

        <textarea
          placeholder="Type your reason..."
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          className="w-full border-b border-gray-600 p-2 mt-4 focus:outline-none"
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="w-full px-5 py-2 bg-primary text-white rounded-md hover:bg-primaryDark transition"
          >
            Submit
          </button>
          <button
            onClick={() => {
              onClose();
              setShowReportButton(false);
            }}
            className="w-full px-5 py-2 border border-primary text-cyan-500 rounded-md hover:bg-primary hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportListModal;
