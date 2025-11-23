'use client';
import React, { useState } from 'react';
import { Box, Grid, Button, FormControlLabel, Switch } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionTable } from '@/app/(DashboardLayout)/components/shared/ProjectionTable';
import PageContainer from '../../components/container/PageContainer';
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';

import { socialSecurityFieldConfigs } from '@/configs/socialSecurityBenefitsFields';
import { SocialSecurityBenefitInput } from 'financial-calcs';
import { useSocialSecurityBenefitProjection } from '@/hooks/useSocialSecurityBenefitProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from '@/services/calculator-stats-service';

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
    <PageContainer 
      title="Social Security Benefit Projection" 
      description="A Social Security calculator estimates your future monthly benefits based on your earnings history, retirement age, and eligibility under the Social Security program." 
      showTitle>

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

      {(error) && (() => {
        return (
          <FormSummary
            type='error'
            message={error!.message}
          />
        );
      })()}

      {showChart && rows.length > 0 && !error && (
        <MUIBarChart
          data={rows}
          dataKeys={[
            { key: "annualBenefit", label: "Annual Social Security Benefit ($)" },
          ]}
          xKey="year"
          title="Annual Social Security Benefit Over Time"
        />
      )}

      {rows.length > 0 && !error && (
        <ProjectionTable
          rows={rows}
          highlightYear={new Date().getFullYear()}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'age', label: 'Age' },
            { key: 'colaApplied', label: 'COLA Applied (%)' },
            { key: 'monthlyBenefit', label: 'Monthly Benefit ($)', currency: true },
            { key: 'annualBenefit', label: 'Annual Benefit ($)', currency: true },
          ]}
        />
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
    </PageContainer>
  );
};

export default SocialSecurityProjection;
