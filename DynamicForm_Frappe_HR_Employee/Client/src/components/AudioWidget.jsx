import React from "react";
import { TextField, Box, Typography } from "@mui/material";

export default function AudioWidget(props) {
  const { id, value, onChange, label } = props;
  return (
    <Box>
      {value ? (
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <audio
            src={value}
            controls
            style={{ width: "100%", maxWidth: 400 }}
          />
        </Box>
      ) : (
        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
          No audio URL
        </Typography>
      )}
      <TextField
        id={id}
        label={label || "Audio URL"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        size="small"
      />
    </Box>
  );
}
