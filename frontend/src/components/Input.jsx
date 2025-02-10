import React from "react";

const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  disabled = false,
  required = false,
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`w-full p-2 bg-transparent border-b placeholder:text-gray-600 border-b-[#ECECEC] focus:outline-none focus:border-b-2 ${className}`}
      {...props}
    />
  );
};

export default Input