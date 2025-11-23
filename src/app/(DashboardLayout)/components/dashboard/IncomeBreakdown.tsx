"use client";
import { Typography } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { PieChart } from "@mui/x-charts/PieChart";
import { currencyFormatter } from "@/lib/formatters/currency";

export function IncomeBreakdown({
  combined,
  computedSources,
  targetAge,
}: {
  combined: Array<any>;
  computedSources: Array<{ id: string; label: string; type: string }>;
  targetAge: number;
}) {
  // Find the row for the selected age
  const row = combined.find((r) => r.age === targetAge);
  if (!row) return null;

  // Build breakdown data
  const data = computedSources
    .map((src, idx) => ({
      id: src.id,
      label: src.label,
      value: Math.round(row.sources?.[src.id] ?? 0),
    }))
    .filter((d) => d.value > 0);

  const usd = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <DashboardCard title={`Income Breakdown at Age ${targetAge}`}>
      {data.length === 0 ? (
        <Typography>No income sources at this age.</Typography>
      ) : (
        <PieChart
          height={170}
          width={170}
          series={[
            {
              data,
              arcLabel: (item) =>
                `${((item.value /
                  data.reduce((s, d) => s + d.value, 0)) *
                  100
                ).toFixed(0)}%`,
              innerRadius: 30,
              outerRadius: 70,
              valueFormatter: (item) => currencyFormatter(item.value),
            },
          ]}
          
        />
      )}
    </DashboardCard>
  );
}
