"use client";
import { Typography, FormControl, MenuItem, Select, InputLabel, Box } from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

export function IncomeAtAge({
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
  const safeTargetAge = ages.includes(targetAge) ? targetAge : "";

  const row = combined.find((r) => r.age === targetAge);
  const income = Math.round(row?.annualIncome ?? 0);

  // Compare to year before retirement
  const comparisonAge = targetRetirementAge - 1;
  const prior = combined.find((r) => r.age === comparisonAge);
  const priorIncome = prior ? Math.round(prior.annualIncome) : null;

  const diff = priorIncome != null ? income - priorIncome : null;
  const diffPositive = diff != null && diff >= 0;

  const pctDiff =
    priorIncome != null && priorIncome !== 0
      ? ((income - priorIncome) / priorIncome) * 100
      : null;

  return (
    <DashboardCard
      title={`Annual Income at Age ${targetAge}`}
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
      {/* Primary Value */}
      <Typography variant="h4" fontWeight={700}>
        ${income.toLocaleString()}
      </Typography>

      {/* Comparison Section */}
      {priorIncome != null && (
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
            vs age {comparisonAge} (${priorIncome.toLocaleString()})
          </Typography>
        </Box>
      )}
    </DashboardCard>
  );
}
