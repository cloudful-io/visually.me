'use client';
import React, { useState } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { collegeTuitionFieldConfigs } from '@/configs/collegeTuitionFields';
import { CollegeTuitionInput } from 'financial-calcs';
import { ProjectionTable } from '@/app/(DashboardLayout)/components/shared/ProjectionTable';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import PageContainer from "../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useCollegeTuitionProjection, getSummaryMessage } from '@/hooks/useCollegeTuitionProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from "@/services/calculator-stats-service";
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";

import {
  Box,
  Grid,
  Button,
  Typography,
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
  } = usePersistedForm<CollegeTuitionInput, { isAuthenticated: boolean }>(
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

  const isAuthenticated = false;

  const {rows, error, generateTable } = useCollegeTuitionProjection(formValues);
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
      title="College Savings and Tuition Projection" 
      description="A college savings and tuition calculator helps you estimate how much you’ll need to save and how your contributions, growth rate, and time horizon affect your ability to cover future education costs." 
      showTitle>
      <Typography variant="body1" sx={{mb:3}}>
        Estimate how much you need to save to cover future tuition costs, based on initial balance of savings, years of college education, annual contributions, estimated yield and inflation rates, and cost of college education.
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <FormFields
          fields={collegeTuitionFieldConfigs}
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
        onClick={() => exportToCSV(rows, "college_projection.csv")}
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
            { key: "annualWithdraw", label: "Tuition Withdraw ($)" },
          ]}
          xKey="year" 
          title="College Savings and Tuition Over Time" />
        </>
      )}
      {rows.length > 0 && !error && (
        <>
        <div id="tableSection"></div>
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
        </>
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

export default CollegeTuitionProjection;