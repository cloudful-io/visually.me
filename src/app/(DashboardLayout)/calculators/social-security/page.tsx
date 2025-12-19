'use client';
import React, { useState } from 'react';
import { Box, Grid, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { FormFields } from '@/app/(DashboardLayout)/components/shared/FormFields';
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionDataGrid } from '../../components/shared/ProjectionDataGrid';
import PageContainer from '../../components/container/PageContainer';
import Assumptions from '@/app/(DashboardLayout)/components/shared/Assumptions';
import { exportToCSV } from '@/utils/exportToCSV';
import { socialSecurityConfig, socialSecurityFieldConfigs, getSocialSecurityProjectionColumns, socialSecurityDataKeys } from '@/configs/socialSecurityBenefits';
import { SocialSecurityBenefitInput } from 'financial-calcs';
import { useSocialSecurityBenefitProjection } from '@/hooks/useSocialSecurityBenefitProjection';
import { usePersistedForm } from '@/hooks/usePersistedForm';
import { CalculatorStatsService } from '@/services/calculator-stats-service';
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";

const SocialSecurityProjection = () => {
  const {
    values: formValues,
    handleChange,
    errors,
    hasErrors,
  } = usePersistedForm<SocialSecurityBenefitInput, { isAuthenticated: boolean }>(
    'socialSecurityForm',
    socialSecurityConfig.initialFormValues!,
    socialSecurityFieldConfigs
  );
  
  const isAuthenticated = false;

  const {rows, error, generateTable } = useSocialSecurityBenefitProjection(formValues);
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
      title={socialSecurityConfig.calculatorTitle}
      description={socialSecurityConfig.calculatorDescription}
      showTitle>
      <div id="formSection"></div>
      <Typography variant="body1" sx={{mb:3}}>
        {socialSecurityConfig.calculatorDescription}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <FormFields
          fields={socialSecurityFieldConfigs}
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
        onClick={() => exportToCSV(rows, 'social_security_projection.csv')}
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
            dataKeys={socialSecurityDataKeys}
            xKey="year"
            title={socialSecurityConfig.chartTitle!}
          />
        </>
      )}

      {rows.length > 0 && !error && (
         <>
          <div id="tableSection"></div>
          <ProjectionDataGrid
            rows={rows}
            highlightYear={new Date().getFullYear()}
            columns={getSocialSecurityProjectionColumns(false)}
          />
        </>
      )}

      {socialSecurityConfig.assumptions && (
        <Box sx={{ mt: 4 }}>
          <Assumptions items={socialSecurityConfig.assumptions}
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

export default SocialSecurityProjection;
