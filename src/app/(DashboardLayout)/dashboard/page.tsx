'use client'
import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import { IncomeAtAge } from '../components/dashboard/IncomeAtAge';
import { InvestmentBalanceAtAge } from '../components/dashboard/InvestmentBalanceAtAge';
import { IncomeBreakdown } from '../components/dashboard/IncomeBreakdown';
import { InvestmentBreakdown } from '../components/dashboard/InvestmentBreakdown';
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

  useEffect(() => {
    if (attrs?.targetRetirementAge != null) {
      setSelectedAge(attrs.targetRetirementAge);
      setTargetRetirementAge(attrs.targetRetirementAge);
    }
  }, [attrs?.targetRetirementAge]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <IncomeAtAge
                    combined={combined}
                    targetAge={selectedAge}
                    targetRetirementAge={targetRetirementAge}
                    onAgeChange={setSelectedAge}
                  />
                </Grid>
                <Grid size={12}>
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
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <InvestmentBalanceAtAge
                    combined={combined}
                    targetAge={selectedAge}
                    targetRetirementAge={targetRetirementAge}
                    onAgeChange={setSelectedAge}
                  />
              </Grid>
              <Grid size={12}>
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
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <UserAttributes />
              </Grid>
              <Grid size={12}>
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
