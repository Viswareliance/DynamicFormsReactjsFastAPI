import React, { useState } from "react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import axios from "axios";

const initialSchema = {
  title: "Click a button to load form schema",
  type: "object",
  properties: {},
};

const profileOptions = [
  { label: "User", value: "user" },
  { label: "Manager", value: "manager" },
  { label: "Student", value: "student" },
  { label: "Employee", value: "employee" },
  { label: "Admin", value: "admin" },
];

function DynamicFormLoader() {
  const [schema, setSchema] = useState(initialSchema);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  // Load schema dynamically
  const loadSchema = async (profile) => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/${profile}-schema`
      );
      setSchema(response.data);
      setFormData({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Build dynamic uiSchema
  const buildUiSchema = () => {
    const uiSchema = {};
    if (!schema?.properties) return uiSchema;

    for (const key of Object.keys(schema.properties)) {
      const prop = schema.properties[key];

      // Arrays of enums -> checkboxes
      if (prop.enum || (prop.type === "array" && prop.items?.enum)) {
        uiSchema[key] = { "ui:widget": "checkboxes" };
      }

      // Boolean -> radio buttons
      if (prop.type === "boolean") {
        uiSchema[key] = { "ui:widget": "radio" };
      }

      // Admin message -> textarea
      if (key === "message") {
        uiSchema[key] = {
          "ui:widget": "textarea",
          "ui:placeholder": "Enter your message here",
        };
      }
    }

    // Student: show other_course input if "Other" selected
    if (formData.courses?.includes("Other")) {
      uiSchema.other_course = {
        "ui:placeholder": "Specify other course",
        "ui:emptyValue": "",
      };
    }

    return uiSchema;
  };

  // Custom validation
  const customValidate = (formData, errors) => {
    // Student: require at least one course
    if (formData.courses && formData.courses.length < 1) {
      errors.courses.addError("Please select at least one course");
    }

    // If "Other" selected, require other_course
    if (formData.courses?.includes("Other") && !formData.other_course) {
      errors.other_course.addError("Please specify the other course");
    }

    return errors;
  };

  // Submit handler
  const handleSubmit = ({ formData }) => {
    console.log("Form Submitted:", formData);
    alert("Form Submitted! Check console for details.");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* Profile selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Profile:</label>
        <select
          onChange={(e) => loadSchema(e.target.value)}
          className="px-3 py-1 border rounded"
          defaultValue=""
        >
          <option value="">-- Choose Profile --</option>
          {profileOptions.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading schema...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Form */}
      <div className="mt-2 p-2 bg-white rounded-xl shadow border">
        <Form
          schema={schema}
          uiSchema={buildUiSchema()}
          validator={validator}
          formData={formData}
          onChange={({ formData }) => setFormData(formData)}
          onSubmit={handleSubmit}
          customValidate={customValidate}
        />
      </div>
    </div>
  );
}

export default DynamicFormLoader;
