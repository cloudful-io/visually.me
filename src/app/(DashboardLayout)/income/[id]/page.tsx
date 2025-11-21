"use client";
import React, { use, useState } from "react";
import { IncomeSourcesIcon } from "../../components/dashboard/IncomeSourcesIcon";
import { useIncomeSources } from "@/lib/incomeSources/hook";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionTable } from "@/app/(DashboardLayout)/components/shared/ProjectionTable";
import { CircularProgress, Typography } from "@mui/material";

type DataKeyOption<T> = {
  key: T extends any ? keyof T : never;
  label: string;
};

// Projection row union
import type {
  FersPensionProjectionRow,
  RetirementSavingsProjectionRow,
  SocialSecurityBenefitProjectionRow,
} from "financial-calcs";

type ProjectionRow =
  | FersPensionProjectionRow
  | RetirementSavingsProjectionRow
  | SocialSecurityBenefitProjectionRow;

interface IncomePageProps {
  params: { id: string };
}

export default function IncomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading, getById, getProjectionTable } = useIncomeSources();

  // Get the computed source
  const source = getById(id);
  const tableRows: ProjectionRow[] = getProjectionTable(id) || [];

  if (loading || !source) {
    return (
      <PageContainer title="Income Projection">
        <CircularProgress />
        <Typography>Loading income source…</Typography>
      </PageContainer>
    );
  }

  // Dynamically set columns based on type
  const columns =
    source.type === "fers-pension"
      ? [
          { key: "year", label: "Year" },
          { key: "age", label: "Age" },
          { key: "salary", label: "Annual Salary ($)", currency: true },
          { key: "salaryGrowthRate", label: "Salary Growth Rate (%)" },
          { key: "colaApplied", label: "COLA Applied (%)" },
          { key: "pension", label: "Annual Pension ($)", currency: true },
          { key: "monthlyPension", label: "Monthly Pension ($)", currency: true },
        ]
      : source.type === "retirement-savings"
      ? [
          { key: 'year', label: 'Year' },
          { key: 'age', label: 'Age' },
          { key: 'beginningBalance', label: 'Beginning Balance ($)', currency: true },
          { key: 'contribution', label: 'Contribution ($)', currency: true },
          { key: 'yieldPercent', label: 'Yield %' },
          { key: 'withdrawRate', label: 'Withdraw %' },
          { key: 'monthlyWithdraw', label: 'Monthly Withdraw ($)', currency: true },
          { key: 'annualWithdraw', label: 'Annual Withdraw ($)', currency: true },
          { key: 'endingBalance', label: 'Ending Balance ($)', currency: true },
        ]
      : [
          { key: 'year', label: 'Year' },
          { key: 'age', label: 'Age' },
          { key: 'colaApplied', label: 'COLA Applied (%)' },
          { key: 'monthlyBenefit', label: 'Monthly Benefit ($)', currency: true },
          { key: 'annualBenefit', label: 'Annual Benefit ($)', currency: true },
        ];

  // Determine the correct dataKey for MUIBarChart
  const dataKey =
    source.type === "fers-pension"
      ? ("pension" as keyof ProjectionRow)
      : source.type === "retirement-savings"
      ? ("endingBalance" as keyof ProjectionRow)
      : ("annualBenefit" as keyof ProjectionRow);


  const yLabel =
    source.type === "fers-pension"
      ? "FERS Pension ($)"
      : source.type === "retirement-savings"
      ? "End of Year Balance ($)"
      : "Annual Social Security Benefit ($)";

  const DATA_KEYS: Record<string, DataKeyOption<ProjectionRow>[]> = {
    "fers-pension": [
        { key: "pension", label: "Annual Pension ($)" },
        { key: "salary", label: "Annual Salary ($)" },
    ],
    "retirement-savings": [
        { key: "endingBalance", label: "End of Year Balance ($)" },
        { key: "annualWithdraw", label: "Annual Withdrawal ($)" },
    ],
    "social-security": [
        { key: "annualBenefit", label: "Annual Social Security Benefit ($)" },
    ],
    };

  const dataKeys = DATA_KEYS[source.type] || [];


  return (
    <PageContainer title={`${source.label} Projection`} showTitle>
      <Typography variant="h6" sx={{ mb: 2 }}>
        ({source.type})
      </Typography>

      <MUIBarChart
        data={tableRows}
        xKey="year"
        dataKeys={dataKeys}
        title={`${source.label} Over Time`}
      />

      <ProjectionTable
        rows={tableRows}
        highlightYear={new Date().getFullYear()}
        columns={columns}
      />
    </PageContainer>
  );
}
