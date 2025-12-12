import React from "react";

const VideoField = ({ field, register }) => {
  // Same name generation as ImageField
  const name = field.Question_section_title.replace(/\s+/g, "_");

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4 mb-6">
      {/* Show video */}
      <video
        controls
        src={field.video?.url}
        className="w-full h-60 object-cover rounded-lg"
      >
        Your browser does not support the video tag.
      </video>

      {/* Title */}
      <h2 className="text-lg font-semibold">{field.Question_section_title}</h2>

      {/* Description */}
      <p className="text-gray-700">{field.question?.Question_description}</p>

      {/* Input field */}
      <input
        type="text"
        placeholder={field.question?.placeholder || "Enter your answer..."}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        {...register(name, field.validationRules)}
      />
    </div>
  );
};

export default VideoField;
