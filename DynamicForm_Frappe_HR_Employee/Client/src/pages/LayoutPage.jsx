import React from "react";

import QueryRenderForm from "../components/QueryRenderForm";

const LayoutPage = () => {
  return (
    <div className="min-h-screen w-full bg-white shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Dynamic Form Frappe HR
      </h1>

      <QueryRenderForm />
    </div>
  );
};

export default LayoutPage;
