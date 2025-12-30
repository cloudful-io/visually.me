"use client";

import { notFound } from "next/navigation";
import { use, useState } from "react";
import { calculatorRegistry } from "@/lib/calculators/registry";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormFields } from "@/app/(DashboardLayout)/components/shared/FormFields";
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { ProjectionDataGrid } from "@/app/(DashboardLayout)/components/shared/ProjectionDataGrid";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Assumptions from "@/app/(DashboardLayout)/components/shared/Assumptions";
import { exportToCSV } from "@/utils/exportToCSV";
import { usePersistedForm } from "@/hooks/usePersistedForm";
import { CalculatorStatsService } from "@/services/calculator-stats-service";
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

import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";
import ScenarioModeToggle from '@/app/(DashboardLayout)/components/shared/ScenarioModeToggle';

export default function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const entry = calculatorRegistry[id as keyof typeof calculatorRegistry];
  if (!entry) return notFound();

  const {
    config,
    fieldConfigs,
    useProjection,
    getColumns,
    getScenarioColumns,
    dataKeys,
  } = entry;

  const {
    values,
    setValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm(
    `${config.id}-form`,
    config.initialFormValues!,
    fieldConfigs
  );

  const [showChart, setShowChart] = useState(true);
  const [displayBy, setDisplayBy] = useState<'month' | 'year'>('month');
  const isAuthenticated = false;

  const projection = useProjection(values);
  const rows = projection.rows;
  const error = projection.error;
  const yearlyRows = 'yearlyRows' in projection ? projection.yearlyRows : undefined;
  const hasYearlyView = yearlyRows !== undefined;

  const summary =
    entry.getSummary && (rows.length > 0 || error)
      ? entry.getSummary(rows, error, values)
      : null;
  
      console.log(summary);
  const handleCalculate = async () => {
    projection.generateTable();

    if (!hasErrors) {
      CalculatorStatsService.incrementCalculationCount().catch(console.error);
    }
  };
  
  return (
    <>
      <div id="formSection"></div>
      <PageContainer
        title={config.calculatorTitle}
        description={config.calculatorDescription}
        showTitle
        >
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: "center", 
            justifyContent: 'space-between', 
            flexDirection: { xs: 'column', md: 'row' },
            mb: 3,
            gap: 1
          }}>
          <Typography 
            variant="subtitle1" 
            sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              {config.calculatorDescription}
          </Typography>
          { typeof getScenarioColumns === "function" && (
            <ScenarioModeToggle 
              calculatorRoute={config.calculatorRoute} 
              scenarioRoute={config.scenarioRoute!} 
            />
          )}
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormFields
              fields={fieldConfigs}
              values={values}
              onChange={handleChange}
              errors={errors}
              context={{ isAuthenticated }}
              onDateChange={(name, value) =>
                setValues((prev: any) => ({ ...prev, [name]: value || undefined }))
              }
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
          />

          { hasYearlyView && (
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
          )}
          
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
          onClick={() => exportToCSV(rows, `${config.id}.csv`)}
          disabled={rows.length === 0}
        >
          Export CSV
        </Button>
   
        {summary && (error || rows.length > 0) && (
          <Box mt={2}>
            <FormSummary
              type={summary.type}
              message={summary.message}
            />
          </Box>
        )}

        {showChart && rows.length > 0 && !error && (
          <>
            <div id="chartSection"></div>  
            <MUIBarChart
              data={hasYearlyView ? yearlyRows : rows}
              dataKeys={dataKeys}
              xKey="year"
              title={config.chartTitle!}
              enableRangeFilter
              showFutureYearOnly={false}    
            />
          </>
        )}

        {rows.length > 0 && !error && (
          <>
            <div id="tableSection"></div>
            <Box mt={2}>
              <ProjectionDataGrid
                rows={(hasYearlyView && displayBy === 'year') ? yearlyRows : rows}
                highlightYear={new Date().getFullYear()}
                columns={getColumns(false, displayBy === 'year')}
              />
            </Box>
          </>
        )}

        {config.assumptions && (
          <Box sx={{ mt: 4 }}>
            <Assumptions items={config.assumptions} />
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
}