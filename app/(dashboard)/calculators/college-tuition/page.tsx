'use client';
import React, { useState } from "react";
import { FormTitle } from "@/components/FormTitle";
import { FormFields } from '@/components/FormFields';
import { FormSummary } from "@/components/FormSummary";
import { collegeTuitionFieldConfigs } from '@/configs/collegeTuitionFields';
import { CollegeTuitionInput } from 'financial-calcs';
import { CollegeTuitionProjectionRow } from 'financial-calcs';
import { ProjectionTable } from '@/components/ProjectionTable';
import { MUIBarChart } from '@/components/MUIBarChart';

import Assumptions from '@/components/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useCollegeTuitionProjection } from '@/hooks/useCollegeTuitionProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';

import {
  Box,
  Grid,
  Button,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FormControlLabel, Switch } from "@mui/material";

const CollegeTuitionProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm<CollegeTuitionInput>(
    'collegeTuitionForm',
    {
      startYear: new Date().getFullYear(),
      birthYear: 1970,
      childBirthYear: 2010,
      childCollegeFirstYear: 2028,
      childCollegeLastYear: 2031,
      initialBalance: 20000,
      annualContribution: 10000,
      estimatedYield: 5,
      estimatedFirstYearTuition: 50000,
      estimatedInflationRate: 3,
      yearsToProject: 20,
    },
    collegeTuitionFieldConfigs
  );

  const {rows, generateTable } = useCollegeTuitionProjection(formValues);
  const [showChart, setShowChart] = useState(true);

  function getSummaryMessage(rows: CollegeTuitionProjectionRow[]): { type: 'success' | 'warning' | 'error', message: string } {
    // Find first year balance goes negative
    const deficitRow = rows.find(r => r.endingBalance == 0);
  
    if (!deficitRow) {
      // Never goes negative
      const last = rows[rows.length - 1];
      return {
        type: 'success',
        message: `You will not run out of money. After the last year of tuition, you will still have ${last.endingBalance.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}.`
      };
    } else {
      return {
        type: 'warning',
        message: `You will run out of money in year ${deficitRow.year}, with a shortfall of ${Math.abs(deficitRow.tuitionAmount-deficitRow.annualWithdraw).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}.`
      };
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <FormTitle title="College Savings and Tuition Projection"/>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        
      <FormFields
        fields={collegeTuitionFieldConfigs}
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
        startIcon={<TableViewIcon/>} 
        onClick={generateTable}
        disabled={hasErrors}
      >
        Calculate
      </Button>

      <Button 
        variant="outlined" sx={{ ml: 2 }} 
        startIcon={<FileDownloadIcon/>} 
        onClick={() => exportToCSV(rows, "college_projection.csv")}
        disabled={rows.length === 0}
      >
        Export CSV
      </Button>
      
      {rows.length > 0 && (() => {
        const summary = getSummaryMessage(rows); // from Step 2
        return (
          <FormSummary
            type={summary.type}
            message={summary.message}
          />
        );
      })()}
      {showChart && rows.length > 0 && (
        <MUIBarChart data={rows} dataKey="endingBalance" xKey="year" yLabel="End of Year Balance ($)" title="End of Year Balance Over Time" />
      )}
      {rows.length > 0 && (
        <ProjectionTable
          rows={rows}
          highlightYear={new Date().getFullYear()}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'age', label: 'Your Age' },
            { key: 'childAge', label: 'Child\'s Age' },
            { key: 'beginningBalance', label: 'Beginning Balance ($)', currency: true },
            { key: 'contribution', label: 'Contribution ($)', currency: true },
            { key: 'yieldPercent', label: 'Yield %' },
            { key: 'tuitionAmount', label: 'Tuition ($)', currency: true },
            { key: 'annualWithdraw', label: 'Annual Withdraw ($)', currency: true },
            { key: 'endingBalance', label: 'Ending Balance ($)', currency: true },
          ]}
        />
      )}
      <Box sx={{ mt: 4 }}>
        <Assumptions
          title="Assumptions"
          items={[
            <>
              This calculator assumes that contribution is made annually, and it simplies the calculation of annual yield by assume that the annual contribution is added to your account at the <strong>beginning of each year</strong>.  In reality, contribution may be added incrementally throughout a year.
            </>,
            <>
              This calculator assumes that contribution automatically stops at the end of the last year of college.
            </>,
            <>
              This calculator assumes that the balance will never go negative, meaning that the withdraw amount for tuition will never be larger than the available balance.  
            </>,
          ]}
        />
      </Box>
    </Box>
  );
};

export default CollegeTuitionProjection;