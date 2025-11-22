"use client";

import { useState } from "react";
import { Box, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { LineSeries } from '@mui/x-charts/LineChart';
import { useTheme } from "@mui/material/styles";

export type DataKeyOption<T> = {
  key: T extends any ? keyof T : never;
  label: string;
};

type Props<T extends Record<string, any>> = {
  data: T[];
  xKey: keyof T;
  title: string;
  dataKeys: DataKeyOption<T>[];  // required, but can contain 1 or 2 keys
  height?: number;
};

export function MUILineChart<T extends Record<string, any>>(props: Props<T>) {
  const { data, xKey, title, dataKeys, height = 300 } = props;

  const theme = useTheme();

  // default to first dataKey
  const [selectedKey, setSelectedKey] = useState<DataKeyOption<T>>(dataKeys[0]);

  const xAxisData = data.map((item) => String(item[xKey] ?? ""));

const series: LineSeries[] = [
  {
    id: String(selectedKey.key),
    label: selectedKey.label,
    data: data.map((row) =>
      typeof row[selectedKey.key] === "number" ? row[selectedKey.key] : 0
    ),
     curve: 'monotoneX', 
  },
];

  return (
    <Box mt={4} sx={{ width: "100%" }}>
      {/* Toggle only if multiple keys */}
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

      <LineChart
        height={height}
        series={series}
        xAxis={[{ data: xAxisData }]}
        yAxis={[{ width: 80 }]}
        colors={[theme.palette.primary.main]}
      />
    </Box>
  );
}
