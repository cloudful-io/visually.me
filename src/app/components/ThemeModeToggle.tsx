"use client";

import { IconButton, Tooltip } from "@mui/material";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { LightMode, DarkMode } from "@mui/icons-material";

export default function ThemeModeToggle() {
  const { themeMode, toggleThemeMode } = useThemeMode();

  return (
    <Tooltip title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}>
      <IconButton color="primary" onClick={toggleThemeMode}>
        {themeMode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
}