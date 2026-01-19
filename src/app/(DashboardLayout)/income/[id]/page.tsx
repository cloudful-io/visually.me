"use client";
import { use, useState } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useIncomeSources } from "@/lib/assets/useIncomeSources";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
import { CircularProgress, Button, Typography } from "@mui/material";
import { ReadOnlyFields } from "../../components/shared/ReadOnlyFields";
import BackToList from "../../components/shared/BackToList";
import EditIncomeSourceDialog from "../../components/dashboard/EditDialogs/EditIncomeSourcesDialog";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";
import { AssetInput } from "@/lib/assets/schema";
import { AnyProjectionRow } from "@/lib/assets/types";
import { assetRegistry } from "@/lib/assets/registry";
import { calculatorRegistry } from "@/lib/calculators/registry";

export default function IncomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading, computedAssets: computedSources, projectionTables, save, remove, refresh } = useIncomeSources();
  const { data: userAttributes } = useUserAttributes();
  const router = useRouter();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [newSourceType, setNewSourceType] = useState<string | null>(null);

  const source = computedSources?.find(s => s.id === id);
  const tableRows: AnyProjectionRow[] = projectionTables?.[id] ?? [];

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

  const handleEditDialogSave = async (input: AssetInput & { id?: string }) => {
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
      asset_type: input.asset_type,
      spouse: false,
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

  const assetDef = assetRegistry[source.asset_type];

  if (!assetDef) {
    return (
      <PageContainer title="Income Projection">
        <Typography color="error">
          Error: Unknown asset type "{source.asset_type}".
        </Typography>
      </PageContainer>
    );
  }

  const calculator = calculatorRegistry[assetDef.calculatorId!];

  if (!calculator) {
    return (
      <PageContainer title="Income Projection">
        <Typography color="error">
          Error: No calculator found for asset type "{source.asset_type}".
        </Typography>
      </PageContainer>
    );
  }

  const fields = calculator.fieldConfigs;
  const columns = calculator.getColumns(true);
  const dataKeys = calculator.dataKeys;

  // --- Row edit handlers ---
  const handleRowEditSave = async (year: number, patch: Partial<AnyProjectionRow>) => {
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
        spouse: source.spouse,
        asset_type: source.asset_type,
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
        spouse: source.spouse,
        asset_type: source.asset_type,
        data: JSON.stringify(existingInput),
      });

      await refresh();
    } catch (err) {
      console.error("Failed removing year override:", err);
      await refresh();
    }
  };
  const retirementX =
    userAttributes?.birthYear !== undefined &&
    userAttributes?.targetRetirementAge !== undefined
      ? userAttributes.birthYear! + userAttributes.targetRetirementAge!
      : undefined;

  return (
    <>
      <div id="formSection"></div>
      <BackToList
          href="/income"
          listLabel="Income and Investment"
        />
      <PageContainer title={ source.label} showTitle>
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
          enableRangeFilter
          retirementX={retirementX}
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
