"use client";
import { Typography } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { PieChart } from "@mui/x-charts/PieChart";
import { currencyFormatter } from "@/lib/formatters/currency";

export function InvestmentBreakdown({
  combined,
  computedSources,
  targetAge,
}: {
  combined: Array<any>;
  computedSources: Array<{ id: string; label: string; type: string }>;
  targetAge: number;
}) {
  // Find the combined row for the selected age
  const row = combined.find((r) => r.age === targetAge);
  if (!row) return null;

  // Build breakdown data
  const data = computedSources
    .map((src, idx) => ({
      id: src.id,
      label: src.label,
      value: Math.round(row.balances?.[src.id] ?? 0),
    }))
    .filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <DashboardCard title={`Investment Breakdown at Age ${targetAge}`}>
      {data.length === 0 ? (
        <Typography>No investment balances at this age.</Typography>
      ) : (
        <PieChart
          height={170}
          width={170}
          series={[
            {
              data,
              innerRadius: 30,
              outerRadius: 70,
              arcLabel: (item) =>
                `${((item.value / total) * 100).toFixed(0)}%`,
              valueFormatter: (item) => currencyFormatter(item.value),
            },
          ]}
        />
      )}
    </DashboardCard>
  );
}
