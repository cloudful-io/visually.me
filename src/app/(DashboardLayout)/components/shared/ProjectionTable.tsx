import React, { useState } from "react";
import {
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack
} from "@mui/material";

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

export function ProjectionTable<T extends { year: number }>({
  rows,
  columns,
  highlightYear,
  onRowEditSave,
  onRowEditChange,
  onRemoveOverride,
}: {
  rows: T[];
  columns: ColumnDef<T>[];
  highlightYear?: number;
  onRowEditSave?: (year: number, patch: Partial<T>) => void;
  onRowEditChange?: (year: number, patch: Partial<T>) => void;
  onRemoveOverride?: (year:number) => void;
}) {
  const [editingRows, setEditingRows] = useState<Record<number, boolean>>({});
  const [editCache, setEditCache] = useState<Record<number, Partial<T>>>({});
  const hasEditableColumn = columns.some(col => col.editable);

  const startEditingRow = (year: number) => {
    setEditingRows(prev => ({ ...prev, [year]: true }));
  };

  const stopEditingRow = (year: number) => {
    setEditingRows(prev => ({ ...prev, [year]: false }));
  };

  const handleSaveRow = (row: T) => {
    const patch = editCache[row.year] || {};
    if (onRowEditSave) {
      onRowEditSave(row.year, patch);
    }

    // Clear the cache for this row
    setEditCache(prev => {
      const next = { ...prev };
      delete next[row.year];
      return next;
    });

    stopEditingRow(row.year);
  };

  const handleCancelRow = (row: T) => {
    stopEditingRow(row.year);
  };

  const hasAnyOverride = rows.some(
    (r) => "hasOverride" in r && (r as any).hasOverride
  );
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
              {columns.map(col => (
                <TableCell key={String(col.key)} sx={{ fontWeight: 'bold' }}>
                  {col.label}
                </TableCell>
              ))}
              {hasEditableColumn && <TableCell sx={{ fontWeight: 'bold' }}>{ }</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, i) => {
              const isEditing = editingRows[row.year] ?? false;

              return (
                <TableRow
                  key={i}
                  sx={(theme) => ({
                  ...(row.year === highlightYear
                    ? { backgroundColor: 'action.selected' }
                    : {}),
                  ...("hasOverride" in row && row.hasOverride
                    ? { borderLeft: `4px solid ${theme.palette.warning.main}` } 
                    : {}),
                })}
                >
                  {columns.map(col => {
                    const key = col.key as keyof T;
                    const cellValue = row[key];

                    if (col.editable && col.editor && isEditing) {
                      return (
                        <TableCell key={String(col.key)}>
                          {col.editor(cellValue, row, (newValue) => {
                            setEditCache(prev => ({
                              ...prev,
                              [row.year]: {
                                ...prev[row.year],
                                [col.key]: newValue
                              }
                            }));

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
                            color="primary"
                            onClick={() => handleCancelRow(row)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="outlined" onClick={() => startEditingRow(row.year)}>
                            Edit
                          </Button>
                          {"hasOverride" in row && row.hasOverride ? (
                            <Button size="small" variant="outlined" onClick={() => onRemoveOverride?.(row.year)}>
                              Revert
                            </Button>
                          ) : null}
                          </Stack>
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
