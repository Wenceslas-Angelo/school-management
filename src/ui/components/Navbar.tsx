import React from "react";
import { MdNotifications, MdSearch } from "react-icons/md";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-sm rounded-full bg-gray-100 px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
        <MdSearch size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* NOTIFICATIONS */}
        <div className="relative">
          <button className="bg-gray-100 hover:bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center transition-colors">
            <MdNotifications size={20} className="text-gray-600" />
          </button>
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs font-medium">
            1
          </span>
        </div>

        {/* USER AVATAR */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="user avatar"
            className="w-9 h-9 rounded-full border border-gray-300"
          />
          <span className="hidden md:block text-sm font-medium text-gray-700">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
