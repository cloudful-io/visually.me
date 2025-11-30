'use client';
import React, { useState } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { ProjectionTable } from '@/app/(DashboardLayout)/components/shared/ProjectionTable';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import PageContainer from "../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useMortgageAmortization } from '@/hooks/useMortgageAmortization';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalculatorStatsService } from "@/services/calculator-stats-service";
import { Box, Grid, Button, FormControlLabel, Switch, Typography } from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { MortgageAmortizationInput } from 'financial-calcs';
import { mortgageAmortizationFieldConfigs } from '@/configs/mortgageAmortizationFields';
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";

const MortgageProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
    setValues,
  } = usePersistedForm<MortgageAmortizationInput, { isAuthenticated: boolean }>(
    'mortgageForm',
    {
      loanAmount: 300000,
      annualRate: 6,
      termYears: 30,
      extraPayment: 0,
      startDate: new Date(),
    },
    mortgageAmortizationFieldConfigs
  );
  
  const isAuthenticated = false;

  const {rows, yearlyRows, error, generateTable } = useMortgageAmortization(formValues);
  const [displayBy, setDisplayBy] = useState<'month' | 'year'>('month');
  const [showChart, setShowChart] = useState(true);
  
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
      title="Mortgage Amortization Calculator" 
      description="A mortgage amortization calculator helps you estimate your monthly loan payments and see how each payment is divided between principal and interest over the life of the mortgage." 
      showTitle>
      <div id="formSection"></div>
      <Typography variant="body1" sx={{mb:3}}>
        Determine how your loan payments are split between principal and interest over time, based on loan amount, interest rate, loan term, and whether extra monthly payments are made.
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormFields
            fields={mortgageAmortizationFieldConfigs}
            values={formValues}
            onChange={handleChange}
            context={{ isAuthenticated }}
            onDateChange={(name, value) =>
              setValues((prev) => ({ ...prev, [name]: value || undefined }))
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
        onClick={handleCalculate}
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

      {error && Array.isArray(error) && error.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <FormSummary type="error" message={error} />
        </Box>
      )}

      {showChart && rows.length > 0 && !error && (
         <>
          <div id="chartSection"></div>
          <MUIBarChart<YearlyBalanceRow>
            data={chartData}
            dataKeys={[
              { key: "balance", label: "Remaining Balance ($)" },
            ]}
            xKey="year"
            title="Mortgage Amortization"
          />
        </>
      )}

      {rows.length > 0 && !error && (
         <>
        <div id="tableSection"></div>
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
        </>
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

export default MortgageProjection;
