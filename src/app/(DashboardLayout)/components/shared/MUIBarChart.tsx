import { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { currencyFormatter } from "@/lib/formatters/currency";
import { DataKeyOption } from '@/types/forms';

type YearRange = 5 | 10 | 25 | 'all';

type Props<T extends Record<string, any>> = {
  data: T[];
  xKey: keyof T;
  title: string;
  dataKeys: DataKeyOption<T>[];
  height?: number;
  stacked?: boolean;
  yLabel?: string;

  /** NEW (optional) */
  enableRangeFilter?: boolean;
  defaultRange?: YearRange;
};

export function MUIBarChart<T extends Record<string, any>>(props: Props<T>) {
  const {
    data,
    xKey,
    title,
    height = 300,
    stacked = false,
    dataKeys,
    yLabel,
    enableRangeFilter = false,
    defaultRange,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedKey, setSelectedKey] = useState(dataKeys[0]);

  const [range, setRange] = useState<YearRange>(() => {
    if (defaultRange) return defaultRange;
    return isMobile ? 10 : 'all';
  });

  /* -------------------------
     Filter data by range
  -------------------------- */
  const filteredData =
    range === 'all'
      ? data
      : data.slice(0, range);

  const xAxisData = filteredData.map((item) =>
    String(item[xKey] ?? '')
  );

  const series = stacked
    ? dataKeys.map((opt) => ({
        id: String(opt.key),
        label: opt.label,
        stack: 'stack',
        data: filteredData.map((row) =>
          typeof row[opt.key] === 'number'
            ? Math.round(row[opt.key])
            : 0
        ),
        valueFormatter: currencyFormatter,
      }))
    : [
        {
          id: String(selectedKey.key),
          label: selectedKey.label,
          data: filteredData.map((row) =>
            typeof row[selectedKey.key] === 'number'
              ? Math.round(row[selectedKey.key])
              : 0
          ),
          valueFormatter: currencyFormatter,
        },
      ];

  const ranges: YearRange[] = [5, 10, 25, 'all'];

  return (
    <Box mt={4} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Controls */}
      {(enableRangeFilter || (!stacked && dataKeys.length > 1)) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {/* Range selector */}
          {enableRangeFilter && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <ToggleButtonGroup  
                size="small"
                exclusive
                value={range}
                onChange={(_, value) => value && setRange(value)}
              >
                {ranges.map((r) => (
                  <ToggleButton key={r} value={r} sx={{ px: 1.5 }}>
                    {typeof r === 'number' ? `${r}Y` : 'All'}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Metric selector */}
          {!stacked && dataKeys.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={selectedKey.key}
              onChange={(_, value) => {
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
        </Box>
      )}

      <BarChart
        borderRadius={8}
        xAxis={[
          {
            id: String(xKey),
            data: xAxisData,
          },
        ]}
        yAxis={[
          {
            width: 120,
            label: yLabel ?? selectedKey?.label ?? undefined,
            valueFormatter: currencyFormatter,
          },
        ]}
        series={series}
        height={height}
        colors={
          stacked
            ? undefined
            : [theme.palette.primary.light]
        }
      />
    </Box>
  );
}
