"use client";

import React, { useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useIncomeSources } from "@/lib/incomeSources/useIncomeSources";
import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ProjectionDataGrid } from "../components/shared/ProjectionDataGrid";
import Loading from "@/app/loading";

export default function IncomeSummaryPage() {
  const { loading, getCombinedProjection, getCombinedChartRows, computedSources } =
    useIncomeSources();

  const [mode, setMode] = useState<"income" | "balance">("income");

  if (loading || !computedSources) {
    return (
      <PageContainer title="All Income / Investment Over Time" showTitle>
        <Loading/>
      </PageContainer>
    );
  }

  const chartRows = getCombinedChartRows;
  const tableRows = getCombinedProjection();

  const dataKeys =
    mode === "income"
      ? computedSources.map((src) => ({
          key: src.id!,          
          label: src.label,
        }))
      : computedSources
          .filter((src) => src.type === "retirement-savings")
          .map((src) => ({
            key: `balance_${src.id}` as keyof (typeof chartRows)[number],
            label: `${src.label} Balance`,
          }));

  return (
    <PageContainer title="Retirement Income and Investment" showTitle>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={mode}
          onChange={(e, v) => v && setMode(v)}
        >
          <ToggleButton value="income">Annual Retirement Income</ToggleButton>
          <ToggleButton value="balance">Retirement Savings Balance</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <MUIBarChart
        data={chartRows}
        xKey="year"
        dataKeys={dataKeys}
        stacked
        yLabel={
          mode === "income"
            ? "Annual Income"
            : "Total Investment Balance"
        }
        title={
          mode === "income"
            ? "Annual Income by Source"
            : "Investment Balance by Account"
        }
      />
        
      <ProjectionDataGrid
        rows={tableRows}
        columns={[
          { key: "year", label: "Year" },
          { key: "age", label: "Age" },
          { key: "monthlyIncome", label: "Total Monthly Income ($)", currency: true },
          { key: "annualIncome", label: "Total Annual Income ($)", currency: true },
          { key: "annualInvestmentBalance", label: "Investment Balance ($)", currency: true },
        ]}
        highlightYear={new Date().getFullYear()}
      />
    </PageContainer>
  );
}
