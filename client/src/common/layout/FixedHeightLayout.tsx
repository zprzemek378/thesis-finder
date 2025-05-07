import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";

interface FixedHeightLayoutProps {
  children: React.ReactNode;
}

const FixedHeightLayout = ({ children }: FixedHeightLayoutProps) => {
  return (
    <div className="flex flex-col h-screen w-full bg-[var(--o-gray-light)] overflow-hidden">
      <Header />
      <main className="flex-1 w-full p-8 flex flex-col min-h-0">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default FixedHeightLayout;
