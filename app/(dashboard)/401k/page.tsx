'use client';
import React, { useState } from "react";
import { FormFields } from '@/components/FormFields';
import {
  retirementFieldConfigs,
  RetirementFormValues,
} from '@/configs/retirementFields';
import { ProjectionChart } from '@/components/ProjectionChart';
import { ProjectionTable } from '@/components/ProjectionTable';
import Assumptions from '@/components/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useRetirementProjection } from '@/hooks/useRetirementProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';

import {
  Box,
  Grid,
  Button,
  Typography,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FormControlLabel, Switch } from "@mui/material";

const RetirementProjection = () => {

  const [formValues, setFormValues] = usePersistedForm<RetirementFormValues>(
    'retirementForm',
    {
      startYear: new Date().getFullYear(),
      birthYear: 1970,
      initialBalance: 200000,
      initialContribution: 23000,
      estimatedYield: 6,
      estimatedWithdrawRate: 5,
      contributionIncreaseRate: 2,
      withdrawStartAge: 60,
      yearsToProject: 40,
    }
  );

  const {rows, generateTable } = useRetirementProjection(formValues);
  const [showChart, setShowChart] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Retirement Savings and Withdrawal Projection
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        
      <FormFields
        fields={retirementFieldConfigs}
        values={formValues}
        onChange={handleChange}
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

      <Button variant="contained" startIcon={<TableViewIcon/>} onClick={generateTable}>
        Calculate
      </Button>

      <Button variant="outlined" sx={{ ml: 2 }} startIcon={<FileDownloadIcon/>} onClick={() => exportToCSV(rows, "retirement_projection.csv")}>
        Export CSV
      </Button>
      
      {showChart && rows.length > 0 && (
        <ProjectionChart data={rows} dataKey="endingBalance" title="End of Year Balance Over Time" />
      )}
      {rows.length > 0 && (
        <ProjectionTable
          rows={rows}
          highlightYear={new Date().getFullYear()}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'age', label: 'Age' },
            { key: 'beginningBalance', label: 'Beginning Balance ($)' },
            { key: 'contribution', label: 'Contribution ($)' },
            { key: 'yieldPercent', label: 'Yield %' },
            { key: 'withdrawRate', label: 'Withdraw %' },
            { key: 'monthlyWithdraw', label: 'Monthly Withdraw ($)' },
            { key: 'annualWithdraw', label: 'Annual Withdraw ($)' },
            { key: 'endingBalance', label: 'Ending Balance ($)' },
          ]}
        />
      )}
      <Box sx={{ mt: 4 }}>
        <Assumptions
          title="Assumptions"
          items={[
            <>
              Retirement Savings contribution increases at a fixed percentage rate over your lifetime. In reality, if you are contributing at the <a href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits" target="_blank" rel="noopener noreferrer">maximum limit</a> allowed by the Internal Revenue Service (IRS), the growth rate varies year-over-year. For instance, there was no change between 2020 and 2021 at $19,500; while it increased from $20,500 to $22,500 between 2022 and 2023.
            </>,
            <>
              Retirement Savings withdraw can be kept at a fixed percentage rate. In reality, the limiting factor is the <a href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds" target="_blank" rel="noopener noreferrer">Required Minimum Distribution (RMD)</a>, which requires you to withdraw a minimum percentage of your balance, starting at age 73. The exception is if your retirement savings is a Roth 401k or Roth IRA account.
            </>,
            <>
              This calculator simplifies the calculation of annual yield by assuming that the annual contribution is added to your account at the <strong>end of each year</strong>. In reality, contribution is likely deducted from your monthly or bi-weekly paycheck that will benefit from the annual yield / growth of the current year.
            </>,
          ]}
        />
      </Box>
    </Box>
  );
};

export default RetirementProjection;