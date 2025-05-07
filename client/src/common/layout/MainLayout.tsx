import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col w-full bg-[var(--o-gray-light)]">
      <Header />
      <main className="flex-1 w-full p-8 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
