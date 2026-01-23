"use client";

import { Box, LinearProgress, Tooltip, Typography, Stack } from "@mui/material";

interface Props {
  value: number;   
  label: string;   
}

export default function LinearProgressWithLabel({ value, label }: Props) {
  return (
    <Stack spacing={1}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <Tooltip title={label}>
            <LinearProgress
                variant="determinate"
                color="info"
                value={value}
                sx={{
                height: 8,
                borderRadius: 5,
                }}
            />
          </Tooltip>
        </Box>

        <Typography
          variant="body2"
          sx={{ width: "100%", textAlign: "left" }}
        >
          {label}
        </Typography>
      </Box>
    </Stack>
  );
}
