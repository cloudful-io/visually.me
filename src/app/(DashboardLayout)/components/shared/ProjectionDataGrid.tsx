"use client";
import * as React from "react";
import { Box, Button, Paper } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowClassNameParams,
} from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";
import { currencyFormatter } from "@/lib/formatters/currency";
import { ColumnDef } from '@/types/forms';

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
  const hasAnyOverride = rows.some((row) => "hasOverride" in row && row.hasOverride);

  const muiColumns = React.useMemo<GridColDef[]>(() => {
    const cols: GridColDef[] = columns.map((col) => ({
      field: col.key as string,
      headerName: col.label,
      minWidth: (col.label.length < 5) ? 60 : (isMobile ? 100 : 120),
      headerClassName: col.editable ? "editable-column-header" : "",
      description: col.description ?? col.label,
      editable: col.editable ?? false,
      flex: 1,
      valueFormatter: (value: any) => {
        if (value == null) return "";
        return col.currency
          ? currencyFormatter(value)
          : value;
      },
      preProcessEditCellProps: (params) => {
        const raw = params.props.value;
        const value = Number(raw);

        const isNotNumber = raw === "" || Number.isNaN(value);

        const hasError =
          isNotNumber ||
          (col.min != null && value < col.min) ||
          (col.max != null && value > col.max);

        return { ...params.props, error: hasError };
      },
      renderCell: (params) => {
        const value = params.value;

        if (value == null) return "";

        const isDiff = col.isDifference && typeof value === "number";

        const color = isDiff
          ? value > 0
            ? theme.palette.success.main
            : value < 0
            ? theme.palette.error.main
            : theme.palette.text.primary
          : theme.palette.text.primary;

        const displayValue = col.currency
          ? currencyFormatter(value)
          : value;

        return (
          <Box
            component="span"
            sx={{
              color,
              fontWeight: isDiff ? 600 : 400,
            }}
          >
            {displayValue}
          </Box>
        );
      },


    }));

    // Action column
    if (hasAnyOverride) {
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
    }

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
    <Box sx={{ width: '100%' }}>
      {hasAnyOverride && (
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: 1.5,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            fontSize: "0.9rem",
            borderLeft: `4px solid ${theme.palette.warning.main}`,
            backgroundColor: theme.palette.action.hover,
          })}
        >
          Rows marked with a left border have user-entered values.
        </Paper>
      )}
      {columns.some(c => c.editable) && (
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: 1.5,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            fontSize: "0.9rem",
            borderLeft: `4px solid ${theme.palette.info.main}`,
            backgroundColor: theme.palette.action.hover,
          })}
        >
          Editable column(s):&nbsp;
          <strong>
            {columns
              .filter(c => c.editable)
              .map(c => c.label)
              .join(", ")}
          </strong>
        </Paper>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          sx={{
            borderColor: 'divider', 
            boxShadow: 1,
            "& .MuiDataGrid-row": {
              "&.highlight-year": { bgcolor: theme.palette.action.selected },
              "&.override-row": { borderLeft: `4px solid ${theme.palette.warning.main}` },
            },
            "& .MuiDataGrid-columnHeaders .editable-column-header": {
              borderTop: `4px solid ${theme.palette.info.main}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: theme.palette.background.paper, 
            },
            "& .MuiDataGrid-virtualScroller": {
              maxHeight: "575px",     // roughly 10 rows of data
              overflow: "auto",
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
      </div>
    </Box>
  );
}