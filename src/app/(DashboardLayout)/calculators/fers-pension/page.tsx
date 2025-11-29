'use client';
import React, { useState } from "react";
import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { FersPensionInput } from 'financial-calcs';
import { fersPensionFieldConfigs } from '@/configs/fersPensionFields';
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionTable } from '@/app/(DashboardLayout)/components/shared/ProjectionTable';
import PageContainer from "../../components/container/PageContainer";
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { useFersPensionProjection } from '@/hooks/useFersPensionProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from "@/services/calculator-stats-service";
import { SpeedDial, SpeedDialAction, MenuItem } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import SettingsIcon from "@mui/icons-material/Settings";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";


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

  const isAuthenticated = false;

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -50; 
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
    handleClose();
  };
  
  return (
    <PageContainer 
      title="Federal Employee Retirement System (FERS) Pension Projection" 
      description="A FERS pension calculator estimates your monthly annuity based on your years of service, high-3 average salary, and chosen retirement age under the Federal Employees Retirement System." 
      showTitle>
      <div id="formSection"></div>
      <Typography variant="body1" sx={{mb:3}}>
        Calculate your Federal Employee Retirement System (FERS) pension based on type of retirement, years of service, high-3 salary, and retirement age.
      </Typography>
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
            dataKeys={[
              { key: "pension", label: "Annual Pension ($)" },
              { key: "salary", label: "Annual Salary ($)" },
            ]}
            xKey="year" 
            title="Income and Pension Over Time"
          />
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
              { key: 'age', label: 'Age' },
              { key: 'salary', label: 'Annual Salary ($)', currency: true },
              { key: 'salaryGrowthRate', label: 'Salary Growth Rate (%)' },
              { key: 'colaApplied', label: 'COLA Applied (%)' },
              { key: 'pension', label: 'Annual Pension ($)', currency: true },
              { key: 'monthlyPension', label: 'Monthly Pension ($)', currency: true },
            ]}
          />
        </>
      )}

      <Box sx={{ mt: 4 }}>
        <Assumptions
          title="Assumptions"
          items={[
            <>
              Salary grows annually by a fixed percentage until retirement. The average of your highest 3 years of salary before retirement is used to calculate your pension.
            </>,
            <>
              Pension multiplier is typically 1% or 1.1% based on your age and service years.
            </>,
            <>
              Cost-of-Living Adjustments (COLA) start applying after age 62, increasing your pension annually by the estimated COLA percentage.
            </>,
            <>
              This calculator assumes a simplified model for illustrative purposes. Actual FERS pension calculations may include additional factors like retirement type and survivor benefits.
            </>,
          ]}
        />
      </Box>
      <SpeedDial
        ariaLabel="Navigation"
        color="error"
        FabProps={{ color: "secondary" }}
        sx={{ 
          position: 'fixed', 
          bottom: 84, 
          right: 32,
          "& .MuiFab-root": {
            width: 48,     
            height: 48,    
          } }}
        icon={<NavigationIcon />}
      >
        <SpeedDialAction
          icon={<TableChartIcon />}
          tooltipTitle="Table"
          onClick={() => scrollTo("tableSection")}
        />
        <SpeedDialAction
          icon={<BarChartIcon />}
          tooltipTitle="Chart"
          onClick={() => scrollTo("chartSection")}
        />
        <SpeedDialAction
          icon={<SettingsIcon />}
          tooltipTitle="Form"
          onClick={() => scrollTo("formSection")}
        />
      </SpeedDial>
    </PageContainer>
  );
};

export default FersPensionProjection;
