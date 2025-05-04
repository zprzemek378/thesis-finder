import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  children: React.ReactNode;
  to: string;
  variant?: "default" | "login";
}

const NavButton = ({ children, to, variant = "default" }: NavButtonProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors w-full md:w-auto text-center",
        variant === "default" 
          ? "hover:bg-[var(--o-blue-light)] text-white " 
          : "bg-white hover:bg-gray-100 text-[var(--o-blue)] rounded-md"
      )}
    >
      {children}
    </Link>
  );
};

export default NavButton;