import React from "react";
import icon from "../../assets/icon/otpIcon.svg";

export const AuthConfirmationModal = ({
  title,
  subtitle,
  buttonName,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img src={icon} alt="OTP Icon" className="w-14 h-14" />
        </div>

        <h2 className="text-xl font-bold text-black mb-2">{title}</h2>

        <p className="text-gray-600 text-[#888888] text-sm mb-6">{subtitle}</p>

        <button
          onClick={onClose}
          className="w-full bg-primary h-[50px] text-white hover:bg-primaryDark transition rounded"
        >
          {buttonName}
        </button>
      </div>
    </div>
  );
};
