'use client';

import { notFound } from 'next/navigation';
import { use, useState, useMemo } from 'react';
import { calculatorRegistry } from '@/lib/calculators/registry';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { ReadOnlyFields } from '@/app/(DashboardLayout)/components/shared/ReadOnlyFields';
import { FormSummary } from '@/app/(DashboardLayout)/components/shared/FormSummary';
import { ProjectionDataGrid } from '@/app/(DashboardLayout)/components/shared/ProjectionDataGrid';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from '@/services/calculator-stats-service';
import SectionSpeedDial from '@/app/(DashboardLayout)/components/shared/SectionSpeedDial';
import NavigationIcon from '@mui/icons-material/Navigation';
import ListIcon from '@mui/icons-material/List';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Box, Grid, Button, Typography, ToggleButton, ToggleButtonGroup, FormControlLabel, Switch } from '@mui/material';
import CompareIcon from '@mui/icons-material/Compare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions } from '@mui/material';
import ScenarioModeToggle from '@/app/(DashboardLayout)/components/shared/ScenarioModeToggle';
import { DataKeyOption } from '@/types/forms';

export default function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const entry = calculatorRegistry[id as keyof typeof calculatorRegistry];
  if (!entry) return notFound();

  const {
    config,
    fieldConfigs,
    useProjection,
    getScenarioColumns,
    dataKeys,
  } = entry;

  type CombinedRow = {
    year: number;
    scenario1: number;
    scenario2: number;
  };

  type ComparisonRow = {
    year: number;
    age?: number;
    [key: string]: number | undefined;
  };

  const isAuthenticated = false;

  const { values: formValues1, handleChange: handleChange1, setValues: setValues1, errors: errors1, hasErrors: hasErrors1 } =
    usePersistedForm(`${id}-scenario1`, entry.config.initialFormValues!, fieldConfigs);

  const { values: formValues2, handleChange: handleChange2, setValues: setValues2, errors: errors2, hasErrors: hasErrors2 } =
    usePersistedForm(`${id}-scenario2`, entry.config.initialFormValues!, fieldConfigs);

  const [showScenario2, setShowScenario2] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const metricKeys = entry.dataKeys//.map(f => f.key);
  const [metric, setMetric] = useState(metricKeys[0].key);

  const projection1 = useProjection(formValues1);
  const projection2 = useProjection(formValues2);

  const rows1 = projection1.rows;
  const rows2 = projection2.rows;

  const errors = [...(projection1.error ?? []), ...(projection2.error ?? [])];

  const handleCalculate = () => {
    projection1.generateTable();
    projection2.generateTable();
    setComparisonMode(true);

    if (!hasErrors1 && !hasErrors2) {
      CalculatorStatsService.incrementCalculationCount().catch(console.error);
    }
  };

  const handleReset = () => {
    setShowScenario2(false);
    setComparisonMode(false);
    setValues1(entry.config.initialFormValues!);
    setValues2(entry.config.initialFormValues!);
  };

  const handleCopyScenario = () => {
    setShowScenario2(true);
    setValues2({ ...formValues1 });
  };

  const chartDataKeys: DataKeyOption<CombinedRow>[] = [
    { key: 'scenario1', label: 'Scenario 1' },
    { key: 'scenario2', label: 'Scenario 2' },
  ];
  
  type Row = { year: number; [key: string]: number | undefined };

  function buildComparisonRows<Row extends { year: number; age?: number }>(
    rows1: any[],
    rows2: any[],
    dataKeys: DataKeyOption<any>[]
    ): ComparisonRow[] {

    const byYear1 = new Map(rows1.map(r => [r.year, r]));
    const byYear2 = new Map(rows2.map(r => [r.year, r]));
    const allYears = Array.from(new Set([...byYear1.keys(), ...byYear2.keys()])).sort((a, b) => a - b);

    return allYears.map(year => {
      const r1 = byYear1.get(year) ?? {};
      const r2 = byYear2.get(year) ?? {};

      const row: ComparisonRow = {
        year,
        ...(r1.age !== undefined || r2.age !== undefined ? { age: r1.age ?? r2.age } : {}),
      };

      dataKeys.forEach(({ key }) => {
        const k = String(key);

        row[`${k}1`] = (r1 as any)[k] ?? 0;
        row[`${k}2`] = (r2 as any)[k] ?? 0;
        row[`${k}Diff`] = ((r2 as any)[k] ?? 0) - ((r1 as any)[k] ?? 0);
      });
      return row;
    });
  }

  function buildChartRows<Row extends { year: number }>(
    rows1: any[],
    rows2: any[],
    metric: string | number | symbol,
    ): CombinedRow[] {

    const byYear1 = new Map(rows1.map(r => [r.year, r]));
    const byYear2 = new Map(rows2.map(r => [r.year, r]));
    const allYears = Array.from(new Set([...byYear1.keys(), ...byYear2.keys()])).sort((a, b) => a - b);

    return allYears.map(year => {
      const r1 = byYear1.get(year) ?? {};
      const r2 = byYear2.get(year) ?? {};

      const scenario1 = (r1 as any)[metric] ?? 0;
      const scenario2 = (r2 as any)[metric] ?? 0;

      const row: CombinedRow = {
        year,
        scenario1,
        scenario2,
      };
      return row;
    });
  }

  const comparisonRows = useMemo(() => {
    if (!rows1.length || !rows2.length) return [];
        
    return buildComparisonRows(rows1, rows2, entry.dataKeys);
  }, [rows1, rows2, entry.dataKeys]);

  const chartRows = useMemo(() => {
    if (!rows1.length || !rows2.length) return [];
        
    return buildChartRows(rows1, rows2, metric);
  }, [rows1, rows2, metric]);

  return (
    <>
      <div id="formSection"></div>
      <PageContainer 
        title={config.scenarioTitle}
        description={config.scenarioDescription} 
        showTitle>
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
            variant="body1" 
            sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            {config.scenarioDescription}
          </Typography>
          <ScenarioModeToggle 
            calculatorRoute={config.calculatorRoute} 
            scenarioRoute={config.scenarioRoute!} 
          />
        </Box>

        <Grid container direction="column" spacing={2}>
          {/* Scenario 1 Accordion */}
          <Accordion defaultExpanded disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: 'action.hover' }}>
              <Typography variant="h6">Scenario 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {showScenario2 ? (
                  <ReadOnlyFields
                    fields={fieldConfigs}
                    values={formValues1}
                    context={{ isAuthenticated }}
                  />
                ) : (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormFields
                      fields={fieldConfigs}
                      values={formValues1}
                      onChange={handleChange1}
                      context={{ isAuthenticated }}
                      errors={errors1}
                      onDateChange={(name, value) =>
                        setValues1((prev: any) => ({ ...prev, [name]: value || undefined }))
                      }
                    />
                  </LocalizationProvider>
                )}
              </Grid>
            </AccordionDetails>
            {!showScenario2 && (
              <AccordionActions>
                <Button startIcon={<ContentCopyIcon />} onClick={handleCopyScenario} variant="contained">
                  Copy Scenario
                </Button>
              </AccordionActions>
            )}
          </Accordion>

          {/* Scenario 2 Accordion */}
          {showScenario2 && (
            <Accordion defaultExpanded disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: 'action.hover' }}>
                <Typography variant="h6">Scenario 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {comparisonMode ? (
                    <ReadOnlyFields 
                      fields={fieldConfigs} 
                      values={formValues2} 
                      context={{ isAuthenticated }} 
                    />
                  ) : (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormFields 
                      fields={fieldConfigs} 
                      values={formValues2} 
                      onChange={handleChange2} 
                      context={{ isAuthenticated }} errors={errors2} 
                      onDateChange={(name, value) =>
                        setValues2((prev: any) => ({ ...prev, [name]: value || undefined }))
                      }
                    />
                    </LocalizationProvider>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<CompareIcon />}
            onClick={handleCalculate}
            disabled={!showScenario2 || comparisonMode || hasErrors1 || hasErrors2}
          >
            Compare Scenarios
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ ml: 2 }}
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            disabled={!rows1.length && !rows2.length}
          >
            Reset
          </Button>
        </Box>

        {/* Errors */}
        {errors.length > 0 && <FormSummary type="error" message={errors} />}

        {metricKeys.length > 1 && rows1.length > 0 && rows2.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={metric}
              onChange={(_, value) => value && setMetric(value)}
              >
              {metricKeys.map(({ key, label }) => (
                <ToggleButton key={String(key)} value={key}>
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}
        
        {/* Chart */}
        {showScenario2 && chartRows.length > 0 && (
          <>
            <div id="chartSection"></div>  
            <MUIBarChart
              data={chartRows}
              xKey="year"
              dataKeys={chartDataKeys}
              stacked={false}
              disableMetricToggle
              title="Scenario Comparison"
            />
          </>
        )}

        {/* Table */}
        {showScenario2 && comparisonRows.length > 0 && (
          <>
            <div id="tableSection"></div>
            <ProjectionDataGrid
              rows={comparisonRows}
              highlightYear={new Date().getFullYear()}
              columns={getScenarioColumns!()}
            />
          </>
        )}

        {/* Assumptions */}
        {config.assumptions && (
          <Box sx={{ mt: 4 }}>
            <Assumptions items={config.assumptions} />
          </Box>
        )}

        {/* SpeedDial */}
        {(rows1.length > 0 || rows2.length > 0) && (
          <SectionSpeedDial
            icon={<NavigationIcon />}
            tooltip="Navigate To"
            actions={[
              { id: 'tableSection', label: 'Table', icon: <TableChartIcon /> },
              { id: 'chartSection', label: 'Chart', icon: <BarChartIcon /> },
              { id: 'formSection', label: 'Form', icon: <ListIcon /> },
            ]}
          />
        )}
      </PageContainer>
    </>
  );
}
