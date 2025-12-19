'use client';
import React, { useState } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { retirementSavingsConfig, retirementSavingsFieldConfigs, getRetirementSavingsProjectionColumns, retirementSavingsDataKeys } from '@/configs/retirementSavings';
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
    retirementSavingsConfig.initialFormValues!,
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
      title={retirementSavingsConfig.calculatorTitle}
      description={retirementSavingsConfig.calculatorDescription}
      showTitle>
      <div id="formSection"></div>
      <Typography variant="body1" sx={{mb:3}}>
        {retirementSavingsConfig.calculatorDescription}
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
            dataKeys={retirementSavingsDataKeys}
            xKey="year" 
            title={retirementSavingsConfig.chartTitle!} />
        </>
      )}
      {rows.length > 0 && !error && (
         <>
          <div id="tableSection"></div>
          <ProjectionDataGrid
            rows={rows}
            highlightYear={new Date().getFullYear()}
            columns={getRetirementSavingsProjectionColumns(false)}
          />
        </>
      )}

      {retirementSavingsConfig.assumptions && (
        <Box sx={{ mt: 4 }}>
          <Assumptions items={retirementSavingsConfig.assumptions}
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

export default RetirementSavingsProjection;