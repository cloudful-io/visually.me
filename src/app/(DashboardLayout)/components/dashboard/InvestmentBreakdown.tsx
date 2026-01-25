"use client";
import { Typography, Tooltip, IconButton, FormControl, MenuItem, Select, InputLabel, Box } from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { PieChart } from "@mui/x-charts/PieChart";
import { currencyFormatter } from "@/lib/formatters/currency";
import { PieCenterLabel } from "./PieCenterLabel";

export function InvestmentBreakdown({
  combined,
  computedSources,
  targetAge,
  onAgeChange,
  targetRetirementAge,
}: {
  combined: Array<any>;
  computedSources: Array<{ id: string; label: string; type: string }>;
  targetAge: number;
  onAgeChange: (age: number) => void;
  targetRetirementAge: number;
}) {
  const ages = combined.map((r) => r.age);
  const safeTargetAge = ages.includes(targetAge) ? targetAge : "";

  // Find the combined row for the selected age
  const row = combined.find((r) => r.age === targetAge);
  if (!row) return null;

  const balance = Math.round(row?.annualInvestmentBalance ?? 0);

  // Compare to year before retirement
  const comparisonAge = targetRetirementAge - 1;
  const prior = combined.find((r) => r.age === comparisonAge);
  const priorBalance = prior ? Math.round(prior.annualInvestmentBalance ?? 0) : null;

  const diff = priorBalance != null ? balance - priorBalance : null;
  const diffPositive = diff != null && diff >= 0;

  const pctDiff =
    priorBalance != null && priorBalance !== 0
      ? ((balance - priorBalance) / priorBalance) * 100
      : null;

  // Build breakdown data
  const data = computedSources
    .map((src, idx) => ({
      id: src.id,
      label: src.label,
      value: Math.round(row.balances?.[src.id] ?? 0),
    }))
    .filter((d) => d.value > 0);

  return (
    <DashboardCard
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span>Investment Balance at Age {targetAge}</span>
          <Tooltip
            title="This shows a breakdown of your projected / actual investment balance from assets at the selected age"
            arrow
          >
            <IconButton size="small" sx={{ p: 0 }}>
              <InfoOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      }
      action={
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Age</InputLabel>
          <Select
            value={safeTargetAge}
            label="Age"
            onChange={(e) => onAgeChange(Number(e.target.value))}
          >
            {ages.map((age) => (
              <MenuItem key={age} value={age}>{age}</MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      {data.length === 0 ? (
        <Typography>No investment balances at this age.</Typography>
      ) : (
        <PieChart
          height={180}
          width={180}
          series={[
            {
              data,
              innerRadius: 55,
              outerRadius: 90,
              arcLabel: (item) =>
                `${((item.value / balance) * 100).toFixed(0)}%`,
              valueFormatter: (item) => currencyFormatter(item.value),
              highlightScope: { fade: 'global', highlight: 'item' },
            },
          ]}
        >
          <PieCenterLabel>{currencyFormatter(balance)}</PieCenterLabel>
        </PieChart>
      )}

       {/* Comparison Section */}
      {priorBalance != null && (
        <Box mt={3} display="flex" alignItems="center" gap={0.5}>
          {diff != null && (
            diffPositive
              ? <ArrowDropUp color="success" />
              : <ArrowDropDown color="error" />
          )}

          <Typography
            variant="body2"
            sx={{
              color: diffPositive ? "success.main" : "error.main",
              fontWeight: 600,
            }}
          >
            {diffPositive ? "+" : ""}
            {diff?.toLocaleString()} ({pctDiff?.toFixed(1)}%)
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            vs age {comparisonAge} (${priorBalance.toLocaleString()})
          </Typography>
        </Box>
      )}
    </DashboardCard>
  );
}
