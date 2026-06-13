'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import { IncomeBreakdown } from '../components/dashboard/IncomeBreakdown';
import { InvestmentBreakdown } from '../components/dashboard/InvestmentBreakdown';
import DashboardCard from '../components/shared/DashboardCard';
import { MUILineChart } from '../components/shared/MUILineChart';
import UserAttributes from '../components/dashboard/UserAttributes';
import ChildListCard from '../components/dashboard/ChildListCard';
import { useUserAttributes } from '@/lib/userAttributes/hook';
import { useUserChildren } from "@/lib/userChildren/hook";
import { useIncomeSources } from '@/lib/assets/useIncomeSources';
import { useRealEstate } from '@/lib/assets/useRealEstate';
import { FinancialTimeline } from '../components/dashboard/FinancialTimeline';
import { buildCashFlowTable, CashFlowSourceRow } from '@/lib/dashboard/util';
import { supabase } from "@/utils/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { UserProfileService } from "supabase-auth-lib";
import { useTheme } from '@mui/material/styles';
import { useIncludeSpouse } from "@/contexts/IncludeSpouseContext";

const Dashboard = () => {
  const { includeSpouse } = useIncludeSpouse();
  const { computedAssets: computedSources, loading, getCombinedProjection, getCombinedChartRows: getCombinedIncomeChartRows, save, remove, refresh } = useIncomeSources({ joint: includeSpouse });
  const { computedAssets: computedProperties, getCombinedChartRows: getCombinedPrpoertiesChartRows } = useRealEstate();
  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes({ spouse: false });
  const { data: spouseData, exists: spouseExists, refresh: refreshSpouseAttrs, loading: spouseLoading } = useUserAttributes({ spouse: true });
  const { data: children, loading: childrenLoading, refresh: refreshChildren } = useUserChildren();

  const { user } = useSupabaseAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const [childListRefreshKey, setChildListRefreshKey] = useState(0);

  const combined = getCombinedProjection() ?? [];
  const incomeChartRows = getCombinedIncomeChartRows;
  const propertiesChartRows = getCombinedPrpoertiesChartRows;
  const [selectedAge, setSelectedAge] = useState(60);
  const [targetRetirementAge, setTargetRetirementAge] = useState<number>(60);
  const theme = useTheme();

  const netCashFlow = useMemo(() =>
    buildCashFlowTable([
      incomeChartRows as CashFlowSourceRow[],
      propertiesChartRows as CashFlowSourceRow[],
    ]),
    [incomeChartRows, propertiesChartRows]
  );

  // Load display name and avatar
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const userProfileService = new UserProfileService(supabase);
      const profile = await userProfileService.getById(user.id);

      if (profile) {
        setDisplayName(profile.display_name || "");
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (attrs?.targetRetirementAge != null) {
      setSelectedAge(attrs.targetRetirementAge);
      setTargetRetirementAge(attrs.targetRetirementAge);
    }
  }, [attrs?.targetRetirementAge]);

  const handleChange = async () => {
    refreshAttrs();
    refreshSpouseAttrs();
    refreshChildren();
  };

  return (
    <PageContainer title="Visually Me: Dashboard" description="Dashboard displaying financial projections and breakdowns.">
      <Box>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Box sx={{ px: 1, py: 0.5 }}>
              <Typography variant="h4" fontWeight={600}>
                Welcome, {displayName ?? 'there'}!
              </Typography>
            </Box>
          </Grid>

          <Grid
            size={{ sm: 12, lg: 4 }}
          >
            <Grid container spacing={2}>
              <Grid size={12}>
                <UserAttributes onChange={handleChange} />
              </Grid>
              {!spouseLoading && spouseExists && (
                <Grid size={12}>
                  <UserAttributes spouse onChange={handleChange} />
                </Grid>
              )}
              {!childrenLoading && children && children.length > 0 && (
                <Grid size={12}>
                  <ChildListCard onChange={handleChange} />
                </Grid>
              )}
              <Grid size={12}>
                <FinancialTimeline
                  incomeSources={computedSources!}
                  realEstateProperties={computedProperties}
                  userChildren={children}
                  currentYear={new Date().getFullYear()}
                  birthYear={attrs?.birthYear}
                  retirementAge={attrs?.targetRetirementAge}
                  lifeExpectancyAge={attrs?.lifeExpectancyAge}
                  spouseBirthYear={spouseData?.birthYear}
                  spouseRetirementAge={spouseData?.targetRetirementAge}
                  spouseLifeExpectancyAge={spouseData?.lifeExpectancyAge}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Spanning Grid for Income and Investment (4 + 4 = 8) */}
          <Grid
            size={{ sm: 12, lg: 8 }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <IncomeBreakdown
                      combined={combined}
                      computedSources={(computedSources ?? []).map(s => ({
                        id: s.id ?? "unknown",
                        label: s.label,
                        type: s.asset_type,
                      }))}
                      targetAge={selectedAge}
                      targetRetirementAge={targetRetirementAge}
                      onAgeChange={setSelectedAge}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <InvestmentBreakdown
                      combined={combined}
                      computedSources={(computedSources ?? []).map(s => ({
                        id: s.id ?? "unknown",
                        label: s.label,
                        type: s.asset_type,
                      }))}
                      targetAge={selectedAge}
                      targetRetirementAge={targetRetirementAge}
                      onAgeChange={setSelectedAge}
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
                    xKey="year"
                    dataKeys={[
                      { key: 'netCashFlow', label: 'Net Cash Flow' },
                    ]}
                    enableRangeFilter
                    retirementX={[
                      {
                        year: attrs?.birthYear! + attrs?.targetRetirementAge!,
                        label: spouseExists ? "Target Retirement\n(You)" : "Target Retirement",
                        color: theme.palette.primary.main,
                        position: "start"
                      },
                      spouseExists && spouseData
                        ? {
                          year: spouseData?.birthYear! + spouseData.targetRetirementAge!,
                          label: "Target Retirement\n(Spouse)",
                          color: theme.palette.secondary.main,
                          position: "middle"
                        }
                        : undefined
                    ].filter(Boolean) as { year: number; label: string; position: "start" | "middle" | "end"; color?: string }[]}
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