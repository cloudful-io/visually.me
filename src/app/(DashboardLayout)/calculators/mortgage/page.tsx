'use client';
import React, { useState } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
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
import { mortgageAmortizationConfig, mortgageAmortizationFieldConfigs, mortgageAmortizationDataKeys, YearlyBalanceRow, getMonthlyMortgageAmortizationProjectionColumns, getYearlyMortgageAmortizationProjectionColumns } from '@/configs/mortgageAmortization';
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
    mortgageAmortizationConfig.initialFormValues!,
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
      title={mortgageAmortizationConfig.calculatorTitle}
      description={mortgageAmortizationConfig.calculatorDescription}
      showTitle>
      <div id="formSection"></div>
      <Typography variant="body1" sx={{mb:3}}>
        {mortgageAmortizationConfig.calculatorDescription}
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
            dataKeys={mortgageAmortizationDataKeys}
            xKey="year"
            title={mortgageAmortizationConfig.chartTitle!}
          />
        </>
      )}

      {rows.length > 0 && !error && (
         <>
        <div id="tableSection"></div>
        <ProjectionDataGrid
          rows={tableRows}
          highlightYear={new Date().getFullYear()}
          columns={
            displayBy === 'year'
              ? getYearlyMortgageAmortizationProjectionColumns(false)
              : getMonthlyMortgageAmortizationProjectionColumns(false)
          }
          />
        </>
      )}

      {mortgageAmortizationConfig.assumptions && (
        <Box sx={{ mt: 4 }}>
          <Assumptions items={mortgageAmortizationConfig.assumptions}
          />
        </Box>
      )}

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
