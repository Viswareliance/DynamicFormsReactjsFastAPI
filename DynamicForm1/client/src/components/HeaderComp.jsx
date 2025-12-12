// src/components/HeaderComp.jsx
import React, { useState } from "react";

const HeaderComp = ({ toolBar, onSelectCategory }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  if (!toolBar || Object.keys(toolBar).length === 0) {
    return <div className="bg-gray-500 text-white p-4">Loading...</div>;
  }

  const toggleDropdown = (section) =>
    setOpenDropdown((s) => (s === section ? null : section));

  return (
    <div className="bg-blue-200 text-white p-2 font-semibold flex items-center justify-between relative">
      <div className="font-bold text-black">Job Portal</div>

      <div className="flex justify-center gap-8">
        {Object.entries(toolBar).map(([sectionName, items]) => (
          <div key={sectionName} className="relative">
            <button
              className="hover:bg-gray-300 px-3 py-1 rounded text-black"
              onClick={() => toggleDropdown(sectionName)}
            >
              {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
            </button>

            {openDropdown === sectionName && (
              <div className="absolute left-0 mt-2 bg-white text-black rounded shadow-lg w-40 z-50">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setOpenDropdown(null);
                      onSelectCategory(item);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderComp;
