"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { CalculatorStatsService } from "@/services/calculator-stats-service";

export default function CalculatorStatsCounter() {
  const theme = useTheme();

  const [total, setTotal] = useState<number | null>(null);
  const [animatedValue, setAnimatedValue] = useState(0);

  const NUM_CALCULATORS = 5; // hard-coded number of calculators

  /** Fetch total calculations */
  const fetchStats = async () => {
    try {
      const row = await CalculatorStatsService.getStats();
      setTotal(row?.calc_count ?? 0);
    } catch (err) {
      console.error("Failed to fetch calculator stats", err);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /** Animate total calculations counter */
  useEffect(() => {
    if (total === null) return;

    let start = 0;
    const end = total;
    const duration = 1000;
    const steps = 60;
    const increment = Math.ceil(end / steps);

    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setAnimatedValue(start);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [total]);

  /** Helper to render a number as digit tiles */
  const renderDigits = (value: number) => {
    const digits = value.toString().split("");
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        {digits.map((digit, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: 36, sm: 42, md: 48 },
              height: { xs: 50, sm: 60, md: 70 },
              borderRadius: 2,
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 3,
              transition: "all 0.2s",
              animation: "popIn 0.3s ease",
              "@keyframes popIn": {
                "0%": { transform: "scale(0.8)", opacity: 0 },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          >
            {digit}
          </Box>
        ))}
      </Box>
    );
  };

  if (total === null) {
    return (
      <Box
        sx={{
          mt: 6,
          p: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.grey[100],
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ opacity: 0.5 }}>
          Loading stats...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 6,
        p: 3,
        borderRadius: 3,
        backgroundColor: theme.palette.grey[100],
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        boxShadow: 4,
      }}
    >
      {/* Number of Calculators */}
      <Box
        sx={{
          textAlign: "center",
          flex: 1, // take equal horizontal space
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: theme.palette.text.secondary,
          }}
        >
          Available Calculators
        </Typography>
        {renderDigits(NUM_CALCULATORS)}
      </Box>

      {/* Total Calculations */}
      <Box
        sx={{
          textAlign: "center",
          flex: 1, // equal space
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: theme.palette.text.secondary,
          }}
        >
          Total Lifetime Projections
        </Typography>
        {renderDigits(animatedValue)}
      </Box>
    </Box>

  );
}
