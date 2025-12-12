import React from "react";

const TextareaField = ({
  label,
  name,
  placeholder,
  register,
  validationRules,
  errors,
}) => {
  // Build validation object from JSON rules
  const rules = {};

  if (validationRules) {
    if (validationRules.required) {
      rules.required = validationRules.errorMessage || "This field is required";
    }
    if (validationRules.minLength) {
      rules.minLength = {
        value: validationRules.minLength,
        message:
          validationRules.errorMessage ||
          `Minimum ${validationRules.minLength} characters required`,
      };
    }
    if (validationRules.maxLength) {
      rules.maxLength = {
        value: validationRules.maxLength,
        message:
          validationRules.errorMessage ||
          `Maximum ${validationRules.maxLength} characters allowed`,
      };
    }
    if (validationRules.pattern) {
      rules.pattern = {
        value: new RegExp(validationRules.pattern),
        message: validationRules.errorMessage || "Invalid format",
      };
    }
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <textarea
        {...register(name, rules)}
        placeholder={placeholder}
        className="w-full p-2 border rounded"
      ></textarea>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default TextareaField;
