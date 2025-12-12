import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";
const SidebarComp = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`${
        isOpen ? "w-52" : "w-7"
      } bg-gray-800 text-white h-full transition-all duration-300 p-2 flex flex-col shadow-md`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white text-2xl mb-6 self-end focus:outline-none"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Menu */}
      <nav className="space-y-4">
        <div className="hover:bg-gray-700 p-2 rounded">Dashboard</div>
        <div className="hover:bg-gray-700 p-2 rounded">Users</div>
        <div className="hover:bg-gray-700 p-2 rounded">Settings</div>
      </nav>
    </div>
  );
};

export default SidebarComp;
