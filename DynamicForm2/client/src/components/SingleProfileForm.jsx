import React, { useEffect, useState } from "react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import axios from "axios";

import ImageWidget from "./ImageWidget";
import VideoWidget from "./VideoWidget";
import AudioWidget from "./AudioWidget";
import TwoColumnTemplate from "./TwoColumnTemplate";

import { useDispatch, useSelector } from "react-redux";
import { saveProfileData, saveField } from "../redux/profileSlice.js";

export default function SingleProfileForm() {
  const [selectedProfile, setSelectedProfile] = useState("");
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0); // ➜ used to reset form

  const dispatch = useDispatch();
  const submissions = useSelector((state) => state.profile.submissions);

  // -------------------------
  // Load form defaults from backend
  // -------------------------
  const loadForm = async (profileType) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/api/${profileType}-form`
      );

      setSchema(res.data.schema);

      setUiSchema({
        ...res.data.uiSchema,
        gender: { "ui:widget": "radio" }, // radio side-by-side
        courses: { "ui:widget": "checkboxes" }, // checkbox list side-by-side

        dob: { "ui:widget": "date" },
        message: { "ui:widget": "textarea" },
        image_url: { "ui:widget": "ImageWidget" },
        video_url: { "ui:widget": "VideoWidget" },
        audio_url: { "ui:widget": "AudioWidget" },
      });

      // Merge backend defaults + redux saved values
      setFormData({
        ...res.data.formData,
        ...(submissions[profileType] || {}),
      });

      setFormErrors({});
    } catch (e) {
      console.error("Error loading form:", e);
      alert("Unable to load form.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProfile) loadForm(selectedProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile]);

  // -------------------------
  // Save while typing
  // -------------------------
  const handleChange = (e) => {
    setFormData(e.formData);
    Object.entries(e.formData).forEach(([field, value]) => {
      dispatch(saveField({ formType: selectedProfile, field, value }));
    });
  };

  // -------------------------
  // Save on blur
  // -------------------------
  const handleBlur = (id, value) => {
    const field = id.replace("root_", "");
    if (formErrors[field]?.__errors?.length > 0) return;
    dispatch(saveField({ formType: selectedProfile, field, value }));
  };

  // -------------------------
  // Submit form
  // -------------------------
  const handleSubmit = async ({ formData }) => {
    try {
      // 1️⃣ Save final form data in Redux
      dispatch(saveProfileData({ formType: selectedProfile, data: formData }));

      // 2️⃣ Choose backend endpoint (submit & validate)
      const endpoint =
        selectedProfile === "student"
          ? "http://127.0.0.1:8001/api/student-receive"
          : "http://127.0.0.1:8001/api/receive";

      const res = await axios.post(endpoint, formData);

      // 3️⃣ Handle backend validation errors
      if (!res.data.success) {
        const errors = {};
        Object.keys(res.data.errors).forEach((field) => {
          errors[field] = { __errors: [res.data.errors[field]] };
        });
        setFormErrors(errors);
        alert("Please correct the errors.");
        return;
      }

      // 4️⃣ Success
      alert(res.data.message || "Form submitted successfully!");

      // // 5️⃣ Reset form UI
      // setFormErrors({});
      // setFormKey((prev) => prev + 1); // triggers form re-render

      // // 6️⃣ Reload defaults from backend
      // await loadForm(selectedProfile);
      const defaultRes = await axios.get(
        `http://127.0.0.1:8000/api/${selectedProfile}-form`
      );

      setFormData(defaultRes.data.formData); // set default values
      setFormErrors({});
      setFormKey((prev) => prev + 1); // full form reset
    } catch (err) {
      console.error("Submit error:", err);
      alert("Unexpected error occurred.");
    }
  };

  // -------------------------
  // Form container styling
  // -------------------------
  //   const containerStyle = {
  //     width: "400px",
  //     border: "1px solid #ccc",
  //     padding: "10px",
  //     backgroundColor: "#fff",
  //     boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  //     borderRadius: "8px",
  //     margin: "50px auto",
  //   };
  // style={containerStyle}
  return (
    <div className="p-4 max-w-xl mx-auto">
      <label style={{ fontWeight: "bold" }}>Select Profile Type:</label>

      <select
        className="form-control"
        value={selectedProfile}
        onChange={(e) => setSelectedProfile(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          margin: "10px 0",
          borderRadius: "6px",
        }}
      >
        <option value="">-- Choose Profile --</option>
        <option value="profile">Master Profile</option>
        <option value="student">Student Profile</option>
      </select>

      {loading && <p>Loading form...</p>}

      {!loading && schema && (
        <Form
          key={formKey}
          schema={schema}
          uiSchema={uiSchema}
          validator={validator}
          widgets={{ ImageWidget, VideoWidget, AudioWidget }}
          ObjectFieldTemplate={TwoColumnTemplate} // this is important
          formData={formData}
          extraErrors={formErrors}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
