"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { LineSeries } from "@mui/x-charts/LineChart";
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { useTheme } from "@mui/material/styles";
import { currencyFormatter } from "@/lib/formatters/currency";

export type DataKeyOption<T> = {
  key: T extends any ? keyof T : never;
  label: string;
};

type YearRange = 5 | 10 | 25 | "all";

type Props<T extends Record<string, any>> = {
  data: T[];
  xKey: keyof T;
  title: string;
  dataKeys: DataKeyOption<T>[];  
  height?: number;
  yLabel?: string;

  enableRangeFilter?: boolean;
  defaultRange?: YearRange;
  showFutureYearOnly?: boolean;
  retirementX?: number;
};

export function MUILineChart<T extends Record<string, any>>(props: Props<T>) {
  const {
    data,
    xKey,
    title,
    dataKeys,
    height = 300,
    yLabel,
    enableRangeFilter = false,
    defaultRange,
    showFutureYearOnly = true,
    retirementX,
  } = props;

  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // default to first dataKey
  const [selectedKey, setSelectedKey] = useState<DataKeyOption<T>>(dataKeys[0]);

  // Range state
  const [range, setRange] = useState<YearRange>(() => {
    if (defaultRange) return defaultRange;
    return isMobile ? 10 : "all";
  });

  const baseData =
    xKey === "year" && showFutureYearOnly
      ? data.filter((row) => {
          const year = Number(row[xKey]);
          return !Number.isNaN(year) && year >= currentYear;
        })
      : data;
      
  // Filter data by range
  const filteredData =
    range === "all" || !enableRangeFilter ? baseData : baseData.slice(0, range);

  const xAxisData = filteredData.map((item) => Number(item[xKey] ?? 0));

  const series: LineSeries[] = [
    {
      id: String(selectedKey.key),
      label: selectedKey.label,
      data: filteredData.map((row) =>
        typeof row[selectedKey.key] === "number" ? Math.round(row[selectedKey.key]) : 0
      ),
      curve: "monotoneX",
      valueFormatter: currencyFormatter,
    },
  ];

  const ranges: YearRange[] = [5, 10, 25, "all"];

  return (
    <Box mt={4} sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Controls */}
      {(enableRangeFilter || dataKeys.length > 1) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 1,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {/* Metric selector */}
          {dataKeys.length > 1 && (
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
                sx={{ mr: 1 }}
              >
                {ranges.map((r) => (
                  <ToggleButton key={r} value={r} sx={{ px: 1.5 }}>
                    {typeof r === "number" ? `${r}Y` : "All"}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}
        </Box>
      )}

      <LineChart
        height={height}
        series={series}
        xAxis={[{ data: xAxisData }]}
        yAxis={[
          {
            width: 120,
            label: yLabel ?? selectedKey.label ?? undefined,
            valueFormatter: currencyFormatter,
          },
        ]}
        colors={[theme.palette.primary.main]}
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
      </LineChart>
    </Box>
  );
}
