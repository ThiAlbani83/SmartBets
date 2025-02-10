const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-roboto font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
        disabled ? "cursor-not-allowed" : "text-white"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
