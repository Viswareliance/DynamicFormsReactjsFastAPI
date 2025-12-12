import React from "react";

const NumberField = ({
  label,
  name,
  placeholder,
  register,
  validationRules,
  errors,
  readOnly,
  trigger, // for validation
  handleSubmit, // 🌟 pass react-hook-form handleSubmit
  onSubmit, // 🌟 your submit function
  // getValues,       // 🌟 to read the current field value
}) => {
  const rules = {};

  if (validationRules && !readOnly) {
    if (validationRules.required)
      rules.required = validationRules.errorMessage || "This field is required";

    if (validationRules.min)
      rules.min = {
        value: validationRules.min,
        message: `Minimum value is ${validationRules.min}`,
      };

    if (validationRules.max)
      rules.max = {
        value: validationRules.max,
        message: `Maximum value is ${validationRules.max}`,
      };
  }

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // ❌ stop the auto-submit

      const isValid = await trigger(name); // validate only this field

      if (isValid) {
        // ⭐ If valid → submit manually
        handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>

      <input
        type="number"
        {...register(name, rules)}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={() => trigger(name)}
        onKeyDown={handleKeyDown}
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

export default NumberField;
