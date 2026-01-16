import { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from '@mui/material';
import { BarChart  } from '@mui/x-charts/BarChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { useTheme } from '@mui/material/styles';
import { currencyFormatter, shortCurrencyFormatter } from "@/lib/formatters/currency";
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
  enableRangeFilter?: boolean;
  defaultRange?: YearRange;
  disableMetricToggle?: boolean;
  showFutureYearOnly?: boolean;
  retirementX?: number;
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
    disableMetricToggle = false,
    showFutureYearOnly = true,
    retirementX,
  } = props;

  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedKey, setSelectedKey] = useState(dataKeys[0]);

  const [range, setRange] = useState<YearRange>(() => {
    if (defaultRange) return defaultRange;
    return isMobile ? 10 : 'all';
  });

  const baseData =
    xKey === "year" && showFutureYearOnly
      ? data.filter((row) => {
          const year = Number(row[xKey]);
          return !Number.isNaN(year) && year >= currentYear;
        })
      : data;

  /* -------------------------
     Filter data by range
  -------------------------- */
  const filteredData =
    range === 'all' || !enableRangeFilter
      ? baseData
      : baseData.slice(0, range);

  const xAxisData = filteredData.map((item) =>
    String(item[xKey] ?? '')
  );

  const series = stacked  || disableMetricToggle
    ? dataKeys.map((opt) => ({
        id: String(opt.key),
        label: opt.label,
        ...(stacked ? { stack: 'stack' } : {}),
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
          {/* Metric selector */}
          {!stacked && dataKeys.length > 1 && !disableMetricToggle && (
            <Box sx={{ display: 'flex', justifyContent: { xs: "stretch", md: "flex-end" }, width: '100%' }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={selectedKey.key}
              sx={{
                width: { xs: "100%", md: "auto" },
              }}
              onChange={(_, value) => {
                if (!value) return;
                const found = dataKeys.find((k) => k.key === value);
                if (found) setSelectedKey(found);
              }}
            >
              {dataKeys.map((opt) => (
                <ToggleButton key={String(opt.key)} value={opt.key} sx={{ px: 1.5, flex: { xs: 1, md: "initial" } }}>
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            </Box>
          )}

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
        </Box>
      )}

      <BarChart
        grid={{ horizontal: true }}
        borderRadius={8}
        xAxis={[
          {
            id: String(xKey),
            data: xAxisData,
          },
        ]}
        yAxis={[
          {
            width: 80,
            label: yLabel ?? selectedKey?.label ?? undefined,
            valueFormatter: shortCurrencyFormatter,
          },
        ]}
        series={series}
        height={height}
        colors={
          stacked || disableMetricToggle
            ? undefined
            : [theme.palette.primary.light]
        }
      >
        {retirementX !== undefined && filteredData.some(row => String(row[xKey]) === String(retirementX)) && (
          <ChartsReferenceLine
            x={String(retirementX)}
            label="Target Retirement"
            labelAlign="start"
            labelStyle={{ fontWeight: 600 }}
            lineStyle={{
              stroke: theme.palette.secondary.main,
              strokeWidth: 2,          
              strokeDasharray: '6 4',
            }}
          />
        )}
      </BarChart>
    </Box>
  );
}
