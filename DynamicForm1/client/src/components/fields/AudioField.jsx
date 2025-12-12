import React from "react";

const AudioField = ({ field, register }) => {
  // Same name logic as ImageField
  const name = field.Question_section_title.replace(/\s+/g, "_");

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4 mb-6">
      {/* Audio player */}
      <audio controls src={field.audio?.url} className="w-full rounded-lg">
        Your browser does not support the audio element.
      </audio>

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

export default AudioField;
