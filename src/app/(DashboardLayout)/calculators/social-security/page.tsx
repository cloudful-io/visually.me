'use client';
import React, { useState } from 'react';
import { Box, Grid, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionTable } from '@/app/(DashboardLayout)/components/shared/ProjectionTable';
import { ProjectionDataGrid } from '../../components/shared/ProjectionDataGrid';
import PageContainer from '../../components/container/PageContainer';
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { socialSecurityFieldConfigs } from '@/configs/socialSecurityBenefitsFields';
import { SocialSecurityBenefitInput } from 'financial-calcs';
import { useSocialSecurityBenefitProjection } from '@/hooks/useSocialSecurityBenefitProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from '@/services/calculator-stats-service';
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";

const SocialSecurityProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm<SocialSecurityBenefitInput, { isAuthenticated: boolean }>(
    'socialSecurityForm',
    {
      startYear: new Date().getFullYear(),
      birthYear: 1970,
      claimingAge: 67,
      averageIncome: 100000,
      averageCOLA: 2.5,
      yearsToProject: 45,
    },
    socialSecurityFieldConfigs
  );
  
  const isAuthenticated = false;

  const {rows, error, generateTable } = useSocialSecurityBenefitProjection(formValues);
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
      title="Social Security Benefit Projection" 
      description="A Social Security calculator estimates your future monthly benefits based on your earnings history, retirement age, and eligibility under the Social Security program." 
      showTitle>
      <div id="formSection"></div>
      <Typography variant="body1" sx={{mb:3}}>
        Estimate your Social Security monthly benefits based on earnings, retirement age, and Cost-of-Living Adjustment (COLA).
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <FormFields
          fields={socialSecurityFieldConfigs}
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
        onClick={() => exportToCSV(rows, 'social_security_projection.csv')}
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
              { key: "annualBenefit", label: "Annual Social Security Benefit ($)" },
            ]}
            xKey="year"
            title="Annual Social Security Benefit Over Time"
          />
        </>
      )}

      {rows.length > 0 && !error && (
         <>
          <div id="tableSection"></div>
          <ProjectionDataGrid
            rows={rows}
            highlightYear={new Date().getFullYear()}
            columns={[
              { key: "year", label: "Year", editable: false },
              { key: "age", label: "Age", editable: false },
              { key: "colaApplied", label: "COLA Applied (%)", description: "Cost of Living Adjustment (%)" },
              { key: "monthlyBenefit", label: "Monthly Benefit ($)", description: "Monthly Social Security Benefit ($)", currency: true },
              { key: "annualBenefit", label: "Annual Benefit ($)", description: "Annual Social Security Benefit ($)", currency: true },
            ]}
          />
        </>
      )}

      <Box sx={{ mt: 4 }}>
        <Assumptions
          title="Assumptions"
          items={[
            <>
              This calculator uses a simplified formula to estimate Social Security benefits. It assumes a linear relationship between income and the Primary Insurance Amount (PIA), and uses your claiming age to adjust the benefit according to Social Security Administration (SSA) rules.
            </>,
            <>
              The annual benefit increases each year after claiming based on your specified Cost-of-Living Adjustment (COLA), which averages around 2.6% historically but is not guaranteed.
            </>,
            <>
              This tool assumes you begin collecting benefits at a fixed age and continue receiving them annually for the number of years you specify. It does not account for taxes, spousal benefits, or income-related reductions.
            </>,
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

export default SocialSecurityProjection;
