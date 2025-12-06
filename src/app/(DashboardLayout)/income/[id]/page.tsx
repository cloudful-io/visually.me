"use client";
import { use, useState } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useIncomeSources } from "@/lib/incomeSources/useIncomeSources";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
import { CircularProgress, Button, Typography } from "@mui/material";
import { ReadOnlyFields } from "../../components/shared/ReadOnlyFields";
import { fersPensionFieldConfigs, fersPensionProjectionColumns, fersPensionDataKeys } from "@/configs/fersPension";
import { retirementSavingsFieldConfigs, retirementSavingsProjectionColumns, retirementSavingsDataKeys } from "@/configs/retirementSavings";
import { socialSecurityFieldConfigs, socialSecurityProjectionColumns, socialSecurityDataKeys } from "@/configs/socialSecurityBenefits";
import EditIncomeSourceDialog from "../../components/dashboard/EditDialogs/EditIncomeSourcesDialog";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";
import { ColumnDef, DataKeyOption, FormFieldConfig } from '@/types/forms';

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

  const source = computedSources?.find(s => s.id === id);
  const tableRows: ProjectionRow[] = projectionTables?.[id] ?? [];

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
    if (!source) return;

    const newBase = JSON.parse(input.data);
    const currentInput =
      typeof source.data === "string" && source.data.length
        ? JSON.parse(source.data)
        : { ...(source.mergedFields ?? {}) };

    const preservedOverrides = currentInput.yearOverrides ?? {};
    const merged = {
      ...newBase,
      yearOverrides: Object.keys(preservedOverrides).length ? preservedOverrides : undefined,
    };

    await save({
      id: source.id!,
      type: input.type,
      data: JSON.stringify(merged),
    });

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

  // --- Dynamic columns and dataKeys ---
  let fields: FormFieldConfig<any, any>[] = [];
  let columns: ColumnDef<any>[] = [];
  let dataKeys: DataKeyOption<any>[] = [];

  if (source.type === "fers-pension") {
    fields = fersPensionFieldConfigs;
    columns = fersPensionProjectionColumns;
    dataKeys = fersPensionDataKeys
  } else if (source.type === "retirement-savings") {
    fields = retirementSavingsFieldConfigs;
    columns = retirementSavingsProjectionColumns;
    dataKeys = retirementSavingsDataKeys;
  } else {
    fields = socialSecurityFieldConfigs;
    columns = socialSecurityProjectionColumns;
    dataKeys = socialSecurityDataKeys;
  }

  // --- Row edit handlers ---
  const handleRowEditSave = async (year: number, patch: Partial<ProjectionRow>) => {
    if (!source) return;

    try {
      const existingInput =
        typeof source.data === "string" && source.data.length
          ? JSON.parse(source.data)
          : { ...(source.mergedFields ?? {}) };

      const yearOverrides: Record<string, any> = existingInput.yearOverrides ?? {};
      const existingOverride = yearOverrides[String(year)] ?? {};
      const newOverride = { ...existingOverride, ...patch };
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
    if (!source || !confirm("Are you sure you want to revert this back to default?")) return;

    try {
      const existingInput =
        typeof source.data === "string" && source.data.length
          ? JSON.parse(source.data)
          : { ...(source.mergedFields ?? {}) };

      const yearOverrides: Record<string, any> = existingInput.yearOverrides ?? {};
      if (yearOverrides[String(year)]) {
        const nextOverrides = { ...yearOverrides };
        delete nextOverrides[String(year)];
        existingInput.yearOverrides = Object.keys(nextOverrides).length ? nextOverrides : undefined;
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
  };

  return (
    <>
      <div id="formSection"></div>
      <PageContainer title={`${source.label} Projection`} showTitle>
        <ReadOnlyFields
          fields={fields}
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
        <ProjectionDataGrid
          rows={tableRows}
          highlightYear={new Date().getFullYear()}
          columns={columns}
          onRowEditSave={handleRowEditSave}
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
