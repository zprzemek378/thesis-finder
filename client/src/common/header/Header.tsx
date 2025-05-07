import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavButton from "./NavButton";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = useLocation().pathname;

  return (
    <header className="bg-[var(--o-blue)] w-full text-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <h1 className="text-xl font-bold">
              System wyszukiwania promotorów
            </h1>
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0`}
        >
          <NavButton to="/search" pathname={pathname}>
            Wyszukaj
          </NavButton>
          <NavButton to="/my-theses" pathname={pathname}>
            Moje prace
          </NavButton>
          <NavButton to="/saved" pathname={pathname}>
            Zapisane
          </NavButton>
          <NavButton to="/login" variant="login">
            Zaloguj
          </NavButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
