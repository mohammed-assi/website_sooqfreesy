import React from "react";

export const ScreenLoader = () => {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="center-body">
        <div className="loader-spanne-20">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};
