'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { FersPensionInput } from 'financial-calcs';
import { fersPensionConfig, fersPensionFieldConfigs, getFersPensionProjectionColumns, fersPensionDataKeys } from '@/configs/fersPension';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
import PageContainer from "../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useFersPensionProjection } from '@/hooks/useFersPensionProjection';
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

const FersPensionProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm<FersPensionInput, { isAuthenticated: boolean }>(
    'fersPensionForm',
    fersPensionConfig.initialFormValues!,
    fersPensionFieldConfigs
  );

  const isAuthenticated = false;
  const router = useRouter();
  const [advancedMode, setAdvancedMode] = useState(false);
  const {rows, error, generateTable } = useFersPensionProjection(formValues);
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
      title={fersPensionConfig.calculatorTitle}
      description={fersPensionConfig.calculatorDescription}
      showTitle>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="body1">
          {fersPensionConfig.calculatorDescription}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              aria-label="Switch to Scenario Mode"
              checked={advancedMode}
              onChange={(e) => {
                if (e.target.checked) {
                  router.push("/calculators/fers-pension/scenarios");
                }
              }}
            />
          }
          label="Scenario Mode"
          sx={{ ml: 2, whiteSpace: "nowrap" }}
        />
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <FormFields
          fields={fersPensionFieldConfigs}
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
        onClick={() => exportToCSV(rows, "fers_pension_projection.csv")}
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
            dataKeys={fersPensionDataKeys}
            xKey="year" 
            title={fersPensionConfig.chartTitle!}
          />
        </>
      )}

      {rows.length > 0 && !error && (
        <>
        <div id="tableSection"></div>
        <ProjectionDataGrid
          rows={rows}
          highlightYear={new Date().getFullYear()}
          columns={getFersPensionProjectionColumns(false)}
        />
        </>
      )}

      {fersPensionConfig.assumptions && (
        <Box sx={{ mt: 4 }}>
          <Assumptions items={fersPensionConfig.assumptions}
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

export default FersPensionProjection;
