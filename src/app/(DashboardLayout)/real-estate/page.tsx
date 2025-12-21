"use client";

import React, { useState, useMemo } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useRealEstate } from "@/lib/realEstate/useRealEstate";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import RealEstateDetailedList from "../components/dashboard/RealEstateDetailedList";
import { ProjectionDataGrid } from "../components/shared/ProjectionDataGrid";
import Loading from "@/app/loading";
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../components/shared/SectionSpeedDial";

export default function RealEstateSummaryPage() {
  const { loading, getCombinedProjection, getCombinedChartRows, computedProperties, projectionTables, save, remove, refresh } =
    useRealEstate();
  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes();  

  type ChartMode = "income" | "net";
  const [mode, setMode] = useState<ChartMode>("net");

  const tableRows = getCombinedProjection();

  const incomeChartRows = useMemo(
    () =>
      tableRows.map((row) => ({
        year: row.year,
        annualIncome: row.annualIncome,
        annualExpense: (-1*row.annualExpense),
      })),
    [tableRows]
  );

  const netCashFlowChartRows = useMemo(
    () =>
      tableRows.map((row) => ({
        year: row.year,
        netCashFlow: row.annualIncome - row.annualExpense,
      })),
    [tableRows]
  );

  if (loading || !computedProperties) {
    return (
      <PageContainer title="All Real Estate Properties" showTitle>
        <Loading/>
      </PageContainer>
    );
  }

  console.log(projectionTables);
  return (
    <>
      <div id="formSection"></div>
      <PageContainer title="Real Estate Properties" showTitle>
        <RealEstateDetailedList
            userAttributes={attrs || {}}
            properties={computedProperties}
            projectionTables={projectionTables}
            loading={loading}
            save={save}
            remove={remove}
            refresh={refresh}
          />

        {computedProperties.length > 0 && (
          <>
            <div id="chartSection"></div>
            {/* ---- Chart Mode Toggle ---- */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={mode}
                onChange={(_, v) => v && setMode(v)}
              >
                <ToggleButton value="net">Net Cash Flow</ToggleButton>
                <ToggleButton value="income">Income and Expense</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {mode === "net" && (
              <MUIBarChart
                data={netCashFlowChartRows}
                xKey="year"
                dataKeys={[
                  { key: "netCashFlow", label: "Annual Net Cash Flow ($)" },
                ]}
                title="Annual Net Cash Flow"
                enableRangeFilter
              />
            )}

            {mode === "income" && (
              <MUIBarChart
                data={incomeChartRows}
                xKey="year"
                stacked
                dataKeys={[
                  { key: "annualIncome", label: "Annual Income ($)" },
                  { key: "annualExpense", label: "Annual Expense ($)" },
                ]}
                title="Income vs Expense"
                enableRangeFilter
              />
            )}

            <div id="tableSection"></div>   
            <ProjectionDataGrid
              rows={tableRows}
              columns={[
                { key: "year", label: "Year" },
                { key: "age", label: "Age" },
                { key: "monthlyIncome", label: "Total Monthly Income ($)", currency: true, hiddenOnMobile: true },
                { key: "annualIncome", label: "Total Annual Income ($)", currency: true },
                { key: "monthlyExpense", label: "Total Monthly Expense ($)", currency: true, hiddenOnMobile: true },
                { key: "annualExpense", label: "Total Annual Expense ($)", currency: true },
              ]}
              highlightYear={new Date().getFullYear()}
            />
            <SectionSpeedDial
              icon={<NavigationIcon />}  
              tooltip="Navigate To"   
              actions={[
                { id: "tableSection", label: "Table", icon: <TableChartIcon /> },
                { id: "chartSection", label: "Chart", icon: <BarChartIcon /> },
                { id: "formSection", label: "List", icon: <ListIcon /> },
              ]}
            />
          </>
        )}
      </PageContainer>
    </>
  );
}
