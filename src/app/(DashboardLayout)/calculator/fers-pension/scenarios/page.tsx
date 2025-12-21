'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { ReadOnlyFields } from "@/app/(DashboardLayout)/components/shared/ReadOnlyFields";
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { FersPensionInput } from 'financial-calcs';
import { fersPensionConfig, fersPensionFieldConfigs, getFersPensionScenarioColumns } from '@/configs/fersPension';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionDataGrid } from "../../../components/shared/ProjectionDataGrid";
import PageContainer from "../../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { useFersPensionProjection } from '@/hooks/useFersPensionProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from "@/services/calculator-stats-service";
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../../components/shared/SectionSpeedDial";
import { Accordion, AccordionSummary, AccordionActions, AccordionDetails, Box, Grid, Button, Typography, ToggleButtonGroup, ToggleButton, Switch, FormControlLabel } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CompareIcon from '@mui/icons-material/Compare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { DataKeyOption } from "@/types/forms";
import ScenarioModeToggle from "@/app/(DashboardLayout)/components/shared/ScenarioModeToggle";

const FersPensionProjection = () => {
  const isAuthenticated = false;

  const { values: formValues1, setValues: setValues1, handleChange: handleChange1, errors: errors1, hasErrors: hasErrors1 } =
    usePersistedForm<FersPensionInput, { isAuthenticated: boolean }>(
      'fersPensionForm1',
      fersPensionConfig.initialFormValues!,
      fersPensionFieldConfigs
    );

  const { values: formValues2, setValues: setValues2, handleChange: handleChange2, errors: errors2, hasErrors: hasErrors2 } =
    usePersistedForm<FersPensionInput, { isAuthenticated: boolean }>(
      'fersPensionForm2',
      fersPensionConfig.initialFormValues!,
      fersPensionFieldConfigs
    );

  const router = useRouter();
  const [advancedMode, setAdvancedMode] = useState(true);
  const { rows: rows1, error: error1, reset: reset1, generateTable: generateTable1 } = useFersPensionProjection(formValues1);
  const { rows: rows2, error: error2, reset: reset2, generateTable: generateTable2 } = useFersPensionProjection(formValues2);

  type CombinedRow = {
    year: number;
    scenario1: number;
    scenario2: number;
  };

  type ComparisonRow = {
    year: number;
    age?: number;

    pension1: number;
    pension2: number;
    pensionDiff: number;

    salary1: number;
    salary2: number;
    salaryDiff: number;
  };

  const comparisonRows = React.useMemo(() => {
    if (!rows1.length || !rows2.length) return [];
    return buildComparisonRows(rows1, rows2);
  }, [rows1, rows2]);


  const [showScenario2, setShowScenario2] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [metric, setMetric] = useState<'Salary' | 'Pension'>('Salary');
  const chartDataKeys: DataKeyOption<CombinedRow>[] = [
    { key: 'scenario1', label: 'Scenario 1' },
    { key: 'scenario2', label: 'Scenario 2' },
  ];

  const handleCalculate = () => {
    setComparisonMode(true);
    generateTable1();
    generateTable2();

    if (!hasErrors1 && !hasErrors2) {
      CalculatorStatsService.incrementCalculationCount().catch(err => console.error(err));
    }
  };

  const handleReset = () => {
    setShowScenario2(false);
    setComparisonMode(false);
    reset1();
    reset2();
  }

  const handleCopyScenario = () => {
    setShowScenario2(true);
    setValues2({ ...formValues1 });
  };

  function buildCombinedChartData(
    rows1: { year: number; salary?: number; pension?: number }[],
    rows2: { year: number; salary?: number; pension?: number }[],
    metric: 'Salary' | 'Pension'
  ): CombinedRow[] {
    const allYears = new Set<number>();

    rows1.forEach(r => allYears.add(r.year));
    rows2.forEach(r => allYears.add(r.year));

    return Array.from(allYears)
      .sort((a, b) => a - b)
      .map(year => {
        const r1 = rows1.find(r => r.year === year);
        const r2 = rows2.find(r => r.year === year);

        return {
          year,
          scenario1:
            metric === 'Salary'
              ? r1?.salary ?? 0
              : r1?.pension ?? 0,
          scenario2:
            metric === 'Salary'
              ? r2?.salary ?? 0
              : r2?.pension ?? 0,
        };
      });
  }


  function buildComparisonRows(
    rows1: any[],
    rows2: any[]
  ): ComparisonRow[] {
    const byYear1 = new Map(rows1.map(r => [r.year, r]));
    const byYear2 = new Map(rows2.map(r => [r.year, r]));

    const allYears = Array.from(
      new Set([...byYear1.keys(), ...byYear2.keys()])
    ).sort((a, b) => a - b);

    return allYears.map(year => {
      const r1 = byYear1.get(year);
      const r2 = byYear2.get(year);

      const pension1 = r1?.pension ?? 0;
      const pension2 = r2?.pension ?? 0;

      const salary1 = r1?.salary ?? 0;
      const salary2 = r2?.salary ?? 0;

      return {
        year,
        age: r1?.age ?? r2?.age,
        salary1,
        salary2,
        salaryDiff: salary2 - salary1,
        pension1,
        pension2,
        pensionDiff: pension2 - pension1,
      };
    });
  }
  
  return (
    <>
      <div id="formSection"></div>
      <PageContainer
        title={fersPensionConfig.scenarioTitle}
        description={fersPensionConfig.scenarioDescription}
        showTitle
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="body1">
            {fersPensionConfig.scenarioDescription}
          </Typography>

          <ScenarioModeToggle
            calculatorRoute={fersPensionConfig.calculatorRoute}
            scenarioRoute={fersPensionConfig.scenarioRoute!}
          />
        </Box>

        <Grid container direction="column" spacing={2} sx={{ mb: 2 }}>
          <Grid>
            <Accordion defaultExpanded disableGutters>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: 'action.hover', // MUI theme-aware hover color
                }}>
                <Typography variant="h6">Scenario 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {showScenario2 ? (
                    <ReadOnlyFields
                      fields={fersPensionFieldConfigs}
                      values={formValues1}
                      context={{ isAuthenticated }}
                    />
                  ) : (
                    <FormFields
                      fields={fersPensionFieldConfigs}
                      values={formValues1}
                      onChange={handleChange1}
                      context={{ isAuthenticated }}
                      errors={errors1}
                    />
                  )}
                </Grid>
              </AccordionDetails>
              {!showScenario2 && (
                <AccordionActions>
                  <Button
                    variant="contained"
                    startIcon={<ContentCopyIcon />}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleCopyScenario();
                    }}
                  >
                    Copy Scenario
                  </Button>
                </AccordionActions>
              )}
            </Accordion>
          </Grid>
          {showScenario2 && (
            <Grid>
              <Accordion defaultExpanded disableGutters>
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                  backgroundColor: 'action.hover', // MUI theme-aware hover color
                }}>
                  <Typography variant="h6">Scenario 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    { comparisonMode ? (
                      <ReadOnlyFields
                        fields={fersPensionFieldConfigs}
                        values={formValues2}
                        context={{ isAuthenticated }}
                        />
                    ) : (
                      <FormFields
                        fields={fersPensionFieldConfigs}
                        values={formValues2}
                        onChange={handleChange2}
                        context={{ isAuthenticated }}
                        errors={errors2}
                      />
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
        </Grid>
      
        <Button
          variant="contained"
          startIcon={<CompareIcon />}
          onClick={handleCalculate}
          disabled={!showScenario2 || comparisonMode || (hasErrors1 || hasErrors2)}
        >
          Compare Scenarios
        </Button>

        <Button
          variant="outlined"
          color="error"
          sx={{ ml: 2 }}
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          disabled={rows1.length === 0 && rows2.length === 0}
        >
          Reset
        </Button>

        {(error1 || error2) && (
          <Box sx={{ mt: 2 }}>
            <FormSummary type="error" message={[...(error1 ?? []), ...(error2 ?? [])]} />
          </Box>
        )}

        {showScenario2 && (rows1.length > 0 || rows2.length > 0) && (
          <>
            <div id="chartSection"></div>
            <Box sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={metric}
                onChange={(_, value) => value && setMetric(value)}
              >
                <ToggleButton value="Salary">Annual Salary ($)</ToggleButton>
                <ToggleButton value="Pension">Annual Pension ($)</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <MUIBarChart
              data={buildCombinedChartData(rows1, rows2, metric)}
              xKey="year"
              dataKeys={chartDataKeys}
              stacked={false}
              enableRangeFilter
              disableMetricToggle
              title={`Scenario Comparison (${metric})`}
              yLabel={metric === 'Salary' ? 'Annual Salary ($)' : 'Annual Pension ($)'}
            />
          </>
        )}

        {comparisonRows.length > 0 && (
          <>
            <Typography variant="h6" sx={{ my: 2 }}>
              Scenario Comparison
            </Typography>

            <ProjectionDataGrid
              rows={comparisonRows}
              highlightYear={new Date().getFullYear()}
              columns={getFersPensionScenarioColumns()}
            />
          </>
        )}

        {fersPensionConfig.assumptions && (
        <Box sx={{ mt: 4 }}>
          <Assumptions items={fersPensionConfig.assumptions}
          />
        </Box>
        )}

        {(rows1.length > 0 || rows2.length > 0) && (
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
