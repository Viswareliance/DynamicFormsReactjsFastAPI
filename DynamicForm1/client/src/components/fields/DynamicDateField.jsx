import React from "react";

const DynamicDateField = ({
  label,
  name,
  placeholder,
  register,
  validationRules,
  errors,
}) => {
  const rules = {};

  if (validationRules) {
    if (validationRules.required) {
      rules.required = validationRules.errorMessage || "This field is required";
    }

    rules.validate = (value) => {
      if (!value) return true; // required handles empty

      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Only today
      if (validationRules.onlyToday) {
        if (selectedDate.getTime() !== today.getTime()) {
          return validationRules.errorMessage || "Date must be today";
        }
      }

      // Past or present
      if (validationRules.pastOrPresent) {
        if (selectedDate > today) {
          return validationRules.errorMessage || "Date cannot be in the future";
        }
      }

      // Minimum date
      if (validationRules.minDate) {
        const minDate = new Date(validationRules.minDate);
        if (selectedDate < minDate) {
          return (
            validationRules.errorMessage ||
            `Date cannot be before ${validationRules.minDate}`
          );
        }
      }

      return true;
    };
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type="date"
        {...register(name, rules)}
        placeholder={placeholder}
        className="w-full p-2 border rounded"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default DynamicDateField;
