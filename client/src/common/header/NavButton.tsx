import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  children: React.ReactNode;
  to: string;
  pathname?: string;
  variant?: "default" | "login";
}

const NavButton = ({
  children,
  to,
  pathname = "",
  variant = "default",
}: NavButtonProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors w-full md:w-auto flex items-center justify-center",
        "rounded-full",
        variant === "default"
          ? "hover:bg-[var(--o-blue-light)] text-white border border-[var(--o-yellow)]"
          : "bg-white hover:bg-gray-100 text-[var(--o-blue)]",
        pathname === to
          ? "bg-[var(--o-yellow)] text-[var(--o-blue)] hover:bg-[var(--o-yellow-light)]"
          : ""
      )}
    >
      {children}
    </Link>
  );
};

export default NavButton;
