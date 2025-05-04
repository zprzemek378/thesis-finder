import React from "react";
import { Link } from "react-router-dom";
import NavButton from "./NavButton";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[var(--o-blue)] w-full text-white">
      <div>
        <h1 className="text-xl font-bold">System wyszukiwania promotorów</h1>
      </div>
    </header>
  );
};

export default Header;