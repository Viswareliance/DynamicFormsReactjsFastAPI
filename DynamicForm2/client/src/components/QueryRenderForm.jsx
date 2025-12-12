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

const QueryRenderForm = () => {
  const [profileInput, setProfileInput] = useState(""); // NEW
  const [selectedProfile, setSelectedProfile] = useState("");
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const dispatch = useDispatch();
  const submissions = useSelector((state) => state.profile.submissions);

  const loadForm = async (profileType) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://127.0.0.1:8000/api/${profileType}-form`
      );

      setSchema(res.data.schema);

      setUiSchema({
        ...res.data.uiSchema,
        gender: { "ui:widget": "radio" },
        employee_type: { "ui:widget": "checkboxes" },
        dob: { "ui:widget": "date" },
        message: { "ui:widget": "textarea" },
        image_url: { "ui:widget": "ImageWidget" },
        video_url: { "ui:widget": "VideoWidget" },
        audio_url: { "ui:widget": "AudioWidget" },
      });

      setFormData({
        ...res.data.formData,
        ...(submissions[profileType] || {}),
      });

      setFormErrors({});
    } catch (e) {
      console.error("Error loading form:", e);
      alert(
        "Form not found! Try leaveapplication or employee or jobapplication"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProfile) loadForm(selectedProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile]);

  const getFormFromQuery = (text) => {
    const q = text.toLowerCase();

    // Check leave
    if (q.includes("leave") || q.includes("sick") || q.includes("vacation")) {
      return "leaveapplication";
    }

    //  job
    if (q.includes("job") || q.includes("apply") || q.includes("application")) {
      return "jobapplication";
    }

    //  Employee profile
    if (q.includes("employee") || q.includes("profile")) {
      return "employee";
    }

    return ""; // no match
  };

  const handleGetProfile = () => {
    if (!profileInput.trim()) return alert("Enter a query");

    const result = getFormFromQuery(profileInput);
    if (!result) {
      alert("Could not detect form. Try typing: job / leave / employee");
      return;
    }

    setSelectedProfile(result);
    loadForm(result);
  };

  // Save while typing

  const handleChange = (e) => {
    setFormData(e.formData);
    Object.entries(e.formData).forEach(([field, value]) => {
      dispatch(saveField({ formType: selectedProfile, field, value }));
    });
  };

  // Save on blur

  const handleBlur = (id, value) => {
    const field = id.replace("root_", "");
    if (formErrors[field]?.__errors?.length > 0) return;
    dispatch(saveField({ formType: selectedProfile, field, value }));
  };

  // Submit form

  const handleSubmit = async ({ formData }) => {
    try {
      //  Save final form data in Redux
      dispatch(saveProfileData({ formType: selectedProfile, data: formData }));

      // --- Correct Dynamic endpoint logic ---
      let endpoint = "";

      if (selectedProfile === "leaveapplication") {
        endpoint = "http://127.0.0.1:8001/api/leaveapplication-receive";
      } else if (selectedProfile === "employee") {
        endpoint = "http://127.0.0.1:8001/api/employee-receive";
      } else {
        endpoint = "http://127.0.0.1:8001/api/jobapplication-receive";
      }

      const res = await axios.post(endpoint, formData);

      //  Handle backend validation errors
      if (!res.data.success) {
        const errors = {};
        Object.keys(res.data.errors).forEach((field) => {
          errors[field] = { __errors: [res.data.errors[field]] };
        });
        setFormErrors(errors);
        alert("Please correct the errors.");
        return;
      }

      //  Success
      alert(res.data.message || "Form submitted successfully!");

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
  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="mb-6">
        <label className="font-semibold text-gray-700">Type Your Query :</label>

        <input
          type="text"
          value={profileInput}
          onChange={(e) => setProfileInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleGetProfile();
          }}
          placeholder="Enter leaveapplication or employee or jobapplication"
          className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <button
          onClick={handleGetProfile}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Get Form
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading form...</p>}

      {!loading && schema && (
        <Form
          key={formKey}
          schema={schema}
          uiSchema={uiSchema}
          validator={validator}
          widgets={{ ImageWidget, VideoWidget, AudioWidget }}
          ObjectFieldTemplate={TwoColumnTemplate}
          formData={formData}
          extraErrors={formErrors}
          onChange={handleChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default QueryRenderForm;
