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
import { currencyFormatter, shortCurrencyFormatter } from "@/lib/formatters/currency";

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
  retirementX?: { year: number; label: string; position: "start" | "middle" | "end"; color?: string;  }[];
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

  const xAxisData = filteredData.map((item) => String(item[xKey] ?? ''));

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
        grid={{ horizontal: true }}
        height={height}
        series={series}
        xAxis={[
          {
            id: String(xKey),
            data: xAxisData,
            valueFormatter: (value: number) => value.toString()
          },
        ]}
        yAxis={[
          {
            width: 80,
            label: yLabel ?? selectedKey.label ?? undefined,
            valueFormatter: shortCurrencyFormatter,
          },
        ]}
        colors={[theme.palette.primary.main]}
      >
        {retirementX && (
          Array.isArray(retirementX) ? retirementX : [{ year: retirementX, label: "Target Retirement", position: retirementX, color: theme.palette.primary.main }])
            .map(({ year, label, position, color }, index) =>
              filteredData.some(row => String(row[xKey]) === String(year)) && (
              <ChartsReferenceLine
                key={`${year}-${label}-${index}`}
                x={String(year)}
                label={label}
                labelAlign={position}
                labelStyle={{ fontWeight: 600 }}
                lineStyle={{
                  stroke: color ?? theme.palette.secondary.main,
                  strokeWidth: 2,
                  strokeDasharray: '6 4',
                }}
              />
            )
          )}
      </LineChart>
    </Box>
  );
}
