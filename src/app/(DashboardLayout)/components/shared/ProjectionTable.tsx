import React, { useState } from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack } from "@mui/material";

export type ColumnDef<T, K extends keyof T = keyof T> = {
  key: keyof T | string;
  label: string;
  currency?: boolean;
  editable?: boolean;
  editor?: (
    value: any,
    row: T,
    onChange: (newValue: T[K] | undefined) => void
  ) => React.ReactNode;
};

type ProjectionTableProps<T extends { year: number }> = {
  rows: T[];
  columns: ColumnDef<T>[];
  highlightYear?: number;
  onRowEditSave?: (year: number, patch: Partial<T>) => void;
  onRowEditChange?: (year: number, patch: Partial<T>) => void;
  onRemoveOverride?: (year: number) => void;
};

// -----------------------
// Action Buttons Component
// -----------------------
function ActionButtons<T extends { year: number }>({
  row,
  isEditing,
  startEditingRow,
  stopEditingRow,
  handleSaveRow,
  onRemoveOverride,
}: {
  row: T;
  isEditing: boolean;
  startEditingRow: (year: number) => void;
  stopEditingRow: (year: number) => void;
  handleSaveRow: (row: T) => void;
  onRemoveOverride?: (year: number) => void;
}) {
  return isEditing ? (
    <Stack direction="row" spacing={1}>
      <Button size="small" variant="contained" onClick={() => handleSaveRow(row)}>
        Save
      </Button>
      <Button size="small" variant="outlined" onClick={() => stopEditingRow(row.year)}>
        Cancel
      </Button>
    </Stack>
  ) : (
    <Stack direction="row" spacing={1}>
      <Button size="small" variant="outlined" onClick={() => startEditingRow(row.year)}>
        Edit
      </Button>
      {"hasOverride" in row && row.hasOverride ? (
        <Button
          size="small"
          variant="outlined"
          onClick={() => onRemoveOverride?.(row.year)}
        >
          Revert
        </Button>
      ) : null}
    </Stack>
  );
}

// -----------------------
// Table Row Component
// -----------------------
function TableRowComponent<T extends { year: number }>({
  row,
  columns,
  highlightYear,
  editingRows,
  startEditingRow,
  stopEditingRow,
  handleSaveRow,
  handleCellChange,
  formatCellValue,
  hasEditableColumn,
  onRemoveOverride,
}: {
  row: T;
  columns: ColumnDef<T>[];
  highlightYear?: number;
  editingRows: Record<number, boolean>;
  startEditingRow: (year: number) => void;
  stopEditingRow: (year: number) => void;
  handleSaveRow: (row: T) => void;
  handleCellChange: (row: T, key: keyof T, newValue: any) => void;
  formatCellValue: (value: any, currency?: boolean) => string;
  hasEditableColumn: boolean;
  onRemoveOverride?: (year: number) => void;
}) {
  const isEditing = editingRows[row.year] ?? false;

  return (
    <TableRow
      sx={(theme) => ({
        ...(row.year === highlightYear ? { backgroundColor: "action.selected" } : {}),
        ...("hasOverride" in row && row.hasOverride
          ? { borderLeft: `4px solid ${theme.palette.warning.main}` }
          : {}),
      })}
    >
      {columns.map((col) => {
        const key = col.key as keyof T;
        const cellValue = row[key];

        if (col.editable && col.editor && isEditing) {
          return (
            <TableCell key={String(col.key)}>
              {col.editor(cellValue, row, (newValue) => handleCellChange(row, key, newValue))}
            </TableCell>
          );
        }

        return <TableCell key={String(col.key)}>{formatCellValue(cellValue, col.currency)}</TableCell>;
      })}

      {hasEditableColumn && (
        <TableCell>
          <ActionButtons
            row={row}
            isEditing={isEditing}
            startEditingRow={startEditingRow}
            stopEditingRow={stopEditingRow}
            handleSaveRow={handleSaveRow}
            onRemoveOverride={onRemoveOverride}
          />
        </TableCell>
      )}
    </TableRow>
  );
}

// -----------------------
// Main Projection Table
// -----------------------
export function ProjectionTable<T extends { year: number }>({
  rows,
  columns,
  highlightYear,
  onRowEditSave,
  onRowEditChange,
  onRemoveOverride,
}: ProjectionTableProps<T>) {
  const [editingRows, setEditingRows] = useState<Record<number, boolean>>({});
  const [editCache, setEditCache] = useState<Record<number, Partial<T>>>({});
  const hasEditableColumn = columns.some((c) => c.editable);

  const startEditingRow = (year: number) => setEditingRows((prev) => ({ ...prev, [year]: true }));
  const stopEditingRow = (year: number) => setEditingRows((prev) => ({ ...prev, [year]: false }));

  const handleSaveRow = (row: T) => {
    const patch = editCache[row.year] || {};
    onRowEditSave?.(row.year, patch);
    setEditCache((prev) => {
      const next = { ...prev };
      delete next[row.year];
      return next;
    });
    stopEditingRow(row.year);
  };

  const handleCellChange = (row: T, key: keyof T, newValue: any) => {
    setEditCache((prev) => ({
      ...prev,
      [row.year]: { ...prev[row.year], [key]: newValue },
    }));
    onRowEditChange?.(row.year, { [key]: newValue } as Partial<T>);
  };

  const formatCellValue = (value: any, currency?: boolean) => {
    if (value === null || value === undefined) return "";
    if (currency && typeof value === "number") {
      return value.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const hasAnyOverride = rows.some((r) => "hasOverride" in r && (r as any).hasOverride);

  return (
    <>
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
          Rows marked with a left border have user-entered overrides.
        </Paper>
      )}

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.key)} sx={{ fontWeight: "bold" }}>
                  {col.label}
                </TableCell>
              ))}
              {hasEditableColumn && <TableCell sx={{ fontWeight: "bold" }} />}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, i) => (
              <TableRowComponent
                key={`${row.year}-${i}`}
                row={row}
                columns={columns}
                highlightYear={highlightYear}
                editingRows={editingRows}
                startEditingRow={startEditingRow}
                stopEditingRow={stopEditingRow}
                handleSaveRow={handleSaveRow}
                handleCellChange={handleCellChange}
                formatCellValue={formatCellValue}
                hasEditableColumn={hasEditableColumn}
                onRemoveOverride={onRemoveOverride}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
