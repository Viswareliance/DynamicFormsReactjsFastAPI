import React from "react";

const SelectField = ({
  label,
  name,
  options,
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
          `Minimum ${validationRules.minLength} items required`,
      };
    }
    if (validationRules.maxLength) {
      rules.maxLength = {
        value: validationRules.maxLength,
        message:
          validationRules.errorMessage ||
          `Maximum ${validationRules.maxLength} items allowed`,
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
      <select {...register(name, rules)} className="w-full p-2 border rounded">
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default SelectField;
