// src/LocationForm.jsx
import React, { useEffect, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import axios from "axios";
import RowObjectTemplate from "./RowObjectTemplate";

const LocationForm = () => {
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch schema from backend
  const fetchSchema = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/location-form"
      );
      const data = response.data;

      setSchema(data.schema);

      // Inject ObjectFieldTemplate
      const updatedUiSchema = {
        ...(data.uiSchema || {}),
        "ui:ObjectFieldTemplate": RowObjectTemplate,
      };
      setUiSchema(updatedUiSchema);

      setFormData(data.formData || {});
    } catch (error) {
      console.error("Failed to load schema:", error);
      alert("Failed to load form schema. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  // Handle form submission
  const handleSubmit = async ({ formData }) => {
    try {
      alert("Form submitted: " + JSON.stringify(formData, null, 2));
      console.log("Submitted Form Data:", formData);

      const response = await axios.post(
        "http://localhost:8000/api/location-submit",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Backend Response:", response.data);
      alert("Server Response: " + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Submit failed! Check console.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        validator={validator}
        ObjectFieldTemplate={RowObjectTemplate}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default LocationForm;
