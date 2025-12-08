'use client';
import React, { useState } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { MilitaryPensionInput } from 'financial-calcs';
import { militaryPensionFieldConfigs, getMilitaryPensionProjectionColumns } from '@/configs/militaryPension';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
import PageContainer from "../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useMilitaryPensionProjection } from '@/hooks/useMilitaryPensionProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from "@/services/calculator-stats-service";
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";

import {
  Box,
  Grid,
  Button,
  Typography,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FormControlLabel, Switch } from "@mui/material";

const MilitaryPensionProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm<MilitaryPensionInput, { isAuthenticated: boolean }>(
    'militaryPensionForm',
    {
      startYear: new Date().getFullYear(),
      birthYear: 1990,
      serviceStartYear: 2010,
      serviceEndYear: 2030,
      high3Salary: 5000,
      colaPercent: 2,
      yearsToProject: 40,
      retirementType: 'brs',
    },
    militaryPensionFieldConfigs
  );

  const isAuthenticated = false;

  const {rows, error, generateTable } = useMilitaryPensionProjection(formValues);
  const [showChart, setShowChart] = useState(true);

  const handleCalculate = async () => {
    generateTable();

    if (!hasErrors) {
      // Fire and forget (non-blocking)
      CalculatorStatsService.incrementCalculationCount()
        .catch((err) => console.error("Failed to increment calc stats", err));
    }
  };
  
  return (
    <>
    <div id="formSection"></div>
    <PageContainer 
      title="Uniformed Service (Military) Pension Projection" 
      description="A uniformed service (military) pension calculator estimates your monthly annuity based on your years of service, high-36 average salary, and chosen retirement system (High-36 or Blended Retirement System)." 
      showTitle>
      <Typography variant="body1" sx={{mb:3}}>
        Calculate your Uniformed Service (Military) pension based on retirement system, years of service, high-36 salary.
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <FormFields
          fields={militaryPensionFieldConfigs}
          values={formValues}
          onChange={handleChange}
          context={{ isAuthenticated }}
          errors={errors}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showChart}
              onChange={(e) => setShowChart(e.target.checked)}
            />
          }
          label="Show Chart"
          sx={{ alignSelf: 'center', ml: 2 }}
        />
      </Grid>

      <Button
        variant="contained"
        startIcon={<TableViewIcon />}
        onClick={handleCalculate}
        disabled={hasErrors}
      >
        Calculate
      </Button>

      <Button
        variant="outlined"
        sx={{ ml: 2 }}
        startIcon={<FileDownloadIcon />}
        onClick={() => exportToCSV(rows, "military_pension_projection.csv")}
        disabled={rows.length === 0}
      >
        Export CSV
      </Button>

     {error && Array.isArray(error) && error.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <FormSummary type="error" message={error} />
        </Box>
      )}
      {showChart && rows.length > 0 && !error && (
        <>
          <div id="chartSection"></div>
          <MUIBarChart
            data={rows}
            dataKeys={[
              { key: "pension", label: "Annual Pension ($)" },
            ]}
            xKey="year" 
            title="Pension Over Time"
          />
        </>
      )}

      {rows.length > 0 && !error && (
        <>
        <div id="tableSection"></div>
        <ProjectionDataGrid
          rows={rows}
          highlightYear={new Date().getFullYear()}
          columns={getMilitaryPensionProjectionColumns(false)}
        />
        </>
      )}

      <Box sx={{ mt: 4 }}>
        <Assumptions
          title="Assumptions"
          items={[
            <>
              Calculator currently does not support REDUX or Disability retirement plan.
            </>,
            <>
              Calculator currently only supports service members retiring from Activity Duty.
            </>
          ]}
        />
      </Box>
      {rows.length > 0 && !error && (
      <SectionSpeedDial
        icon={<NavigationIcon />}  
        tooltip="Navigate To"   
        actions={[
          { id: "tableSection", label: "Table", icon: <TableChartIcon /> },
          { id: "chartSection", label: "Chart", icon: <BarChartIcon /> },
          { id: "formSection", label: "Form", icon: <ListIcon /> },
        ]}
      />
      )}
    </PageContainer>
    </>
  );
};

export default MilitaryPensionProjection;
