import React from "react";

const ToastNotification = ({ message, status }) => {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-amber-400">
      <div
        className={`text-white min-w-[22rem] mx-auto rounded-md bg-background shadow-md ${
          status === "failure"
            ? "bg-[#371818] text-red-500"
            : "bg-[#313e2c] text-green-500"
        }`}
      >
        <img src="" alt="" />
        {message}
      </div>
      <div className="absolute left-1 bottom-1 w-[98%] h-1 transform scale-x-0 origin-left bg-gradient-to-r from-primaryLight to-primaryDark rounded-md" />
    </div>
  );
};

export default ToastNotification;
