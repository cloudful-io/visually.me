"use client";

import React, { useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useIncomeSources } from "@/lib/assets/useIncomeSources";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import IncomeSourceDetailedList from "../components/dashboard/IncomeSourceDetailedList";
import { ProjectionDataGrid } from "../components/shared/ProjectionDataGrid";
import Loading from "@/app/loading";
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../components/shared/SectionSpeedDial";
import { useTheme } from '@mui/material/styles';

export default function IncomeSummaryPage() {
  const { loading, getCombinedProjection, getCombinedChartRows, computedAssets: computedSources, save, remove, refresh } =
    useIncomeSources();
  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes({spouse: false});  
  const { data: spouseAttrs, exists: hasSpouse } = useUserAttributes({spouse: true});

  const [mode, setMode] = useState<"income" | "balance">("income");
  const theme = useTheme();

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
          .filter((src) => src.asset_type === "retirement-savings")
          .map((src) => ({
            key: `balance_${src.id}` as keyof (typeof chartRows)[number],
            label: `${src.label} Balance`,
          }));

  const retirementX =
    attrs?.birthYear !== undefined &&
    attrs?.targetRetirementAge !== undefined
      ? attrs.birthYear! + attrs.targetRetirementAge!
      : undefined;
      
  return (
    <>
      <div id="formSection"></div>
      <PageContainer title="Retirement Income and Investment" showTitle>
        <IncomeSourceDetailedList
            primaryUserAttributes={attrs || {}}
            spouseUserAttributes={spouseAttrs}
            hasSpouse={hasSpouse}
            sources={computedSources}
            loading={loading}
            save={save}
            remove={remove}
            refresh={refresh}
          />
        {computedSources.length > 0 && (
        <>
          <div id="chartSection"></div>
          <Box sx={{ my: 2, display: 'flex', justifyContent: { xs: "stretch", md: "flex-end" }, width: '100%' }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              sx={{
                width: { xs: "100%", md: "auto" },
              }}
              value={mode}
              onChange={(e, v) => v && setMode(v)}
            >
              <ToggleButton value="income" sx={{ flex: { xs: 1, md: "initial" } }}>Annual Retirement Income</ToggleButton>
              <ToggleButton value="balance" sx={{ flex: { xs: 1, md: "initial" } }}>Retirement Savings Balance</ToggleButton>
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
            enableRangeFilter
            retirementX={[
              {
                year: attrs?.birthYear! + attrs?.targetRetirementAge!,
                label: hasSpouse ? "Target Retirement\n(You)" : "Target Retirement",
                color: theme.palette.primary.main,
                position: "start"
              },
              hasSpouse && spouseAttrs
                ? {
                    year: spouseAttrs.birthYear! + spouseAttrs.targetRetirementAge!,
                    label: "Target Retirement\n(Spouse)",
                    color: theme.palette.secondary.main,
                    position: "middle"
                  }
                : undefined
            ].filter(Boolean) as { year: number; label: string; position: "start" | "middle" | "end"; color?: string }[]}
          />

          <div id="tableSection"></div>   
          <ProjectionDataGrid
            rows={tableRows}
            columns={[
              { key: "year", label: "Year" },
              { key: "age", label: "Age" },
              { key: "monthlyIncome", label: "Total Monthly Income ($)", currency: true, hiddenOnMobile: true },
              { key: "annualIncome", label: "Total Annual Income ($)", currency: true },
              { key: "annualInvestmentBalance", label: "Investment Balance ($)", currency: true },
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
