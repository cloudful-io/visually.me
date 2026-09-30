"use client";

import React, { useState, useMemo } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useRealEstate } from "@/lib/assets/useRealEstate";
import { useCollegeSavings } from "@/lib/assets/useCollegeSavings";
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
import { useTheme } from '@mui/material/styles';
import { useIncludeSpouse } from "@/contexts/IncludeSpouseContext";

export default function CollegeSavingsSummaryPage() {
  const { includeSpouse } = useIncludeSpouse();
  const { loading, getCombinedProjection, getCombinedChartRows, computedAssets: computedCollegeSavings, projectionTables, save, remove, refresh } =
    useCollegeSavings({ joint: includeSpouse });
  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes({ spouse: false });
  const { data: spouseAttrs, exists: hasSpouse } = useUserAttributes({ spouse: true });

  if (loading || !computedCollegeSavings) {
    return (
      <PageContainer title="All College Savings Accounts" showTitle>
        <Loading />
      </PageContainer>
    );
  }

  const retirementX =
    attrs?.birthYear !== undefined &&
      attrs?.targetRetirementAge !== undefined
      ? attrs.birthYear! + attrs.targetRetirementAge!
      : undefined;

  return (
    <>
      <div id="formSection"></div>
      <PageContainer title="All College Savings Accounts" showTitle>
        <RealEstateDetailedList
          primaryUserAttributes={attrs || {}}
          spouseUserAttributes={spouseAttrs}
          hasSpouse={hasSpouse}
          properties={computedProperties}
          projectionTables={projectionTables}
          loading={loading}
          save={save}
          remove={remove}
          refresh={refresh}
        />
      </PageContainer>
    </>
  );
}
