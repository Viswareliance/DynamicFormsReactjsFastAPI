import React from "react";

const EmailField = ({
  label,
  name,
  placeholder,
  register,
  validationRules,
  errors,
  readOnly,
}) => {
  const rules = {};

  if (validationRules && !readOnly) {
    if (validationRules.required)
      rules.required = validationRules.errorMessage || "Email is required";

    rules.pattern = {
      value: /^\S+@\S+\.\S+$/,
      message: validationRules.errorMessage || "Enter a valid email",
    };
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>

      <input
        type="email"
        {...register(name, rules)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full p-2 border rounded ${
          readOnly ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />

      {errors[name] && !readOnly && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default EmailField;
