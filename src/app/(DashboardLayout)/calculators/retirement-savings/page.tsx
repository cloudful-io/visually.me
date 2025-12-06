'use client';
import React, { useState } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { retirementSavingsFieldConfigs } from '@/configs/retirementSavings';
import { RetirementSavingsInput } from 'financial-calcs';
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import PageContainer from "../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useRetirementSavingsProjection, getSummaryMessage } from '@/hooks/useRetirementSavingsProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from "@/services/calculator-stats-service";
import { Box, Grid, Button, Typography } from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FormControlLabel, Switch } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";

const RetirementSavingsProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm<RetirementSavingsInput, { isAuthenticated: boolean }>(
    'retirementSavingsForm',
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
    },
    retirementSavingsFieldConfigs
  );

  const isAuthenticated = false;

  const {rows, error, generateTable } = useRetirementSavingsProjection(formValues);

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
      title="Retirement Savings and Withdrawal Projection" 
      description="A retirement savings and withdrawal calculator estimates how long your savings will last based on your current balance, contributions, investment growth, and planned annual withdrawals in retirement." 
      showTitle>
      <div id="formSection"></div>
      <Typography variant="body1" sx={{mb:3}}>
        Project how long your retirement savings will last given your initial investment balance, annual contribution, estimated yield and withdraw rates.
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        
        <FormFields
          fields={retirementSavingsFieldConfigs}
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
        startIcon={<TableViewIcon/>} 
        onClick={handleCalculate}
        disabled={hasErrors}
      >
        Calculate
      </Button>

      <Button 
        variant="outlined" sx={{ ml: 2 }} 
        startIcon={<FileDownloadIcon/>} 
        onClick={() => exportToCSV(rows, "retirement_projection.csv")}
        disabled={rows.length === 0}
      >
        Export CSV
      </Button>
      
      {(rows.length > 0 || error) && (() => {
        const summary = getSummaryMessage(rows, error); 
        return (
          <FormSummary
            type={summary.type}
            message={summary.message}
          />
        );
      })()}
      {showChart && rows.length > 0 && !error && (
         <>
          <div id="chartSection"></div>
          <MUIBarChart 
            data={rows} 
            dataKeys={[
              { key: "endingBalance", label: "End of Year Balance ($)" },
              { key: "annualWithdraw", label: "Annual Withdrawal ($)" },
            ]}
            xKey="year" 
            title="Retirement Savings and Withdrawal Over Time" />
        </>
      )}
      {rows.length > 0 && !error && (
         <>
          <div id="tableSection"></div>
          <ProjectionDataGrid
            rows={rows}
            highlightYear={new Date().getFullYear()}
            columns={[
              { key: 'year', label: 'Year' },
              { key: 'age', label: 'Age' },
              { key: 'beginningBalance', label: 'Beginning Balance ($)', currency: true },
              { key: 'contribution', label: 'Contribution ($)', currency: true },
              { key: 'yieldPercent', label: 'Yield %' },
              { key: 'withdrawRate', label: 'Withdrawal %', hiddenOnMobile: true },
              { key: 'monthlyWithdraw', label: 'Monthly Withdrawal ($)', currency: true, hiddenOnMobile: true },
              { key: 'annualWithdraw', label: 'Annual Withdrawal ($)', currency: true },
              { key: 'endingBalance', label: 'Ending Balance ($)', currency: true },
            ]}
          />
        </>
      )}
      <Box sx={{ mt: 4 }}>
        <Assumptions
          title="Assumptions"
          items={[
            <>
              This calculator assumes that contribution increases at a fixed percentage rate over your lifetime. In reality, if you are contributing at the <a href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits" target="_blank" rel="noopener noreferrer">maximum limit</a> allowed by the Internal Revenue Service (IRS), the growth rate varies year-over-year. For instance, there was no change between 2020 and 2021 at $19,500; while it increased from $20,500 to $22,500 between 2022 and 2023.
            </>,
            <>
              This calculator assumes that withdrawal is kept at a fixed percentage rate. In reality, the limiting factor is the <a href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds" target="_blank" rel="noopener noreferrer">Required Minimum Distribution (RMD)</a>, which requires you to withdraw a minimum percentage of your balance, starting at age 73. The exception is if your retirement savings is a Roth 401k or Roth IRA account.
            </>,
            <>
              This calculator simplifies the calculation of annual yield by assuming that the annual contribution is added to your account at the <strong>end of each year</strong>. In reality, contribution is likely deducted from your monthly or bi-weekly paycheck that will benefit from the annual yield / growth of the current year.
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

export default RetirementSavingsProjection;