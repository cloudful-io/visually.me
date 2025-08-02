'use client';
import React, { useState } from 'react';
import { Box, Grid, Button, Typography, FormControlLabel, Switch } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { FormFields } from '@/components/FormFields';
import { ProjectionChart } from '@/components/ProjectionChart';
import { ProjectionTable } from '@/components/ProjectionTable';
import Assumptions from '@/components/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';

import {
  SocialSecurityBenefitsFormValues,
  socialSecurityFieldConfigs,
} from '@/configs/socialSecurityBenefitsFields';
import { useSocialSecurityBenefitsProjection } from '@/hooks/useSocialSecurityBenefitsProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';

const SocialSecurityProjection = () => {
  const [formValues, setFormValues] = usePersistedForm<SocialSecurityBenefitsFormValues>(
    'socialSecurityForm',
    {
      startYear: new Date().getFullYear(),
      birthYear: 1970,
      claimingAge: 67,
      averageIncome: 100000,
      averageCOLA: 2.5,
      yearsToProject: 45,
    }
  );

  const {rows, generateTable } = useSocialSecurityBenefitsProjection(formValues);
  const [showChart, setShowChart] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof SocialSecurityBenefitsFormValues, string>>>({});
  const hasErrors = Object.values(errors).some((e) => e);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);

    setFormValues((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Validate against min/max
    const fieldConfig = socialSecurityFieldConfigs.find((f) => String(f.name) === name);
    if (fieldConfig) {
      const { min, max, label } = fieldConfig;
      let error = '';

      if (!isNaN(parsedValue)) {
        if (typeof min === 'number' && parsedValue < min) {
          error = `${label} must be ≥ ${min}`;
        } else if (typeof max === 'number' && parsedValue > max) {
          error = `${label} must be ≤ ${max}`;
        }
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Social Security Benefit Projection
      </Typography>

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
      >
        Export CSV
      </Button>

      {showChart && rows.length > 0 && (
        <ProjectionChart
          data={rows}
          dataKey="annualBenefit"
          title="Annual Social Security Benefit Over Time"
        />
      )}

      {rows.length > 0 && (
        <ProjectionTable
          rows={rows}
          highlightYear={new Date().getFullYear()}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'age', label: 'Age' },
            { key: 'monthlyBenefit', label: 'Monthly Benefit ($)' },
            { key: 'annualBenefit', label: 'Annual Benefit ($)' },
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
