import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* LEFT SIDEBAR */}
      <aside className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-white shadow-md flex flex-col">
        <Link
          to="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-6"
        >
          <img src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold text-gray-700 text-lg">
            School
          </span>
        </Link>
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
