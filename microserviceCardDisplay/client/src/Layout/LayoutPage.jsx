import React, { useState } from "react";
import HeaderComp from "../components/HeaderComp";
import SidebarComp from "../components/SidebarComp";
import TitleComp from "../components/TitleComp";
import ContentComp from "../components/ContentComp";
import FooterComp from "../components/FooterComp";

const LayoutPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex flex-col h-screen w-full">
      {/* header */}
      <HeaderComp />
      {/* main Area */}
      <div className="flex flex-1 bg-gray-100">
        {/* sidebar */}
        <SidebarComp isOpen={isOpen} setIsOpen={setIsOpen} />
        {/* content area */}
        <div
          className={`flex-1 p-6 transition-all duration-300 ${
            isOpen ? "ml-0" : ""
          }`}
        >
          {/* title */}
          <TitleComp />
          {/* content */}
          <ContentComp />
        </div>
      </div>
      {/* footer */}
      <FooterComp />
    </div>
  );
};

export default LayoutPage;
