"use client";

import React from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useIncomeSources } from "@/lib/incomeSources/hook";
import { CircularProgress, Typography } from "@mui/material";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ProjectionTable } from "@/app/(DashboardLayout)/components/shared/ProjectionTable";

export default function IncomeSummaryPage() {
  const { loading, getCombinedProjection, getCombinedChartRows, computedSources } =
    useIncomeSources();

  if (loading || !computedSources) {
    return (
      <PageContainer title="All Income Sources">
        <CircularProgress />
        <Typography>Loading…</Typography>
      </PageContainer>
    );
  }

  // Chart rows (flattened)
  const chartRows = getCombinedChartRows();

  // Table rows (not flattened)
  const tableRows = getCombinedProjection();

  // Chart data keys (one per source)
  const dataKeys = computedSources.map((src) => ({
    key: src.id!,
    label: src.label,
  }));

  const tableColumns = [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "annualIncome", label: "Total Annual Income ($)", currency: true },
    { key: "annualInvestmentBalance", label: "Investment Balance ($)", currency: true },
  ];

  return (
    <PageContainer title="Income Summary" showTitle>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Combined Income Over Time
      </Typography>

      <MUIBarChart
        data={chartRows}
        xKey="year"
        dataKeys={dataKeys}
        stacked
        title="Annual Income by Source"
      />

      <ProjectionTable
        rows={tableRows}
        columns={tableColumns}
        highlightYear={new Date().getFullYear()}
      />
    </PageContainer>
  );
}
