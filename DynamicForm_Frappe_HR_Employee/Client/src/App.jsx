import React from "react";
import LayoutPage from "./Pages/LayoutPage";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <LayoutPage />
      </div>
    </div>
  );
};

export default App;
