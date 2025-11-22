"use client";
import { Typography, FormControl, MenuItem, Select, InputLabel, Box } from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

export function InvestmentBalanceAtAge({
  combined,
  targetAge,
  onAgeChange,
  targetRetirementAge,
}: {
  combined: Array<any>;
  targetAge: number;
  onAgeChange: (age: number) => void;
  targetRetirementAge: number;
}) {
  const ages = combined.map((r) => r.age);

  const row = combined.find((r) => r.age === targetAge);
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

  return (
    <DashboardCard
      title={`Investment Balance at Age ${targetAge}`}
      action={
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Age</InputLabel>
          <Select
            value={targetAge}
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
      {/* Primary Value */}
      <Typography variant="h4" fontWeight={700}>
        ${balance.toLocaleString()}
      </Typography>

      {/* Comparison Section */}
      {priorBalance != null && (
        <Box mt={1} display="flex" alignItems="center" gap={0.5}>
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
