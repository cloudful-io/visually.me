'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { ReadOnlyFields } from "@/app/(DashboardLayout)/components/shared/ReadOnlyFields";
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { FersPensionInput } from 'financial-calcs';
import { fersPensionFieldConfigs, getFersPensionProjectionColumns } from '@/configs/fersPension';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionDataGrid } from "../../../components/shared/ProjectionDataGrid";
import PageContainer from "../../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
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

const FersPensionProjection = () => {
  const isAuthenticated = false;

  const { values: formValues1, setValues: setValues1, handleChange: handleChange1, errors: errors1, hasErrors: hasErrors1 } =
    usePersistedForm<FersPensionInput, { isAuthenticated: boolean }>(
      'fersPensionForm1',
      {
        startYear: new Date().getFullYear(),
        birthYear: 1970,
        serviceStartYear: 1990,
        serviceEndYear: 2010,
        retirementAge: 62,
        currentSalary: 85000,
        salaryGrowthRate: 3,
        high3Salary: 100000,
        colaPercent: 2,
        pensionMultiplier: 1.1,
        yearsToProject: 40,
        retirementType: 'regular',
      },
      fersPensionFieldConfigs
    );

  const { values: formValues2, setValues: setValues2, handleChange: handleChange2, errors: errors2, hasErrors: hasErrors2 } =
    usePersistedForm<FersPensionInput, { isAuthenticated: boolean }>(
      'fersPensionForm2',
      {
        startYear: new Date().getFullYear(),
        birthYear: 1970,
        serviceStartYear: 1990,
        serviceEndYear: 2010,
        retirementAge: 62,
        currentSalary: 85000,
        salaryGrowthRate: 3,
        high3Salary: 100000,
        colaPercent: 2,
        pensionMultiplier: 1.1,
        yearsToProject: 40,
        retirementType: 'regular',
      },
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

  const [showScenario2, setShowScenario2] = useState(false);
  const [metric, setMetric] = useState<'Salary' | 'Pension'>('Salary');
  const chartDataKeys: DataKeyOption<CombinedRow>[] = [
    { key: 'scenario1', label: 'Scenario 1' },
    { key: 'scenario2', label: 'Scenario 2' },
  ];

  const handleCalculate = () => {
    generateTable1();
    generateTable2();

    if (!hasErrors1 && !hasErrors2) {
      CalculatorStatsService.incrementCalculationCount().catch(err => console.error(err));
    }
  };

  const handleReset = () => {
    setShowScenario2(false);
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

  return (
    <>
      <div id="formSection"></div>
      <PageContainer
        title="Federal Employee Retirement System (FERS) Pension Scenario Comparison"
        description="A FERS pension calculator estimates your monthly annuity based on your years of service, high-3 average salary, and chosen retirement age under the Federal Employees Retirement System."
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
            Build scenarios to compare your Federal Employee Retirement System (FERS) pension based on type of retirement, years of service, high-3 salary, and retirement age.
          </Typography>

          <FormControlLabel
            control={
              <Switch
                aria-label="Switch to Calculator Mode"
                checked={advancedMode}
                onChange={(e) => {
                  if (!e.target.checked) {
                    router.push("/calculators/fers-pension");
                  }
                }}
              />
            }
            label="Scenario Mode"
            sx={{ ml: 2, whiteSpace: "nowrap" }}
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
                    <FormFields
                      fields={fersPensionFieldConfigs}
                      values={formValues2}
                      onChange={handleChange2}
                      context={{ isAuthenticated }}
                      errors={errors2}
                    />
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
          disabled={!showScenario2 || (hasErrors1 || hasErrors2)}
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
          Reset Scenarios
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

        {rows1.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 4 }}>Scenario 1 Table</Typography>
            <ProjectionDataGrid
              rows={rows1}
              highlightYear={new Date().getFullYear()}
              columns={getFersPensionProjectionColumns(false)}
            />
          </>
        )}

        {rows2.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 4 }}>Scenario 2 Table</Typography>
            <ProjectionDataGrid
              rows={rows2}
              highlightYear={new Date().getFullYear()}
              columns={getFersPensionProjectionColumns(false)}
            />
          </>
        )}

        <Box sx={{ mt: 4 }}>
          <Assumptions
            title="Assumptions"
            items={[
              <>Salary grows annually by a fixed percentage until retirement. The average of your highest 3 years of salary before retirement is used to calculate your pension.</>,
              <>Pension multiplier is typically 1% or 1.1% based on your age and service years.</>,
              <>Cost-of-Living Adjustments (COLA) start applying after age 62, increasing your pension annually by the estimated COLA percentage.</>,
              <>This calculator assumes a simplified model for illustrative purposes. Actual FERS pension calculations may include additional factors like retirement type and survivor benefits.</>,
            ]}
          />
        </Box>

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
