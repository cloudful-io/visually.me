'use client'
import React, { useState, useEffect } from 'react';
import { Grid, Box, Button, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import { IncomeAtAge } from '../components/dashboard/IncomeAtAge';
import { InvestmentBalanceAtAge } from '../components/dashboard/InvestmentBalanceAtAge';
import { IncomeBreakdown } from '../components/dashboard/IncomeBreakdown';
import { InvestmentBreakdown } from '../components/dashboard/InvestmentBreakdown';
import DashboardCard from '../components/shared/DashboardCard';
import { MUILineChart } from '../components/shared/MUILineChart';
import UserAttributes from '../components/dashboard/UserAttributes';
import IncomeSources from '../components/dashboard/IncomeSources';
import { useUserAttributes } from '@/lib/userAttributes/hook';
import { useIncomeSources } from '@/lib/incomeSources/hook';

const Dashboard = () => {

  const { computedSources, getCombinedProjection, getCombinedChartRows } = useIncomeSources();
  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes();

  const combined = getCombinedProjection() ?? [];
  const chartRows = getCombinedChartRows() ?? [];
  const [selectedAge, setSelectedAge] = useState(60);
  const [targetRetirementAge, setTargetRetirementAge] = useState<number>(60);
  const noIncomeSources = (computedSources ?? []).length === 0;

  useEffect(() => {
    if (attrs?.targetRetirementAge != null) {
      setSelectedAge(attrs.targetRetirementAge);
      setTargetRetirementAge(attrs.targetRetirementAge);
    }
  }, [attrs?.targetRetirementAge]);

  return (
    <PageContainer title="Visually Me: Dashboard" description="Dashboard displaying financial projections and breakdowns.">
      <Box>
        <Grid container spacing={3}>
          
          {/* Getting Started Guide */}
          {noIncomeSources && (
            <Grid size={{ xs: 12 }}>
              <DashboardCard title="Welcome to Visually Me!">
                <Typography gutterBottom>
                  To get started, add your income sources and set your target retirement age. 
                  Once you do, you will see your income and investments projected over time.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => {
                    // Scroll to Income Sources section
                    const el = document.getElementById('income-sources');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Add Income Sources
                </Button>
              </DashboardCard>
            </Grid>
          )}

          {/* Spanning Grid for Income and Investment (4 + 4 = 8) */}
          <Grid
           size={{xs: 12, lg: 8}}
          >
            <Grid container spacing={3}>
              <Grid size={{xs: 6}}>
                <Grid container spacing={3}>
                  <Grid size={{xs: 12}}>
                    <IncomeAtAge
                      combined={combined}
                      targetAge={selectedAge}
                      targetRetirementAge={targetRetirementAge}
                      onAgeChange={setSelectedAge}
                    />
                  </Grid>
                  <Grid size={{xs: 12}}>
                    <IncomeBreakdown
                      combined={combined}
                      computedSources={(computedSources ?? []).map(s => ({
                        id: s.id ?? "unknown",   
                        label: s.label,
                        type: s.type,
                      }))}
                      targetAge={selectedAge}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{xs: 6}}>
                <Grid container spacing={3}>
                  <Grid size={{xs: 12}}>
                    <InvestmentBalanceAtAge
                      combined={combined}
                      targetAge={selectedAge}
                      targetRetirementAge={targetRetirementAge}
                      onAgeChange={setSelectedAge}
                    />
                </Grid>
                <Grid size={{xs: 12}}>
                    <InvestmentBreakdown
                      combined={combined}
                      computedSources={(computedSources ?? []).map(s => ({
                        id: s.id ?? "unknown",   
                        label: s.label,
                        type: s.type,
                      }))}
                      targetAge={selectedAge}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <DashboardCard title="Income and Investment Over Time">
                <MUILineChart
                  title="Income vs Investment Over Time"
                  data={chartRows}
                  xKey="age"
                  dataKeys={[
                    { key: 'annualIncome', label: 'Income' },
                    { key: 'annualInvestmentBalance', label: 'Investment' },
                  ]}
                />
                </DashboardCard>
              </Grid>
              
            </Grid>
          </Grid>
          
          {/* User Attributes/Income Sources Column (4) - to align the 8+4=12 layout */}
          <Grid
            size={{xs: 12, lg: 4}}
          >
            <Grid container spacing={3}>
              <Grid size={{xs: 12}}>
                <UserAttributes />
              </Grid>
              <Grid size={{xs: 12}}>
                <IncomeSources />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;