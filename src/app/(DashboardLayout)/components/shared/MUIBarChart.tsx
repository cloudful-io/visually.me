import { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

type DataKeyOption<T> = {
  key: T extends any ? keyof T : never;
  label: string;
};

type Props<T extends Record<string, any>> = {
  data: T[];
  dataKeys: DataKeyOption<T>[];   
  xKey: keyof T;
  title: string;
  height?: number;
};

export function MUIBarChart<T extends Record<string, any>>({
  data,
  dataKeys,
  xKey,
  title,
  height = 300,
}: Props<T>) {
  const theme = useTheme();

  // If multiple dataKeys passed → default to first one
  const [selectedKey, setSelectedKey] = useState<DataKeyOption<T>>(dataKeys[0]);

  return (
    <Box mt={4} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {dataKeys.length > 1 && (
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
        xAxis={[
          {
            id: String(xKey),
            data: data.map((item) => String(item[xKey] ?? '')),
          },
        ]}
        yAxis={[
          {
            label: selectedKey.label, 
            width: 100,
          },
        ]}
        series={[
          {
            data: data.map((item) =>
              typeof item[selectedKey.key] === 'number'
                ? item[selectedKey.key]
                : 0
            ),
          },
        ]}
        height={height}
        colors={[theme.palette.primary.main]}
      />
    </Box>
  );
}
