import React from "react";

const CheckboxField = ({
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
      rules.required =
        validationRules.errorMessage || "Please select at least one option";
    }
    if (validationRules.minLength) {
      rules.minLength = {
        value: validationRules.minLength,
        message:
          validationRules.errorMessage ||
          `Select at least ${validationRules.minLength} options`,
      };
    }
    if (validationRules.maxLength) {
      rules.maxLength = {
        value: validationRules.maxLength,
        message:
          validationRules.errorMessage ||
          `Select no more than ${validationRules.maxLength} options`,
      };
    }
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center space-x-2 mb-1">
          <input type="checkbox" value={opt.value} {...register(name, rules)} />
          <span>{opt.label}</span>
        </label>
      ))}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default CheckboxField;
