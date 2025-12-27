'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import { IncomeAtAge } from '../components/dashboard/IncomeAtAge';
import { InvestmentBalanceAtAge } from '../components/dashboard/InvestmentBalanceAtAge';
import { IncomeBreakdown } from '../components/dashboard/IncomeBreakdown';
import { InvestmentBreakdown } from '../components/dashboard/InvestmentBreakdown';
import DashboardCard from '../components/shared/DashboardCard';
import { MUILineChart } from '../components/shared/MUILineChart';
import { MUIBarChart } from '../components/shared/MUIBarChart';
import UserAttributes from '../components/dashboard/UserAttributes';
import { useUserAttributes } from '@/lib/userAttributes/hook';
import { useIncomeSources } from '@/lib/incomeSources/useIncomeSources';
import { useRealEstate } from '@/lib/realEstate/useRealEstate';
import { FinancialTimeline } from '../components/dashboard/FinancialTimeline';
import { buildCashFlowTable, CashFlowSourceRow } from '@/lib/dashboard/util';

const Dashboard = () => {

  const { computedSources, loading, getCombinedProjection, getCombinedChartRows: getCombinedIncomeChartRows, save, remove, refresh } = useIncomeSources();
  const { computedProperties, getCombinedChartRows: getCombinedPrpoertiesChartRows } = useRealEstate();
  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes();

  const combined = getCombinedProjection() ?? [];
  const incomeChartRows = getCombinedIncomeChartRows;
  const propertiesChartRows = getCombinedPrpoertiesChartRows;
  const [selectedAge, setSelectedAge] = useState(60);
  const [targetRetirementAge, setTargetRetirementAge] = useState<number>(60);

  const netCashFlow = useMemo(() => 
    buildCashFlowTable([
      incomeChartRows as CashFlowSourceRow[],
      propertiesChartRows as CashFlowSourceRow[],
    ]),
    [incomeChartRows, propertiesChartRows]
  );

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
          <Grid
            size={{sm: 12, lg: 4}}
          >
            <Grid container spacing={3}>
              <Grid size={12}>
                <UserAttributes />
              </Grid>
              <Grid size={12}>
                <FinancialTimeline incomeSources={computedSources!} realEstateProperties={computedProperties} currentYear={new Date().getFullYear()} birthYear={attrs?.birthYear!} retirementAge={attrs?.targetRetirementAge!}/>
              </Grid>
            </Grid>
          </Grid>
          {/* Spanning Grid for Income and Investment (4 + 4 = 8) */}
          <Grid
           size={{sm: 12, lg: 8}}
          >
            <Grid container spacing={3}>
              <Grid size={{sm: 6}}>
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
              <Grid size={{sm: 6}}>
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
              <Grid size={12}>
                <DashboardCard 
                  title="Overall Income and Expense Over Time" 
                  subtitle="Shows total income from all sources and real estate expenses over time, with net cash flow for each year.">
                  <MUILineChart
                    title=""
                    data={netCashFlow}
                    xKey="age"
                    dataKeys={[
                      { key: 'netCashFlow', label: 'Net Cash Flow' },
                    ]}
                    enableRangeFilter
                    retirementX={attrs?.targetRetirementAge!}
                  />
                </DashboardCard>
              </Grid>
              
            </Grid>
          </Grid>          
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;