import React from "react";

export default function LoadingButton({
  children,
  loading,
  disabled,
  className,
  type,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`relative w-full py-3 font-semibold rounded-lg transition 
        flex items-center justify-center
        ${loading || disabled ? "opacity-70 cursor-not-allowed" : ""}
        ${className}`}
      {...props}
    >
      {loading && (
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></span>
        </div>
      )}
      {!loading && children}
    </button>
  );
}
