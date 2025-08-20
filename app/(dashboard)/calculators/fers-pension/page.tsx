'use client';
import React, { useState } from "react";
import { FormTitle } from "@/components/FormTitle";
import { FormFields } from '@/components/FormFields';
import { FersPensionInput } from 'financial-calcs';
import { fersPensionFieldConfigs } from '@/configs/fersPensionFields';
import { MUIBarChart } from '@/components/MUIBarChart';
import { ProjectionTable } from '@/components/ProjectionTable';

import Assumptions from '@/components/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useFersPensionProjection } from '@/hooks/useFersPensionProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';

import {
  Box,
  Grid,
  Button,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FormControlLabel, Switch } from "@mui/material";

const FersPensionProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
    //setValues,
  } = usePersistedForm<FersPensionInput>(
    'fersPensionForm',
    {
      startYear: new Date().getFullYear(),
      birthYear: 1970,
      serviceStartYear: 1990,
      retirementAge: 62,
      currentSalary: 85000,
      salaryGrowthRate: 3,
      colaPercent: 2,
      pensionMultiplier: 1.1,
      yearsToProject: 40,
      retirementType: 'regular',
    },
    fersPensionFieldConfigs
  );

  const {rows, generateTable } = useFersPensionProjection(formValues);
  const [showChart, setShowChart] = useState(true);

  return (
    <Box sx={{ p: 4 }}>
      <FormTitle title="Federal Employee Retirement System (FERS) Pension Projection"/>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <FormFields
          fields={fersPensionFieldConfigs}
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
          sx={{ alignSelf: 'center', ml: 2 }}
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
        onClick={() => exportToCSV(rows, "fers_pension_projection.csv")}
        disabled={rows.length === 0}
      >
        Export CSV
      </Button>

      {showChart && rows.length > 0 && (
        <MUIBarChart
          data={rows}
          dataKey="pension"
          xKey="year" 
          title="FERS Pension Over Time"
          yLabel="FERS Pension ($)"
        />
      )}

      {rows.length > 0 && (
        <ProjectionTable
          rows={rows}
          highlightYear={new Date().getFullYear()}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'age', label: 'Age' },
            { key: 'salary', label: 'Salary ($)', currency: true },
            { key: 'salaryGrowthRate', label: 'Salary Growth Rate (%)' },
            { key: 'colaApplied', label: 'COLA Applied (%)' },
            { key: 'pension', label: 'Annual Pension ($)', currency: true },
            { key: 'monthlyPension', label: 'Monthly Pension ($)', currency: true },
            
          ]}
        />
      )}

      <Box sx={{ mt: 4 }}>
        <Assumptions
          title="Assumptions"
          items={[
            <>
              Salary grows annually by a fixed percentage until retirement. The average of your highest 3 years of salary before retirement is used to calculate your pension.
            </>,
            <>
              Pension multiplier is typically 1% or 1.1% based on your age and service years.
            </>,
            <>
              Cost-of-Living Adjustments (COLA) start applying after age 62, increasing your pension annually by the estimated COLA percentage.
            </>,
            <>
              This calculator assumes a simplified model for illustrative purposes. Actual FERS pension calculations may include additional factors like retirement type and survivor benefits.
            </>,
          ]}
        />
      </Box>
    </Box>
  );
};

export default FersPensionProjection;
