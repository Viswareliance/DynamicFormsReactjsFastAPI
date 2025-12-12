import React from "react";

const TitleComp = ({ selectedCategory }) => {
  return (
    <div className="bg-gray-100 text-gray-800 p-3 text-center font-medium text-lg">
      {selectedCategory ? `${selectedCategory}` : "Title Section"}
    </div>
  );
};

export default TitleComp;
