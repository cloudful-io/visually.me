"use client";
import { use, useState } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useRealEstate } from "@/lib/realEstate/useRealEstate";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
import { CircularProgress, Button, Typography } from "@mui/material";
import { ReadOnlyFields } from "../../components/shared/ReadOnlyFields";
import { realEstateFieldConfigs, getRealEstateProjectionColumns, realEstateDataKeys } from "@/configs/realEstate";
import EditRealEstateDialog from "../../components/dashboard/EditDialogs/EditRealEstateDialog";
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
import type { RealEstatePropertyProjectionRow } from "financial-calcs";

export default function RealEstatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading, computedProperties, projectionTables, save, remove, refresh } = useRealEstate();
  const { data: userAttributes } = useUserAttributes();
  const router = useRouter();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const property = computedProperties?.find(s => s.id === id);
  const tableRows: RealEstatePropertyProjectionRow[] = projectionTables?.[id] ?? [];

  const handleEditDialogOpen = (id: string) => {
    setEditingPropertyId(id);
    setOpenEditDialog(true);
  };
  const handleEditDialogClose = () => {
    setEditingPropertyId(null);
    setOpenEditDialog(false);
  };
  const handleEditDialogSave = async (input: { data: string; id?: string }) => {
    if (!property) return;

    const newBase = JSON.parse(input.data);
    const currentInput =
      typeof property.data === "string" && property.data.length
        ? JSON.parse(property.data)
        : { ...(property.mergedFields ?? {}) };

    const preservedOverrides = currentInput.yearOverrides ?? {};
    const merged = {
      ...newBase,
      yearOverrides: Object.keys(preservedOverrides).length ? preservedOverrides : undefined,
    };

    await save({
      id: property.id!,
      data: JSON.stringify(merged),
    });

    await refresh();
    handleEditDialogClose();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this real estate property?")) {
      await remove(id);
      router.push("/real-estate");
    }
  };

  if (loading || !property) {
    return (
      <PageContainer title="Real Estate Projection">
        <CircularProgress />
        <Typography>Loading property…</Typography>
      </PageContainer>
    );
  }

  // --- Dynamic columns and dataKeys ---
  let fields: FormFieldConfig<any, any>[] = realEstateFieldConfigs;
  let columns: ColumnDef<any>[] = getRealEstateProjectionColumns(true);
  let dataKeys: DataKeyOption<any>[] = realEstateDataKeys;

  // --- Row edit handlers ---
  const handleRowEditSave = async (year: number, patch: Partial<RealEstatePropertyProjectionRow>) => {
    if (!property) return;

    try {
      const existingInput =
        typeof property.data === "string" && property.data.length
          ? JSON.parse(property.data)
          : { ...(property.mergedFields ?? {}) };

      const yearOverrides: Record<string, any> = existingInput.yearOverrides ?? {};
      const existingOverride = yearOverrides[String(year)] ?? {};
      const newOverride = { ...existingOverride, ...patch };
      yearOverrides[String(year)] = newOverride;

      existingInput.yearOverrides = yearOverrides;
console.log(existingInput);
      await save({
        id: property.id!,
        data: JSON.stringify(existingInput),
      });

      await refresh();
    } catch (err) {
      console.error("Failed saving row override:", err);
      await refresh();
    }
  };

  const handleRemoveOverride = async (year: number) => {
    if (!property || !confirm("Are you sure you want to revert this back to default?")) return;

    try {
      const existingInput =
        typeof property.data === "string" && property.data.length
          ? JSON.parse(property.data)
          : { ...(property.mergedFields ?? {}) };

      const yearOverrides: Record<string, any> = existingInput.yearOverrides ?? {};
      if (yearOverrides[String(year)]) {
        const nextOverrides = { ...yearOverrides };
        delete nextOverrides[String(year)];
        existingInput.yearOverrides = Object.keys(nextOverrides).length ? nextOverrides : undefined;
      }

      await save({
        id: property.id!,
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
      <PageContainer title={`${property.label} Projection`} showTitle>
        <ReadOnlyFields
          fields={fields}
          values={property.mergedFields}
          context={{ isAuthenticated: true }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          sx={{ mt: 2, mr: 2 }}
          onClick={() => handleEditDialogOpen(property.id!)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ mt: 2 }}
          onClick={() => handleDelete(property.id!)}
        >
          Delete
        </Button>

        <div id="chartSection" />
        {/*
        <MUIBarChart
          data={tableRows}
          xKey="year"
          dataKeys={dataKeys}
          title={`${property.label} Over Time`}
        />
        */}
<br/><br/>
        <div id="tableSection" />
        <ProjectionDataGrid
          rows={tableRows}
          highlightYear={new Date().getFullYear()}
          columns={columns}
          onRowEditSave={handleRowEditSave}
          onRemoveOverride={handleRemoveOverride}
        />

        <EditRealEstateDialog
          userAttributes={userAttributes!}
          open={openEditDialog}
          properties={computedProperties}
          propertyId={editingPropertyId}
          onClose={handleEditDialogClose}
          onSave={handleEditDialogSave}
        />

        <SectionSpeedDial
          icon={<NavigationIcon />}
          tooltip="Navigate To"
          actions={[
            { id: "tableSection", label: "Table", icon: <TableChartIcon /> },
         /*   { id: "chartSection", label: "Chart", icon: <BarChartIcon /> },*/
            { id: "formSection", label: "Form", icon: <ListIcon /> },
          ]}
        />
      </PageContainer>
    </>
  );
}
