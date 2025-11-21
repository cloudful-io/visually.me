import { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

type DataKeyOption<T> = {
  key: keyof T;
  label: string;
};

type BaseProps<T extends Record<string, any>> = {
  data: T[];
  xKey: keyof T;
  title: string;
  height?: number;
  stacked?: boolean;
  overrideSeries?: {
    id: string;
    label: string;
    data: number[];
    stack?: string;
  }[];
};

/** 
 * Two valid prop shapes:
 * 
 * 1) DEFAULT MODE (income charts):
 *    - dataKeys REQUIRED
 *    - overrideSeries NOT required
 *
 * 2) OVERRIDE MODE (balance view):
 *    - overrideSeries REQUIRED
 *    - dataKeys should NOT be required
 */
type Props<T extends Record<string, any>> =
  | (BaseProps<T> & {
      overrideSeries?: undefined;
      dataKeys: DataKeyOption<T>[];
    })
  | (BaseProps<T> & {
      overrideSeries: {
        id: string;
        label: string;
        data: number[];
        stack?: string;
      }[];
      dataKeys?: DataKeyOption<T>[]; // ignored in override mode
    });

export function MUIBarChart<T extends Record<string, any>>(props: Props<T>) {
  const {
    data,
    xKey,
    title,
    height = 300,
    stacked = false,
    overrideSeries,
  } = props;

  const dataKeys = props.dataKeys ?? []; // may not exist in override mode
  const theme = useTheme();

  const [selectedKey, setSelectedKey] = useState(
    dataKeys.length > 0 ? dataKeys[0] : null
  );

  const xAxisData = data.map((item) => String(item[xKey] ?? ''));

  // ----------- SERIES LOGIC -------------
  const series = overrideSeries
    ? overrideSeries
    : stacked
    ? dataKeys.map((opt) => ({
        id: String(opt.key),
        label: opt.label,
        stack: 'income',
        data: data.map((row) =>
          typeof row[opt.key] === 'number' ? row[opt.key] : 0
        ),
      }))
    : selectedKey
    ? [
        {
          id: String(selectedKey.key),
          label: selectedKey.label,
          data: data.map((row) =>
            typeof row[selectedKey.key] === 'number' ? row[selectedKey.key] : 0
          ),
        },
      ]
    : [];

  return (
    <Box mt={4} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>

      {!overrideSeries &&
        !stacked &&
        dataKeys.length > 1 &&
        selectedKey && (
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
        yAxis={[{ width: 100 }]}
        series={series}
        height={height}
        colors={
          overrideSeries || stacked
            ? undefined
            : [theme.palette.primary.main]
        }
      />
    </Box>
  );
}
