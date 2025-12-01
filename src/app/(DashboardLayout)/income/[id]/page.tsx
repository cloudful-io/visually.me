"use client";
import React, { use, useState, useEffect } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useIncomeSources } from "@/lib/incomeSources/useIncomeSources";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ColumnDef, ProjectionTable } from "@/app/(DashboardLayout)/components/shared/ProjectionTable";
import { CircularProgress, Button, TextField, Typography } from "@mui/material";
import type { DataKeyOption } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ReadOnlyFields } from "../../components/shared/ReadOnlyFields";
import { fersPensionFieldConfigs } from "@/configs/fersPensionFields";
import { retirementSavingsFieldConfigs } from "@/configs/retirementSavingsFields";
import { socialSecurityFieldConfigs } from "@/configs/socialSecurityBenefitsFields";
import EditIncomeSourceDialog from "../../components/dashboard/EditDialogs/EditIncomeSourcesDialog";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";
import InputAdornment from '@mui/material/InputAdornment';

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

export default function IncomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading, computedSources, projectionTables, save, remove, refresh } = useIncomeSources();
  const { data: userAttributes } = useUserAttributes();
  const router = useRouter();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [newSourceType, setNewSourceType] = useState<string | null>(null);

  // Get the computed source and table rows
  const source = computedSources?.find(s => s.id === id);
  const tableRows: ProjectionRow[] = projectionTables?.[id] ?? [];

  // Track row-level edits
  const [editableRows, setEditableRows] = useState<ProjectionRow[]>(tableRows);

  // Keep editableRows in sync when tableRows change
  useEffect(() => {
    setEditableRows(tableRows);
  }, [tableRows]);

  const handleRowEdit = (year: number, patch: Partial<ProjectionRow>) => {
    setEditableRows(prev =>
      prev.map(row => (row.year === year ? { ...row, ...patch } : row))
    );
  };

  // Handle dialog open/close
  const handleEditDialogOpen = (id: string) => {
    setEditingSourceId(id);
    setNewSourceType(null);
    setOpenEditDialog(true);
  };
  const handleEditDialogClose = () => {
    setEditingSourceId(null);
    setNewSourceType(null);
    setOpenEditDialog(false);
  };
  const handleEditDialogSave = async (input: { type: string; data: string; id?: string }) => {
    await save(input);
    await refresh();
    handleEditDialogClose();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this income / investment?")) {
      await remove(id);
      router.push("/income");
    }
  };

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

  // Dynamically define columns
  const columns: ColumnDef<ProjectionRow, keyof ProjectionRow>[] =
    source.type === "fers-pension"
      ? [
          { key: "year", label: "Year" },
          { key: "age", label: "Age" },
          {
            key: "salary",
            label: "Annual Salary ($)",
            currency: true,
            editable: true,
            editor: (value: number | undefined, row: ProjectionRow, onChange: (v?: number) => void) => (
              <TextField
                size="small"
                variant="standard"
                value={value ?? ''}
                type="number"
                onChange={e => {
                  const raw = e.target.value;
                  const parsed = raw === '' ? undefined : Number(raw);
                  onChange(Number.isNaN(parsed as number) ? undefined : parsed);
                }}
                slotProps={{
                  input: { 
                    inputProps: {min: 0, step: 1000},
                    startAdornment: <InputAdornment position="start">$</InputAdornment>, 
                  }
                }}
              />
            )
          },
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

  return (
    <>
      <div id="formSection"></div>
      <PageContainer title={`${source.label} Projection`} showTitle>
        <ReadOnlyFields
          fields={readOnlyFields}
          values={source.mergedFields}
          context={{ isAuthenticated: true }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          sx={{ mt: 2, mr: 2 }}
          onClick={() => handleEditDialogOpen(source.id!)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ mt: 2 }}
          onClick={() => handleDelete(source.id!)}
        >
          Delete
        </Button>

        <div id="chartSection" />
        <MUIBarChart
          data={tableRows}
          xKey="year"
          dataKeys={dataKeys}
          title={`${source.label} Over Time`}
        />

        <div id="tableSection" />
        <ProjectionTable
          rows={editableRows}
          highlightYear={new Date().getFullYear()}
          columns={columns}
          onRowEditSave={async (year, patch) => {
            //await save({ id: source.id!, type: source.type, data: JSON.stringify({ year, ...patch }) });
            console.log({ year, ...patch });
            await refresh();
            handleRowEdit(year, patch);
          }}
          onRowEditChange={handleRowEdit}
        />

        <EditIncomeSourceDialog
          userAttributes={userAttributes!}
          open={openEditDialog}
          sources={computedSources}
          sourceId={editingSourceId}
          defaultType={newSourceType}
          onClose={handleEditDialogClose}
          onSave={handleEditDialogSave}
        />

        <SectionSpeedDial
          icon={<NavigationIcon />}
          tooltip="Navigate To"
          actions={[
            { id: "tableSection", label: "Table", icon: <TableChartIcon /> },
            { id: "chartSection", label: "Chart", icon: <BarChartIcon /> },
            { id: "formSection", label: "Form", icon: <ListIcon /> },
          ]}
        />
      </PageContainer>
    </>
  );
}
