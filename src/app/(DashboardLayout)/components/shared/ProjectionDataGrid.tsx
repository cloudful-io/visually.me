"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowClassNameParams,
} from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";
import { currencyFormatter } from "@/lib/formatters/currency";

type ColumnDef<T> = {
  key: keyof T;
  label: string;
  description?: string;
  currency?: boolean;
  editable?: boolean;
  hiddenOnMobile?: boolean;
};

type ProjectionDataGridProps<T extends { year: number }> = {
  rows: T[];
  columns: ColumnDef<T>[];
  highlightYear?: number;
  onRowEditSave?: (year: number, patch: Partial<T>) => void;
  onRemoveOverride?: (year: number) => void;
};

export function ProjectionDataGrid<T extends { year: number }>(
  props: ProjectionDataGridProps<T>
) {
  const { rows, columns, highlightYear, onRowEditSave, onRemoveOverride } =
    props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const muiColumns = React.useMemo<GridColDef[]>(() => {
    const cols: GridColDef[] = columns.map((col) => ({
      field: col.key as string,
      headerName: col.label,
      description: col.description ?? col.label,
      editable: col.editable ?? false,
      
      flex: 1,
      valueFormatter: (value: any) => {
        if (value == null) return "";
        return col.currency
          ? currencyFormatter(value)
          : value;
      }
    }));

    // Action column
    cols.push({
      field: "__actions__unique",
      headerName: "",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const row = params.row as T;
        return "hasOverride" in row && row.hasOverride ? (
          <Button
            variant="outlined"
            size="small"
            onClick={() => onRemoveOverride?.(row.year)}
          >
            Revert
          </Button>
        ) : null;
      },
    });

    return cols;
  }, [columns, onRemoveOverride, currencyFormatter]);

  const columnVisibilityModel = React.useMemo(() => {
    const model: Record<string, boolean> = {};
    muiColumns.forEach((col) => {
      model[col.field] = !(isMobile && (columns.find(c => c.key === col.field)?.hiddenOnMobile));
    });
    return model;
  }, [muiColumns, isMobile, columns]);

  const getRowClassName = React.useCallback(
    (params: GridRowClassNameParams) => {
      const row = params.row as any;
      return [
        row.year === highlightYear && "highlight-year",
        row.hasOverride && "override-row",
      ]
        .filter(Boolean)
        .join(" ");
    },
    [highlightYear]
  );

  const processRowUpdate = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) => {
      const patch: Partial<T> = {};

      for (const key in newRow) {
        if (newRow[key] !== oldRow[key]) {
          patch[key as keyof T] = newRow[key];
        }
      }

      if (Object.keys(patch).length > 0) {
        onRowEditSave?.(newRow.year, patch);
      }

      return newRow;
    },
    [onRowEditSave]
  );

  function getRowId(row: any) {
    if (row.month !== undefined)
      return `${row.year}-${row.month}`;
    else
      return row.year;
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <DataGrid
        sx={{
          borderColor: 'divider', 
          boxShadow: 1,
          "& .MuiDataGrid-row": {
            "&.highlight-year": { bgcolor: theme.palette.action.selected },
            "&.override-row": { borderLeft: `4px solid ${theme.palette.warning.main}` },
          },
        }}
        rows={rows}
        columns={muiColumns}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={() => {}}
        getRowId={getRowId}
        editMode="row"
        processRowUpdate={processRowUpdate}
        getRowClassName={getRowClassName}
        disableColumnMenu
        disableColumnFilter
        disableColumnSorting
        disableRowSelectionOnClick
      />
    </Box>
  );
}