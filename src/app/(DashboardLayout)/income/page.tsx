"use client";

import React, { useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useIncomeSources } from "@/lib/incomeSources/hook";
import { CircularProgress, Typography, ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ProjectionTable } from "@/app/(DashboardLayout)/components/shared/ProjectionTable";
import Loading from "@/app/loading";

export default function IncomeSummaryPage() {
  const { loading, getCombinedProjection, getCombinedChartRows, computedSources } =
    useIncomeSources();

  const [mode, setMode] = useState<"income" | "balance">("income");

  if (loading || !computedSources) {
    return (
      <PageContainer title="All Income Sources">
        <Loading/>
      </PageContainer>
    );
  }

  const chartRows = getCombinedChartRows();
  const tableRows = getCombinedProjection();

  const dataKeys =
    mode === "income"
      ? computedSources.map((src) => ({
          key: src.id!,          // row[src.id]
          label: src.label,
        }))
      : computedSources
          .filter((src) => src.type === "retirement-savings")
          .map((src) => ({
            key: `bal_${src.id}` as keyof (typeof chartRows)[number], // row["bal_x"]
            label: `${src.label} Balance`,
          }));

  // In balance mode, the chart should be stacked too
  const isStacked = true;

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
          size="small"
          value={mode}
          onChange={(e, v) => v && setMode(v)}
        >
          <ToggleButton value="income">Retirement Income</ToggleButton>
          <ToggleButton value="balance">Retirement Savings Balance</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <MUIBarChart
        data={chartRows}
        xKey="year"
        dataKeys={dataKeys}
        stacked={isStacked}
        title={
          mode === "income"
            ? "Annual Income by Source"
            : "Investment Balance by Account"
        }
      />

      {/* -----------------------
          TABLE
         ----------------------- */}
      <ProjectionTable
        rows={tableRows}
        columns={tableColumns}
        highlightYear={new Date().getFullYear()}
      />
    </PageContainer>
  );
}
