"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { CalculatorStatsService } from "@/services/calculator-stats-service";
import Loading from "@/app/loading";

export default function CalculatorStatsCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const stats = await CalculatorStatsService.getStats();
        setCount(stats?.calc_count ?? 0);
      } catch (err) {
        console.error("Failed to load calculator stats", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (count === null) {
    return (
      <Typography
        variant="body2"
        color="error"
        sx={{ opacity: 0.8 }}
      >
        Unable to load stats
      </Typography>
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{
        color: "text.secondary",
        opacity: 0.85,
        fontSize: { xs: "0.9rem", sm: "1rem" },
      }}
    >
      🔥 {count.toLocaleString()} calculations performed so far
    </Typography>
  );
}
