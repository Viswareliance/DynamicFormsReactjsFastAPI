// src/MUIFieldTemplate.jsx
import React from "react";
import { Grid, FormControl, FormLabel, FormHelperText } from "@mui/material";

export default function MUIFieldTemplate(props) {
  const { label, required, description, errors, help, children } = props;

  return (
    <FormControl fullWidth style={{ marginBottom: "16px" }}>
      {label && (
        <FormLabel style={{ fontWeight: "600", marginBottom: "6px" }}>
          {label} {required ? "*" : ""}
        </FormLabel>
      )}

      {children}

      {description && <FormHelperText>{description}</FormHelperText>}
      {errors}
      {help}
    </FormControl>
  );
}
