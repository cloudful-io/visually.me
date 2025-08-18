'use client';
import React, { useState } from "react";
import { FormFields } from '@/components/FormFields';
import { ProjectionTable } from '@/components/ProjectionTable';
import { MUIBarChart } from '@/components/MUIBarChart';

import Assumptions from '@/components/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useMortgageAmortization } from '@/hooks/useMortgageAmortization';
import { usePersistedForm } from '@/hooks/usePersistedForm';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  Box,
  Grid,
  Button,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { mortgageAmortizationFieldConfigs, MortgageFormValues } from '@/configs/mortgageAmortizationFields';

const MortgageProjection = () => {
  const [formValues, setFormValues] = usePersistedForm<MortgageFormValues>(
    'mortgageForm',
    {
      loanAmount: 300000,
      annualRate: 6,
      termYears: 30,
      extraPayment: 0,
      startDate: new Date(),
    }
  );

  const {rows, yearlyRows, generateTable } = useMortgageAmortization(formValues);
  const [displayBy, setDisplayBy] = useState<'month' | 'year'>('month');
  const [showChart, setShowChart] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof MortgageFormValues, string>>>({});
  const hasErrors = Object.values(errors).some((e) => e);

  const tableRows =
    displayBy === 'year'
      ? yearlyRows
      : rows;

  type YearlyBalanceRow = {
    year: number;     // X-axis
    balance: number;  // Y-axis
  };
  const chartData: YearlyBalanceRow[] = rows
    .filter((row) => row.month % 12 === 0) // yearly snapshot
    .map((row, index) => ({
      year: row.month / 12,
      balance: row.balance,
    }));
      
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: any = value;

    if (type === 'number') {
      parsedValue = value === '' ? '' : parseFloat(value);
    } else if (type === 'date') {
      parsedValue = value ? new Date(value) : undefined;
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Validate against min/max
    const fieldConfig = mortgageAmortizationFieldConfigs.find((f) => String(f.name) === name);
    if (fieldConfig) {
      const { min, max, label } = fieldConfig;
      let error = '';

      if (typeof parsedValue === 'number' && !isNaN(parsedValue)) {
        if (typeof min === 'number' && parsedValue < min) {
          error = `${label} must be ≥ ${min}`;
        } else if (typeof max === 'number' && parsedValue > max) {
          error = `${label} must be ≤ ${max}`;
        }
      } else if (parsedValue === '' || parsedValue === undefined) {
        error = `${label} is required`;
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
        Mortgage Amortization Calculator
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormFields
            fields={mortgageAmortizationFieldConfigs}
            values={formValues}
            onChange={handleChange}
            onDateChange={(name, value) =>
              setFormValues((prev) => ({ ...prev, [name]: value || undefined }))
            }
            errors={errors}
          />
        </LocalizationProvider>
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
        <FormControlLabel
          control={
            <Switch
              checked={displayBy === 'year'}
              onChange={(e) => setDisplayBy(e.target.checked ? 'year' : 'month')}
            />
          }
          label="Display Table by Year"
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
        onClick={() => exportToCSV(tableRows, "mortgage_amortization.csv")}
        disabled={rows.length === 0}
      >
        Export CSV
      </Button>

      {showChart && rows.length > 0 && (
        <MUIBarChart<YearlyBalanceRow>
          data={chartData}
          dataKey="balance"
          xKey="year"
          title="Remaining Mortgage Balance Over Time"
          yLabel="Balance ($)"
        />
      )}

      {rows.length > 0 && (
        <ProjectionTable
          rows={tableRows}
          highlightYear={new Date().getFullYear()}
          columns={
            displayBy === 'year'
              ? [
                  { key: 'year', label: 'Year' },
                  { key: 'date', label: 'Date' },
                  { key: 'payment', label: 'Payment ($)', currency: true },
                  { key: 'principal', label: 'Principal ($)', currency: true },
                  { key: 'interest', label: 'Interest ($)', currency: true },
                  { key: 'balance', label: 'Remaining Balance ($)', currency: true },
                ]
              : [
                  { key: 'month', label: 'Month' },
                  { key: 'date', label: 'Date' },
                  { key: 'payment', label: 'Payment ($)', currency: true },
                  { key: 'principal', label: 'Principal ($)', currency: true },
                  { key: 'interest', label: 'Interest ($)', currency: true },
                  { key: 'balance', label: 'Remaining Balance ($)', currency: true },
                ]
          }
        />
      )}

      <Box sx={{ mt: 4 }}>
        <Assumptions
          title="Assumptions"
          items={[
            <>
              Mortgage has a fixed interest rate that never changes during the life of the loan.  
            </>,
            <>
              Monthly principal and interest payments remain constant throughout the term.
            </>,
            <>
              Amortization chart and table does not include property taxes, homeowners insurance, Homeowner Association (HOA) fees, or Private Mortgage Insurance (PMI) in the payment calculation.
            </>,
            <>
              Any extra payments are applied directly to the loan principal without penalties or restrictions.
            </>,
            <>
              Loan begins immediately and the first payment occurs one month after the start date.
            </>,
          ]}
        />
      </Box>
    </Box>
  );
};

export default MortgageProjection;
