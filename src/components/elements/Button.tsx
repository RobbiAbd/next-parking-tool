import React from "react";

interface ButtonProps {
  label: string; // Text displayed on the button
  onClick?: () => void; // Function to handle click events
  type?: "button" | "submit" | "reset"; // Button type
  variant?: "primary" | "secondary" | "danger" | "success"; // Button style variants
  size?: "xs" | "sm" | "md" | "lg" | "xl"; // Button size variants
  disabled?: boolean; // Disable the button
  className?: string; // Additional custom class names
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "secondary":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "text-xs px-2 py-1";
      case "sm":
        return "text-sm px-3 py-1.5";
      case "md":
        return "text-md px-4 py-2";
      case "lg":
        return "text-lg px-5 py-3";
      case "xl":
        return "text-xl px-6 py-3.5";
      default:
        return "text-md px-4 py-2"; // Default to medium size
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md font-medium transition ${getVariantClasses()} ${getSizeClasses()} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;