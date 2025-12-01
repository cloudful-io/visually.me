import React, { useState } from "react";
import {
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button,
} from "@mui/material";

export type ColumnDef<T, K extends keyof T = keyof T> = {
  key: keyof T | string;
  label: string;
  currency?: boolean;
  editable?: boolean;
  editor?: (
    value: T[K] | undefined,
    row: T,
    onChange: (newValue: T[K] | undefined) => void
  ) => React.ReactNode;
};

export function ProjectionTable<T extends { year: number }>({
  rows,
  columns,
  highlightYear,
  onRowEditSave,
  onRowEditChange,
}: {
  rows: T[];
  columns: ColumnDef<T>[];
  highlightYear?: number;
  onRowEditSave?: (year: number, patch: Partial<T>) => void;
  onRowEditChange?: (year: number, patch: Partial<T>) => void;
}) {
  const [editingRows, setEditingRows] = useState<Record<number, boolean>>({});
  const hasEditableColumn = columns.some(col => col.editable);

  const startEditingRow = (year: number) => {
    setEditingRows(prev => ({ ...prev, [year]: true }));
  };

  const stopEditingRow = (year: number) => {
    setEditingRows(prev => ({ ...prev, [year]: false }));
  };

  const handleSaveRow = (row: T) => {
    if (onRowEditSave) {
      const patch: Partial<T> = { ...row };
      onRowEditSave(row.year, patch);
    }
    stopEditingRow(row.year);
  };

  const handleCancelRow = (row: T) => {
    stopEditingRow(row.year);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={String(col.key)} sx={{ fontWeight: 'bold' }}>
                {col.label}
              </TableCell>
            ))}
            {hasEditableColumn && <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, i) => {
            const isEditing = editingRows[row.year] ?? false;

            return (
              <TableRow
                key={i}
                sx={row.year === highlightYear ? { backgroundColor: 'action.selected' } : {}}
              >
                {columns.map(col => {
                  const key = col.key as keyof T;
                  const cellValue = row[key];

                  if (col.editable && col.editor && isEditing) {
                    return (
                      <TableCell key={String(col.key)}>
                        {col.editor(cellValue, row, (newValue) => {
                          if (onRowEditChange) {
                            onRowEditChange(row.year, { [col.key]: newValue } as Partial<T>);
                          }
                        })}
                      </TableCell>
                    );
                  }

                  // Display value
                  let displayValue: React.ReactNode;
                  if (typeof cellValue === 'number' && col.currency) {
                    displayValue = cellValue.toLocaleString(undefined, {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    });
                  } else if (cellValue === null || cellValue === undefined) {
                    displayValue = '';
                  } else if (typeof cellValue === 'object') {
                    try {
                      displayValue = JSON.stringify(cellValue);
                    } catch {
                      displayValue = String(cellValue);
                    }
                  } else {
                    displayValue = String(cellValue);
                  }

                  return <TableCell key={String(col.key)}>{displayValue}</TableCell>;
                })}

                {hasEditableColumn && (
                  <TableCell>
                    {isEditing ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ mr: 1 }}
                          onClick={() => handleSaveRow(row)}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          onClick={() => handleCancelRow(row)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="small" variant="outlined" onClick={() => startEditingRow(row.year)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
