'use client';
import React, { useState } from 'react';
import { Box, Grid, Button, FormControlLabel, Switch } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { FormTitle } from "@/components/FormTitle";
import { FormFields } from '@/components/FormFields';
import { FormSummary } from "@/components/FormSummary";
import { MUIBarChart } from '@/components/MUIBarChart';
import { ProjectionTable } from '@/components/ProjectionTable';
import Assumptions from '@/components/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';

import { socialSecurityFieldConfigs } from '@/configs/socialSecurityBenefitsFields';
import { SocialSecurityBenefitInput } from 'financial-calcs';
import { useSocialSecurityBenefitProjection } from '@/hooks/useSocialSecurityBenefitProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';

const SocialSecurityProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm<SocialSecurityBenefitInput>(
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
  
  const {rows, error, generateTable } = useSocialSecurityBenefitProjection(formValues);
  const [showChart, setShowChart] = useState(true);

  return (
    <Box sx={{ p: 4 }}>
      <FormTitle title="Social Security Benefit Projection"/>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <FormFields
          fields={socialSecurityFieldConfigs}
          values={formValues}
          onChange={handleChange}
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
        onClick={generateTable}
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
          dataKey="annualBenefit"
          xKey="year"
          title="Annual Social Security Benefit Over Time"
          yLabel="Annual Social Security Benefit ($)"
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
    </Box>
  );
};

export default SocialSecurityProjection;
