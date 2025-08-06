import {
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';

export function ProjectionTable({ rows, columns, highlightYear }: {
  rows: any[];
  columns: { key: string; label: string; currency?: boolean }[];
  highlightYear?: number;
}) {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={row.year === highlightYear ? { backgroundColor: 'action.selected' } : {}}
            >
              {columns.map(col => (
                <TableCell key={col.key}>
                  {typeof row[col.key] === 'number' && col.currency
                    ? row[col.key].toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
                    : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}