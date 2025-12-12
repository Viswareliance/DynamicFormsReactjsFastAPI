// src/components/ConsolidationSectionComp.jsx
import React from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const ConsolidationSectionComp = ({
  allQuestions,
  answers,
  selectedCategory,
  onSelectQuestion,
}) => {
  const total = allQuestions.length;
  const answered = answers.filter((a) =>
    allQuestions.some((q) => q.QturnId === a.qturnId)
  ).length;
  const allAnswered = total > 0 && answered === total;

  const handleUpload = async () => {
    try {
      if (!selectedCategory) return alert("Category not selected");

      // add category field to each answer (backend expects category)
      const payload = answers.map((a) => ({
        ...a,
        category: selectedCategory,
      }));

      // post payload as an array to backend; backend will write selectedCategory.json
      await axios.post(`${API}/upload_answers`, payload);

      alert(`${selectedCategory} answers uploaded successfully!`);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload answers");
    }
  };

  const handleCancelSubmitBackend = () => {
    // Currently just alert — you can dispatch resetCategoryAnswers or resetAllAnswers from parent
    alert("Cancelled");
  };

  return (
    <div className="h-full bg-white shadow-md rounded-xl p-6 flex flex-col relative">
      <h2 className="font-semibold text-lg text-gray-700 mb-4">
        Consolidation Section
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {allQuestions.map((q) => {
          const answerObj = answers.find((a) => a.qturnId === q.QturnId);
          return (
            <div
              key={q.QturnId}
              onClick={() => onSelectQuestion(q.QturnId)}
              className={`p-3 rounded-lg border transition cursor-pointer ${
                answerObj
                  ? "bg-green-100 border-green-300 hover:bg-green-200"
                  : "bg-red-100 border-red-300 hover:bg-red-200"
              }`}
            >
              <p className="font-semibold">{q.Question_section_title}</p>
              <p className="text-sm text-gray-700 mt-1">
                {answerObj?.answer || "No answer yet"}
              </p>
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="mt-5 flex justify-center gap-5">
          <button
            onClick={handleCancelSubmitBackend}
            className="w-28 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="w-28 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Complete
          </button>
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-600 mt-3 px-1">
        <span>Progress</span>
        <span>
          {answered} / {total} answered
        </span>
      </div>
    </div>
  );
};

export default ConsolidationSectionComp;
