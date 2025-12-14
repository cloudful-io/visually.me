import { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { currencyFormatter } from "@/lib/formatters/currency";
import { DataKeyOption } from '@/types/forms';

type Props<T extends Record<string, any>> = {
  data: T[];
  xKey: keyof T;
  title: string;
  dataKeys: DataKeyOption<T>[];  
  height?: number;
  stacked?: boolean;
  yLabel?: string;
};

export function MUIBarChart<T extends Record<string, any>>(props: Props<T>) {
  const { data, xKey, title, height = 300, stacked = false, dataKeys, yLabel } = props;

  const theme = useTheme();
  const [selectedKey, setSelectedKey] = useState(dataKeys[0]);

  const xAxisData = data.map((item) => String(item[xKey] ?? ''));

  const series = stacked
    ? dataKeys.map((opt) => ({
        id: String(opt.key),
        label: opt.label,
        stack: 'stack',
        data: data.map((row) =>
          typeof row[opt.key] === 'number' ? Math.round(row[opt.key]) : 0
        ),
        valueFormatter: currencyFormatter
      }))
    : [
        {
          id: String(selectedKey.key),
          label: selectedKey.label,
          data: data.map((row) =>
            typeof row[selectedKey.key] === 'number'
              ? Math.round(row[selectedKey.key])
              : 0
          ),
          valueFormatter: currencyFormatter
        },
      ];

  

  return (
    <Box mt={4} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Toggle only if NOT stacked + multiple keys */}
      {!stacked && dataKeys.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        yAxis={[{ 
          width: 120, 
          label: yLabel ?? selectedKey?.label ?? undefined,
          valueFormatter: currencyFormatter
        }]}
        series={series}
        height={height}
        colors={
          stacked
            ? undefined              
            : [theme.palette.primary.main] 
        }
      />
    </Box>
  );
}
