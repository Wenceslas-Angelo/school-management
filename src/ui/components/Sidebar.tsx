import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserGraduate, FaMoneyBillWave } from "react-icons/fa";

const menuItems = [
  { icon: <FaHome size={18} />, label: "Home", href: "/" },
  { icon: <FaUserGraduate size={18} />, label: "Students", href: "/students" },
  { icon: <FaMoneyBillWave size={18} />, label: "Payments", href: "/payments" }, // 💸 ici
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className="mt-2 text-sm">
      <span className="hidden lg:block text-gray-400 font-medium tracking-wide text-[11px] px-4 uppercase">
        Menu
      </span>

      <ul className="mt-3 flex flex-col space-y-2.5">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            location.pathname.startsWith(item.href + "/");

          return (
            <li key={item.label}>
              <Link
                to={item.href}
                className={`group flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden lg:block font-medium">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
