'use client';
import React, { useState, useEffect } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { ReadOnlyFields } from '@/app/(DashboardLayout)/components/shared/ReadOnlyFields';
import { ProjectionDataGrid } from "@/app/(DashboardLayout)/components/shared/ProjectionDataGrid";
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useFersPensionProjection } from '@/hooks/useFersPensionProjection';
import { fersPensionFieldConfigs, getFersPensionProjectionColumns } from '@/configs/fersPension';
import { FersPensionInput } from 'financial-calcs';
import { CalculatorStatsService } from "@/services/calculator-stats-service";
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "@/app/(DashboardLayout)/components/shared/SectionSpeedDial";
import TableViewIcon from "@mui/icons-material/TableView";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box, Grid, Button, Typography, FormControlLabel, Switch } from "@mui/material";

type Scenario = {
  id: string;
  name: string;
  inputs: FersPensionInput;
};

const defaultInputs: FersPensionInput = {
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
};

const FersPensionProjection = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'base', name: 'Base Case', inputs: defaultInputs },
  ]);
  const [activeScenarioId, setActiveScenarioId] = useState('base');
  const [showChart, setShowChart] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rowsMap, setRowsMap] = useState<Record<string, any[]>>({});
  const [hasErrors, setHasErrors] = useState(false);

  const activeScenario = scenarios.find(s => s.id === activeScenarioId)!;
  const baseScenario = scenarios[0];

  // Hook to generate table per scenario
  const generateTableForScenario = (scenario: Scenario) => {
    const { rows, error, generateTable } = useFersPensionProjection(scenario.inputs);
    generateTable();
    setRowsMap(prev => ({ ...prev, [scenario.id]: rows }));
    if (error && Array.isArray(error) && error.length > 0) {
      setErrors(prev => ({ ...prev, [scenario.id]: error.join(', ') }));
      setHasErrors(true);
    } else {
      setErrors(prev => ({ ...prev, [scenario.id]: '' }));
      setHasErrors(false);
    }
    // Increment stats
    CalculatorStatsService.incrementCalculationCount().catch(console.error);
  };

  const handleCalculate = () => {
    generateTableForScenario(activeScenario);
  };

  const updateScenarioInput = (id: string, field: keyof FersPensionInput, value: any) => {
    setScenarios(prev =>
      prev.map(s => s.id === id ? { ...s, inputs: { ...s.inputs, [field]: value } } : s)
    );
  };

  const duplicateScenario = () => {
    const newScenario: Scenario = {
      id: `scenario-${scenarios.length}`,
      name: `Scenario ${scenarios.length}`,
      inputs: { ...activeScenario.inputs },
    };
    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newScenario.id);
  };

  // For chart, combine rows from all scenarios
  const combinedChartData = () => {
    const allYears = new Set<number>();
    scenarios.forEach(s => {
      (rowsMap[s.id] || []).forEach(r => allYears.add(r.year));
    });
    const sortedYears = Array.from(allYears).sort((a, b) => a - b);

    return sortedYears.map(year => {
      const entry: any = { year };
      scenarios.forEach(s => {
        const row = (rowsMap[s.id] || []).find(r => r.year === year);
        entry[`${s.id}-pension`] = row?.pension ?? null;
        entry[`${s.id}-salary`] = row?.salary ?? null;
      });
      return entry;
    });
  };

  // Generate chart keys dynamically
  const chartKeys = scenarios.flatMap(s => [
    { key: `${s.id}-pension`, label: `${s.name} Pension ($)` },
    { key: `${s.id}-salary`, label: `${s.name} Salary ($)` },
  ]);

  return (
    <PageContainer
      title="Federal Employee Retirement System (FERS) Pension Projection"
      description="A FERS pension calculator estimates your monthly annuity based on your years of service, high-3 average salary, and chosen retirement age under the Federal Employees Retirement System."
      showTitle
    >
      {/* Scenario Tabs */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        {scenarios.map(s => (
          <Button
            key={s.id}
            variant={s.id === activeScenarioId ? 'contained' : 'outlined'}
            onClick={() => setActiveScenarioId(s.id)}
          >
            {s.name}
          </Button>
        ))}
        <Button onClick={duplicateScenario}>+ Duplicate Scenario</Button>
      </Box>

      {/* Base Case (ReadOnly) */}
      {activeScenarioId !== 'base' && (
        <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="h6">Base Case (Reference)</Typography>
          <ReadOnlyFields
            fields={fersPensionFieldConfigs}
            values={baseScenario.inputs}
          />
        </Box>
      )}

      {/* Active Scenario (Editable) */}
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
       <Grid container spacing={2}>
        <FormFields
            fields={fersPensionFieldConfigs}
            values={activeScenario.inputs}
            onChange={(e) => {
                const { name, value } = e.target;
                updateScenarioInput(activeScenarioId, name as keyof FersPensionInput, value);
            }}
            onDateChange={(name, value) => updateScenarioInput(activeScenarioId, name, value!)}
            errors={errors}
            context={{ isAuthenticated: false }}
            />
</Grid>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
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
          startIcon={<FileDownloadIcon />}
          onClick={() => exportToCSV(combinedChartData(), "fers_pension_projection.csv")}
          disabled={Object.keys(rowsMap).length === 0}
        >
          Export CSV
        </Button>
      </Box>

      {/* Chart */}
      {showChart && Object.keys(rowsMap).length > 0 && (
        <MUIBarChart
          data={combinedChartData()}
          dataKeys={chartKeys}
          xKey="year"
          title="Income and Pension Over Time"
        />
      )}

      {/* Table */}
      {activeScenarioId && rowsMap[activeScenarioId]?.length > 0 && (
        <ProjectionDataGrid
          rows={rowsMap[activeScenarioId]}
          highlightYear={new Date().getFullYear()}
          columns={getFersPensionProjectionColumns(false)}
        />
      )}

      {/* Assumptions */}
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

      {/* Navigation */}
      {Object.keys(rowsMap).length > 0 && (
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
  );
};

export default FersPensionProjection;
