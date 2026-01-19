"use client";
import { use, useState } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useRealEstate } from "@/lib/assets/useRealEstate";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { MUIBarChart } from "@/app/(DashboardLayout)/components/shared/MUIBarChart";
import { ProjectionDataGrid } from "../../components/shared/ProjectionDataGrid";
import { ToggleButton, ToggleButtonGroup, CircularProgress, Button, Typography, Box } from "@mui/material";
import { ReadOnlyFields } from "../../components/shared/ReadOnlyFields";
import { realEstateFieldConfigs, getRealEstateProjectionColumns, realEstateDataKeys } from "@/configs/realEstate";
import BackToList from "../../components/shared/BackToList";
import EditRealEstateDialog from "../../components/dashboard/EditDialogs/EditRealEstateDialog";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import NavigationIcon from "@mui/icons-material/Navigation";
import ListIcon from "@mui/icons-material/List";
import SummarizeIcon from '@mui/icons-material/Summarize';
import TocIcon from '@mui/icons-material/Toc';
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SectionSpeedDial from "../../components/shared/SectionSpeedDial";
import { ColumnDef, DataKeyOption, FormFieldConfig } from '@/types/forms';

// Projection row union
import type { RealEstatePropertyProjectionRow } from "financial-calcs";

export default function RealEstatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading, computedAssets: computedProperties, projectionTables, save, remove, refresh } = useRealEstate();
  const { data: userAttributes } = useUserAttributes();
  const router = useRouter();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const property = computedProperties?.find(s => s.id === id);
  const tableRows: RealEstatePropertyProjectionRow[] = projectionTables?.[id] as RealEstatePropertyProjectionRow[] ?? [];

  const chartRows = tableRows.map((row) => ({
    ...row,
    netCashFlow: row.monthlyIncome - row.monthlyExpense,
  }));

  const detailChartRows = tableRows.map((row) => ({
    ...row,
    mortgage: (-1*row.monthlyMortgage),
    hoaFee: (-1*row.monthlyHoaFee),
    insurance: (-1*Math.round(row.annualInsurance/12)),
    propertyTax: (-1*Math.round(row.annualPropertyTax/12)),
    rentalIncome: row.monthlyIncome,
  }));


  type ViewMode = "summary" | "detail";
  const [viewMode, setViewMode] = useState<ViewMode>("summary");

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
      spouse: property.spouse,
      asset_type: "real-estate",
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
  const fields: FormFieldConfig<any, any>[] = realEstateFieldConfigs;

  const isSummary = viewMode === "summary";
  const columns: ColumnDef<RealEstatePropertyProjectionRow>[] =
    getRealEstateProjectionColumns(
      !isSummary, /* editable */
      isSummary   /* summary */
    );
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
      await save({
        id: property.id!,
        spouse: property.spouse,
        asset_type: "real-estate",
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
        spouse: property.spouse,
        asset_type: "real-estate",
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
        href="/real-estate"
        listLabel="Real Estate Properties"
      />
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

        <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: "stretch", md: "flex-end" }, width: '100%' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            size="small"
            sx={{
              width: { xs: "100%", md: "auto" },
            }}
            onChange={(_, next) => {
              if (next !== null) setViewMode(next);
            }}
          >
            <ToggleButton value="summary" sx={{ flex: { xs: 1, md: "initial" } }}>
              <SummarizeIcon fontSize="small" sx={{ mr: 1 }} />
              Summary
            </ToggleButton>

            <ToggleButton value="detail" sx={{ flex: { xs: 1, md: "initial" } }}>
              <TocIcon fontSize="small" sx={{ mr: 1 }} />
              Detail
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <div id="chartSection" />
        {viewMode === "summary" && (
          <MUIBarChart
            data={chartRows}
            xKey="year"
            dataKeys={[
              { key: "netCashFlow", label: "Net Monthly Cash Flow ($)" },
            ]}
            title="Net Monthly Cash Flow by Year"
            enableRangeFilter
            retirementX={retirementX}
          />
        )}
        {viewMode === "detail" && (
          <MUIBarChart
            data={detailChartRows}
            xKey="year"
            yLabel="Total Monthly Income and Expense ($)"
            dataKeys={[
              { key: "mortgage", label: "Mortgage ($)" },
              { key: "propertyTax", label: "Property Tax ($)" },
              { key: "insurance", label: "Insurance ($)" },
              { key: "hoaFee", label: "HOA Fee ($)" },
              { key: "rentalIncome", label: "Rental Income ($)" },
            ]}
            title="Monthly Income and Expense Breakdown"
            stacked
            enableRangeFilter
            retirementX={retirementX}
          />
        )}

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
            { id: "chartSection", label: "Chart", icon: <BarChartIcon /> },
            { id: "formSection", label: "Form", icon: <ListIcon /> },
          ]}
        />
      </PageContainer>
    </>
  );
}
