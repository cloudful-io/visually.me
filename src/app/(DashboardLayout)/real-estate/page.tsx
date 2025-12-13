"use client";

import React, { useState } from "react";
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
  const { loading, getCombinedProjection, getCombinedChartRows, computedProperties, save, remove, refresh } =
    useRealEstate();
  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes();  

  const [mode, setMode] = useState<"income" | "balance">("income");

  if (loading || !computedProperties) {
    return (
      <PageContainer title="All Real Estate Properties" showTitle>
        <Loading/>
      </PageContainer>
    );
  }

  const chartRows = getCombinedChartRows;
  const tableRows = getCombinedProjection();

  /*const dataKeys =
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
          }));*/

  return (
    <>
      <div id="formSection"></div>
      <PageContainer title="Real Estate Properties" showTitle>
        <RealEstateDetailedList
            userAttributes={attrs || {}}
            properties={computedProperties}
            loading={loading}
            save={save}
            remove={remove}
            refresh={refresh}
          />
        {/*<Box sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={mode}
            onChange={(e, v) => v && setMode(v)}
          >
            <ToggleButton value="income">Annual Retirement Income</ToggleButton>
            <ToggleButton value="balance">Retirement Savings Balance</ToggleButton>
          </ToggleButtonGroup>
        </Box>*/}

        <div id="chartSection"></div>
        {/*<MUIBarChart
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
        />*/}

        <div id="tableSection"></div>   
        {/*<ProjectionDataGrid
          rows={tableRows}
          columns={[
            { key: "year", label: "Year" },
            { key: "age", label: "Age" },
            { key: "monthlyIncome", label: "Total Monthly Income ($)", currency: true, hiddenOnMobile: true },
            { key: "annualIncome", label: "Total Annual Income ($)", currency: true },
            { key: "annualInvestmentBalance", label: "Investment Balance ($)", currency: true },
          ]}
          highlightYear={new Date().getFullYear()}
        />*/}
        <SectionSpeedDial
          icon={<NavigationIcon />}  
          tooltip="Navigate To"   
          actions={[
            { id: "tableSection", label: "Table", icon: <TableChartIcon /> },
            { id: "chartSection", label: "Chart", icon: <BarChartIcon /> },
            { id: "formSection", label: "List", icon: <ListIcon /> },
          ]}
        />
      </PageContainer>
    </>
  );
}
