import React from "react";
import { TextField, Box, Typography } from "@mui/material";

export default function ImageWidget(props) {
  const { id, value, onChange, label } = props;
  return (
    <Box>
      {value ? (
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <img
            alt="preview"
            src={value}
            style={{
              width: 150,
              height: 150,
              objectFit: "cover",
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}
          />
        </Box>
      ) : (
        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
          No image URL
        </Typography>
      )}
      <TextField
        id={id}
        label={label || "Image URL"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        size="small"
      />
    </Box>
  );
}
