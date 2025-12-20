'use client';
import React, { useState } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { MilitaryPensionInput } from 'financial-calcs';
import { militaryPensionConfig, militaryPensionFieldConfigs, getMilitaryPensionProjectionColumns, militaryPensionDataKeys } from '@/configs/militaryPension';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
import PageContainer from "../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useMilitaryPensionProjection } from '@/hooks/useMilitaryPensionProjection';
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

const MilitaryPensionProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm<MilitaryPensionInput, { isAuthenticated: boolean }>(
    'militaryPensionForm',
    militaryPensionConfig.initialFormValues!,
    militaryPensionFieldConfigs
  );

  const isAuthenticated = false;

  const {rows, error, generateTable } = useMilitaryPensionProjection(formValues);
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
      title={militaryPensionConfig.calculatorTitle}
      description={militaryPensionConfig.calculatorDescription}
      showTitle>
      <Typography variant="body1" sx={{mb:3}}>
        {militaryPensionConfig.calculatorDescription}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <FormFields
          fields={militaryPensionFieldConfigs}
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
        onClick={() => exportToCSV(rows, "military_pension_projection.csv")}
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
          <MUIBarChart
            data={rows}
            dataKeys={militaryPensionDataKeys}
            xKey="year" 
            title={militaryPensionConfig.chartTitle!}
          />
        </>
      )}

      {rows.length > 0 && !error && (
        <>
        <div id="tableSection"></div>
        <ProjectionDataGrid
          rows={rows}
          highlightYear={new Date().getFullYear()}
          columns={getMilitaryPensionProjectionColumns(false)}
        />
        </>
      )}

      {militaryPensionConfig.assumptions && (
        <Box sx={{ mt: 4 }}>
          <Assumptions items={militaryPensionConfig.assumptions}
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

export default MilitaryPensionProjection;
