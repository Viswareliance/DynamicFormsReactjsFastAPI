import React from "react";

const TextField = ({
  label,
  name,
  placeholder,
  register,
  fieldType,
  validationRules,
  errors,
  readOnly, // ADD THIS
}) => {
  const rules = {};

  if (validationRules && !readOnly) {
    // 🔥 validation applies only when NOT readOnly
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

      <input
        type={fieldType}
        {...register(name, rules)}
        placeholder={placeholder}
        readOnly={readOnly} // ⬅ FINAL STEP
        className={`w-full p-2 border rounded 
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />

      {errors[name] && !readOnly && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default TextField;
