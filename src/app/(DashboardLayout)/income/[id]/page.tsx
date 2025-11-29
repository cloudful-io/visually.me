"use client";
import React, { use, useState } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useIncomeSources } from "@/lib/incomeSources/useIncomeSources";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { MUIBarChart } from '@/app/(DashboardLayout)/components/shared/MUIBarChart';
import { ProjectionTable } from "@/app/(DashboardLayout)/components/shared/ProjectionTable";
import { CircularProgress, Button, Typography } from "@mui/material";
import type { DataKeyOption } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ReadOnlyFields } from "../../components/shared/ReadOnlyFields";
import { fersPensionFieldConfigs } from "@/configs/fersPensionFields";
import { retirementSavingsFieldConfigs } from "@/configs/retirementSavingsFields";
import { socialSecurityFieldConfigs } from "@/configs/socialSecurityBenefitsFields";
import EditIncomeSourceDialog from "../../components/dashboard/EditDialogs/EditIncomeSourcesDialog";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

// Projection row union
import type {
  FersPensionProjectionRow,
  RetirementSavingsProjectionRow,
  SocialSecurityBenefitProjectionRow,
} from "financial-calcs";
import { Edit } from "@mui/icons-material";

type ProjectionRow =
  | FersPensionProjectionRow
  | RetirementSavingsProjectionRow
  | SocialSecurityBenefitProjectionRow;

export default function IncomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading, computedSources, projectionTables, save, remove, refresh } = useIncomeSources();
  const { data: userAttributes } = useUserAttributes();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  const [newSourceType, setNewSourceType] = useState<string | null>(null);
  const router = useRouter();

  // Get the computed source
  const source = computedSources?.find(s => s.id === id);
  const tableRows: ProjectionRow[] = projectionTables?.[id] ?? [];

  if (loading || !source) {
    return (
      <PageContainer title="Income Projection">
        <CircularProgress />
        <Typography>Loading income source…</Typography>
      </PageContainer>
    );
  }
  const FIELD_CONFIGS: Record<string, any[]> = {
    "fers-pension": fersPensionFieldConfigs,
    "retirement-savings": retirementSavingsFieldConfigs,
    "social-security": socialSecurityFieldConfigs,
  };

  const readOnlyFields = FIELD_CONFIGS[source.type] ?? [];

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

  const handleEdit = (id: string) => {
    setEditingSourceId(id);
    setNewSourceType(null);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingSourceId(null);
    setNewSourceType(null);
    setOpenEditDialog(false);
  };

  const handleSave = async (input: { type: string; data: string; id?: string }) => {
    await save(input);
    await refresh();
    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this income / investment?")) {
      await remove(id);
      router.push("/income")
    }
  };

  return (
    <PageContainer title={`${source.label} Projection`} showTitle>
      <ReadOnlyFields fields={readOnlyFields} values={source.mergedFields} context={{ isAuthenticated: true }} />
      <Button
        variant="contained"
        color="primary"
        startIcon={<EditIcon/>} 
        sx={{ mt: 2, marginRight: 2 }} 
        onClick={() => handleEdit(source.id!)}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon/>} 
        sx={{ mt: 2}} 
        onClick={() => handleDelete(source.id!)}
      >
        Delete
      </Button>
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
      <EditIncomeSourceDialog
        userAttributes={userAttributes!}
        open={openEditDialog}
        sources={computedSources}   
        sourceId={editingSourceId}
        defaultType={newSourceType}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
