import React from "react";

const CopilotSectionComp = ({ questionData }) => {
  if (!questionData) {
    return (
      <div className="h-full bg-white shadow-md rounded-xl p-6 flex flex-col">
        <h2 className="font-semibold text-lg text-gray-700 mb-4">
          Co-Pilot Section
        </h2>
        <p className="text-gray-400">No question selected</p>
      </div>
    );
  }

  const { description } = questionData;

  return (
    <div className="h-full bg-white shadow-md rounded-xl p-6 flex flex-col">
      <h2 className="font-semibold text-lg text-gray-700 mb-4">
        Co-Pilot Section
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {/* Short Description */}
        {description?.short && (
          <p className="text-gray-700 text-base">{description.short}</p>
        )}

        {/* Detailed Description */}
        {description?.detailed && (
          <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded">
            {description.detailed}
          </p>
        )}

        {/* Tip */}
        {description?.tip && (
          <p className="text-gray-500 text-sm italic">{description.tip}</p>
        )}
      </div>
    </div>
  );
};

export default CopilotSectionComp;
