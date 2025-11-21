"use client";

import React, { useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useIncomeSources } from "@/lib/incomeSources/hook";
import { CircularProgress, Typography, ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ProjectionTable } from "@/app/(DashboardLayout)/components/shared/ProjectionTable";

export default function IncomeSummaryPage() {
  const { loading, getCombinedProjection, getCombinedChartRows, computedSources } =
    useIncomeSources();

  const [mode, setMode] = useState<"income" | "balance">("income");

  if (loading || !computedSources) {
    return (
      <PageContainer title="All Income Sources">
        <CircularProgress />
        <Typography>Loading…</Typography>
      </PageContainer>
    );
  }

  const chartRows = getCombinedChartRows();
  const tableRows = getCombinedProjection();

  // Income data keys (one per source)
  const dataKeys = computedSources.map((src) => ({
    key: src.id!,
    label: src.label,
  }));

  // For balance view (single series)
  const balanceSeries = [
    {
      id: "annualInvestmentBalance",
      label: "Investment Balance",
      data: chartRows.map((r) => r.annualInvestmentBalance ?? 0),
    },
  ];

  const tableColumns = [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "annualIncome", label: "Total Annual Income ($)", currency: true },
    { key: "annualInvestmentBalance", label: "Investment Balance ($)", currency: true },
  ];

  return (
    <PageContainer title="Retirement Income and Investment Over Time" showTitle>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ToggleButtonGroup
          exclusive
          value={mode}
          onChange={(e, v) => v && setMode(v)}
          size="small"
        >
          <ToggleButton value="income">Income</ToggleButton>
          <ToggleButton value="balance">Investment Balance</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {mode === "income" ? (
        <MUIBarChart
          data={chartRows}
          xKey="year"
          dataKeys={dataKeys}
          stacked
          title="Annual Income by Source"
        />
      ) : (
        <MUIBarChart
          data={chartRows}
          xKey="year"
          title="Total Investment Balance"
          overrideSeries={balanceSeries}
        />
      )}

      <ProjectionTable
        rows={tableRows}
        columns={tableColumns}
        highlightYear={new Date().getFullYear()}
      />
    </PageContainer>
  );
}
