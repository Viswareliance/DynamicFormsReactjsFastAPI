import React from "react";
import DynamicFormLoader from "../components/DynamicFormLoader";
import SingleProfileForm from "../components/SingleProfileForm";
import LocationForm from "../components/LocationForm";
import SearchRenderDynamicForm from "../components/SearchRenderDynamicForm";
import QueryRenderForm from "../components/QueryRenderForm";

const LayoutPage = () => {
  return (
    <div className="min-h-screen w-full bg-white shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Dynamic Form 2
      </h1>

      {/* <DynamicFormLoader /> */}
      {/* <SingleProfileForm /> */}
      {/* <LocationForm /> */}
      {/* <SearchRenderDynamicForm /> */}
      <QueryRenderForm />
    </div>
  );
};

export default LayoutPage;
