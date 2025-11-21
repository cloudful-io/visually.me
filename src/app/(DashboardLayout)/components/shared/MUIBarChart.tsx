import { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

type DataKeyOption<T> = {
  key: keyof T;
  label: string;
};

type Props<T extends Record<string, any>> = {
  data: T[];
  dataKeys: DataKeyOption<T>[]; 
  xKey: keyof T;
  title: string;
  height?: number;
  stacked?: boolean;
};

export function MUIBarChart<T extends Record<string, any>>({
  data,
  dataKeys,
  xKey,
  title,
  height = 300,
  stacked = false,
}: Props<T>) {
  const theme = useTheme();

  // Only used if NOT stacked:
  const [selectedKey, setSelectedKey] = useState<DataKeyOption<T>>(dataKeys[0]);

  const xAxisData = data.map((item) => String(item[xKey] ?? ''));

  // -------------------------------
  // MULTI-SERIES STACKED VERSION
  // -------------------------------
  const series = stacked
    ? dataKeys.map((opt) => ({
        id: String(opt.key),
        label: opt.label,
        stack: 'income',                
        data: data.map((row) => {
          const v = row[opt.key];
          return typeof v === "number" ? v : 0;
        }),
      }))
    : [
        {
          id: String(selectedKey.key),
          label: selectedKey.label,
          data: data.map((row) =>
            typeof row[selectedKey.key] === 'number'
              ? row[selectedKey.key]
              : 0
          ),
        },
      ];

  return (
    <Box mt={4} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {!stacked && dataKeys.length > 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={selectedKey.key}
            onChange={(e, value) => {
              if (!value) return;
              const found = dataKeys.find((k) => k.key === value);
              if (found) setSelectedKey(found);
            }}
          >
            {dataKeys.map((opt) => (
              <ToggleButton key={String(opt.key)} value={opt.key}>
                {opt.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}

      <BarChart
        borderRadius={8}
        xAxis={[{ id: String(xKey), data: xAxisData }]}
        yAxis={[{ width: 100 }]}
        series={series}
        height={height}
        colors={
          stacked
            ? undefined // let MUI auto-generate multiple colors
            : [theme.palette.primary.main] // single color for non-stacked
        }
      />
    </Box>
  );
}
