// src/components/QuestionSectionComp.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, shallowEqual } from "react-redux";
// import { removeAnswer } from "../ReduxStore/reduxSlice.js";

// dynamic field imports (assume these components exist)
import TextField from "./fields/TextField";
import DynamicDateField from "./fields/DynamicDateField";
import SelectField from "./fields/SelectField";
import RadioField from "./fields/RadioField";
import CheckboxField from "./fields/CheckboxField";
import ImageField from "./fields/ImageField";
import VideoField from "./fields/VideoField";
import AudioField from "./fields/AudioField";
import TextareaField from "./fields/TextareaField";
import NumberField from "./fields/NumberField";
import EmailField from "./fields/EmailField";

const QuestionSectionComp = ({
  selectedCategory,
  questionData,
  loading,
  noMoreQuestions,
  handleNext,
  handlePrevious,
  onAnswerSubmit, // function passed from LayoutPage
  onRemoveAnswer,
}) => {
  const { register, handleSubmit, reset, trigger, formState } = useForm();
  const { errors } = formState;
  const [openSlide, setOpenSlide] = useState(false);

  // get saved answers for the selected category
  const savedAnswers = useSelector(
    (state) => state.answers.answers[selectedCategory] || [],
    shallowEqual
  );

  // Reset form value when questionData or savedAnswers change
  useEffect(() => {
    if (!questionData) return;

    const key = questionData.Question_section_title.replace(/\s+/g, "_");
    const existing = savedAnswers.find(
      (a) => a.qturnId === questionData.QturnId
    );
    reset({ [key]: existing ? existing.answer : "" });
  }, [questionData, savedAnswers, reset]);

  const renderField = (field) => {
    if (!field) return null;
    const common = {
      label: field.Question_description,
      name: field.Question_section_title.replace(/\s+/g, "_"),
      placeholder: field.placeholder,
      options: field.options || [],
      validationRules: field.validationRules || {},
      readOnly: field.readOnly || false,
      register,
      errors,
      trigger,
      onSubmit,
    };

    switch (field.fieldType) {
      case "text":
        return <TextField {...common} />;
      case "email":
        return <EmailField {...common} />;
      case "number":
        return <NumberField {...common} />;
      case "date":
        return <DynamicDateField {...common} />;
      case "textarea":
        return <TextareaField {...common} />;
      case "select":
        return <SelectField {...common} />;
      case "radio":
        return <RadioField {...common} />;
      case "checkbox":
        return <CheckboxField {...common} />;
      case "image":
        return <ImageField field={field} register={register} />;
      case "video":
        return <VideoField field={field} register={register} />;
      case "audio":
        return <AudioField field={field} register={register} />;
      default:
        return null;
    }
  };

  const onError = () => setOpenSlide(true);

  const onSubmit = (data) => {
    if (!questionData) return;

    const key = questionData.Question_section_title.replace(/\s+/g, "_");
    const finalAnswer = questionData.readOnly
      ? questionData.placeholder
      : data[key] || "";

    // Call parent handler (LayoutPage will dispatch to redux)
    if (onAnswerSubmit && typeof onAnswerSubmit === "function") {
      onAnswerSubmit(
        questionData.QturnId,
        questionData.Question_description,
        finalAnswer
      );
    }

    handleNext();
  };

  // const handleCancel = () => {
  //   // dispatch removeAnswer through parent pattern (we can also expose remove function prop)
  //   // For simplicity, emit a custom event on window that LayoutPage listens to OR
  //   // (easier) call an endpoint - but here we will just call a Redux action directly via window (not ideal).
  //   // Better approach: pass a onRemoveAnswer prop. But to keep minimal changes, leave this calling a custom event.

  //   // Option A (recommended): if parent passed a remove handler, call it (not implemented here).
  //   // For now reset local form only:
  //   if (questionData) {
  //     reset();
  //   }
  // };
  const handleCancel = () => {
    if (!questionData) return;

    const key = questionData.Question_section_title.replace(/\s+/g, "_");

    // clear UI value
    reset({ [key]: "" });

    // remove from Redux via parent handler
    if (onRemoveAnswer) {
      onRemoveAnswer(questionData.QturnId);
    }
  };

  return (
    <div className="bg-white h-full shadow-md rounded-xl p-6 flex flex-col relative overflow-hidden">
      <h2 className="font-semibold text-center text-lg text-gray-700">
        Question Section
      </h2>

      <div className="flex justify-between mb-2">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>

      <div className="mt-2 h-40 overflow-y-auto border p-3 rounded-lg">
        {loading && <p>Loading...</p>}

        {!loading && !questionData && noMoreQuestions && (
          <p className="text-red-500">No questions.</p>
        )}

        {!loading && questionData && (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit, onError)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault(); // 🔥 final solution
            }}
          >
            <h3 className="font-semibold text-gray-700">
              {questionData.Question_section_title}
            </h3>
            {renderField(questionData)}
          </form>
        )}
      </div>

      <div className="mt-3 flex gap-4 justify-center">
        <button
          onClick={handleCancel}
          className="w-24 bg-red-500 text-white px-1 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit(onSubmit, onError)}
          className="w-24 bg-green-600 text-white px-1 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Submit
        </button>
      </div>

      <div
        onClick={() => setOpenSlide(true)}
        className="bg-gray-50 mt-4 h-10 rounded-lg flex items-center justify-center text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-100"
      >
        Interaction Section
      </div>

      <div
        className={`absolute left-0 right-0 bottom-0 bg-white shadow-xl border-t rounded-t-xl transition-transform duration-300 ${
          openSlide ? "translate-y-0" : "translate-y-full"
        } overflow-y-auto`}
        style={{ height: "45%", width: "95%" }}
      >
        <button
          onClick={() => setOpenSlide(false)}
          className="absolute top-2 right-4 text-gray-600 text-xl font-bold hover:text-black"
        >
          ×
        </button>
        <div className="p-5 pt-10">
          <h3 className="text-lg font-semibold mb-3">Interaction Content</h3>
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
              {Object.entries(errors).map(([key, value]) => (
                <p key={key} className="text-red-600 text-sm">
                  {value.message || `${key} is invalid`}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionSectionComp;
