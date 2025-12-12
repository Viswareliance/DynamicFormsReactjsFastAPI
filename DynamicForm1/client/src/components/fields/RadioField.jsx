import React from "react";

const RadioField = ({
  label,
  name,
  options,
  register,
  validationRules,
  errors,
  placeholder,
}) => {
  const rules = {};
  if (validationRules?.required) {
    rules.required = validationRules.errorMessage || "This field is required";
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      {placeholder && <label className="block mb-1">{placeholder}</label>}

      {options.map((opt) => (
        <label key={opt.value} className="flex items-center space-x-2 mb-1">
          <input type="radio" value={opt.value} {...register(name, rules)} />
          <span>{opt.label}</span>
        </label>
      ))}

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default RadioField;
