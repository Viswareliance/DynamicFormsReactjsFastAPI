import React from "react";
import { TextField, Box, Typography } from "@mui/material";

export default function VideoWidget(props) {
  const { id, value, onChange, label } = props;
  return (
    <Box>
      {value ? (
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <video
            src={value}
            controls
            style={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}
          />
        </Box>
      ) : (
        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
          No video URL
        </Typography>
      )}
      <TextField
        id={id}
        label={label || "Video URL"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        size="small"
      />
    </Box>
  );
}
