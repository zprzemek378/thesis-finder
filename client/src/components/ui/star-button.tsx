import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface StarButtonProps {
  initialState?: boolean;
  className?: string;
  onToggle?: (state: boolean) => void;
}

const StarButton = ({ 
  initialState = false, 
  className,
  onToggle 
}: StarButtonProps) => {
  const [isActive, setIsActive] = useState(initialState);

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "focus:outline-none transition-transform hover:scale-110 focus",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isActive ? "var(--o-yellow)" : "none"}
        stroke={isActive ? "var(--o-yellow)" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </button>
  );
};

export default StarButton;