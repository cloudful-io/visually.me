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

  useEffect(() => {
  const needsUpdate =
    editableRows.length !== tableRows.length ||
    editableRows.some((row, i) => row !== tableRows[i]);

  if (needsUpdate) {
    setEditableRows(tableRows);
  }
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
  const columns =
    source.type === "fers-pension"
      ? ([
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
          { 
            key: "salaryGrowthRate", 
            label: "Salary Growth Rate (%)", 
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
                    inputProps: {min: 0, max: 100, step: 0.1},
                    endAdornment: <InputAdornment position="end">%</InputAdornment>, 
                  }
                }}
              />
            )
          },
          { 
            key: "colaApplied", 
            label: "COLA Applied (%)",
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
                    inputProps: {min: 0, max: 100, step: 0.1},
                    endAdornment: <InputAdornment position="end">%</InputAdornment>, 
                  }
                }}
              />
            )
          },
          { key: "pension", label: "Annual Pension ($)", currency: true },
          { key: "monthlyPension", label: "Monthly Pension ($)", currency: true },
        ] satisfies ColumnDef<FersPensionProjectionRow, keyof FersPensionProjectionRow>[])
      : source.type === "retirement-savings"
      ? ([
          { key: 'year', label: 'Year' },
          { key: 'age', label: 'Age' },
          { key: 'beginningBalance', label: 'Beginning Balance ($)', currency: true },
          { 
            key: 'contribution', 
            label: 'Contribution ($)', 
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
                    inputProps: {min: 1, step: 100},
                    startAdornment: <InputAdornment position="start">$</InputAdornment>, 
                  }
                }}
              />
            )
          },
          { 
            key: 'yieldPercent', 
            label: 'Yield %',
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
                    inputProps: {min: -100, max: 100, step: 0.1},
                    endAdornment: <InputAdornment position="end">%</InputAdornment>, 
                  }
                }}
              />
            ) 
          },
          { 
            key: 'withdrawRate', 
            label: 'Withdraw %',
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
                    inputProps: {min: 0, max: 100, step: 0.1},
                    endAdornment: <InputAdornment position="end">%</InputAdornment>, 
                  }
                }}
              />
            ) 
          },
          { key: 'monthlyWithdraw', label: 'Monthly Withdraw ($)', currency: true },
          { 
            key: 'annualWithdraw', 
            label: 'Annual Withdraw ($)', 
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
                    inputProps: {min: 0, step: 100},
                    startAdornment: <InputAdornment position="start">$</InputAdornment>, 
                  }
                }}
              />
            )
          },
          { 
            key: 'endingBalance', 
            label: 'Ending Balance ($)', 
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
                    inputProps: {min: 0, step: 100},
                    startAdornment: <InputAdornment position="start">$</InputAdornment>, 
                  }
                }}
              />
            )
          },
            
        ] satisfies ColumnDef<RetirementSavingsProjectionRow, keyof RetirementSavingsProjectionRow>[])
      : ([
          { key: 'year', label: 'Year' },
          { key: 'age', label: 'Age' },
          { 
            key: 'colaApplied', 
            label: 'COLA Applied (%)',
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
                    inputProps: {min: 0, max: 100, step: 0.1},
                    endAdornment: <InputAdornment position="end">%</InputAdornment>, 
                  }
                }}
              />
            )
          },
          { key: 'monthlyBenefit', label: 'Monthly Benefit ($)', currency: true },
          { key: 'annualBenefit', label: 'Annual Benefit ($)', currency: true },
        ] satisfies ColumnDef<SocialSecurityBenefitProjectionRow, keyof SocialSecurityBenefitProjectionRow>[]);

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

  const handleRowEditSave = async (year: number, patch: Partial<ProjectionRow>) => {
    if (!source) return;

    try {
      handleRowEdit(year, patch);

      const existingInput =
        typeof (source as any).data === "string" && (source as any).data.length
          ? JSON.parse((source as any).data)
          : { ...(source as any).mergedFields ?? {} };

      const yearOverrides: Record<string, any> = existingInput.yearOverrides ?? {};

      const existingOverride = (yearOverrides[String(year)] as Record<string, any>) ?? {};
      const newOverride = { ...existingOverride };

      Object.assign(newOverride, patch);

      yearOverrides[String(year)] = newOverride;
      existingInput.yearOverrides = yearOverrides;
    
      await save({
        id: source.id!,
        type: source.type,
        data: JSON.stringify(existingInput),
      });

      await refresh();
    } catch (err) {
      console.error("Failed saving row override:", err);
      await refresh();
    }
  };

const handleRemoveOverride = async (year: number) => {
  if (confirm("Are you sure you want to revert this back to default?")) {
    if (!source) return;

    try {
      const existingInput =
        typeof (source as any).data === "string" && (source as any).data.length
          ? JSON.parse((source as any).data)
          : { ...(source as any).mergedFields ?? {} };

      // Ensure yearOverrides exists as an object
      const yearOverrides: Record<string, any> = existingInput.yearOverrides ?? {};

      // Remove the override for the given year (use String(year) for JSON keys)
      if (Object.prototype.hasOwnProperty.call(yearOverrides, String(year))) {
        const nextOverrides = { ...yearOverrides };
        delete nextOverrides[String(year)];

        existingInput.yearOverrides = Object.keys(nextOverrides).length ? nextOverrides : undefined;
      } else {
        return;
      }

      await save({
        id: source.id!,
        type: source.type,
        data: JSON.stringify(existingInput),
      });

      await refresh();
    } catch (err) {
      console.error("Failed removing year override:", err);
      await refresh();
    }
  }
};

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
          onRowEditSave={handleRowEditSave}
          onRowEditChange={handleRowEdit}
          onRemoveOverride={handleRemoveOverride}
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
