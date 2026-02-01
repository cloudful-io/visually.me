"use client";

import { useState, useMemo } from "react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Box, Button, Chip, Stack, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Link from "next/link";
import { IconDotsVertical, IconPencil, IconTrash, IconUser, IconChartLine, IconCurrencyDollar } from "@tabler/icons-react";
import LinearProgressWithLabel from "@/app/components/LinearProgressWithLabel";
import { IncomeSourcesIcon } from "./IncomeSourcesIcon";
import { currencyFormatter } from "@/lib/formatters/currency";

interface IncomeSource {
  id: string;
  asset_type: string;
  spouse: boolean;
  data: string;      
  firstYear?: number;
  firstAmount?: number;
  currentAmount?: number;
  rows?: {
    year: number;
    contribution: number;
    beginningBalance: number;
    endingBalance: number;
    yieldPercent?: number;
  }[];
}

interface IncomeCardProps {
  src: IncomeSource;
  hasSpouse: boolean;
  birthYear: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function calculateSimpleAnnualizedReturn(rows: IncomeSource["rows"]) {
  if (!rows || rows.length === 0) return null;

  const currentYear = new Date().getFullYear();
  const pastRows = rows
    .filter((r) => r.year < currentYear)
    .sort((a, b) => a.year - b.year);

  if (pastRows.length < 1) return null;

  const startBalance = pastRows[0].beginningBalance;
  const endBalance = pastRows[pastRows.length - 1].endingBalance;
  const totalContributions = pastRows.reduce(
    (sum, r) => sum + (r.contribution ?? 0),
    0
  );
  const years = pastRows.length;

  if (startBalance <= 0 || endBalance <= 0 || years === 0) return null;

  const adjustedEnd = endBalance - totalContributions;
  if (adjustedEnd <= 0) return null;

  const annualizedReturn = Math.pow(adjustedEnd / startBalance, 1 / years) - 1;
  const firstYear = pastRows[0].year;
  const lastYear = pastRows[pastRows.length - 1].year;
  const yearRange = firstYear === lastYear ? `${firstYear}` : `${firstYear}-${lastYear}`;

  return {
    value: (annualizedReturn * 100).toFixed(1),
    range: yearRange,
  };
}


export function IncomeCard({ src, hasSpouse, birthYear, onEdit, onDelete }: IncomeCardProps) {

  type IncomeCardView = "income" | "performance";
  const [view, setView] = useState<IncomeCardView>("performance");

  const handleEdit = (id: string) => {
    setMenuAnchor(null);
    onEdit(id);
  };

  const handleDelete = (id: string) => {
    setMenuAnchor(null);
    onDelete(id);
  };

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  let label = "";
  let parsed: any = {};

  try {
    parsed = JSON.parse(src.data);
    label = parsed.label ?? "(unknown)";
  } catch {
    label = "(unknown)";
  }

  const currentYear = new Date().getFullYear();

  const amountToShow =
    src.currentAmount != null ? src.currentAmount : src.firstAmount ?? null;

  let yearsLeft: number | null = null;
  let progressPct = 0;

  const withdrawYear = src.firstYear ?? null;
 
  if (birthYear && withdrawYear) {
    const totalDuration = withdrawYear - birthYear;

    if (totalDuration > 0) {
      const elapsed = currentYear - birthYear;

      progressPct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

      // Remaining years until withdraw
      yearsLeft = Math.max(0, withdrawYear - currentYear);
    } else {
      progressPct = 100;
      yearsLeft = 0;
    }
  }

  const annualizedReturn = useMemo(() => {
  if (src.asset_type === "retirement-savings") {
    const result = calculateSimpleAnnualizedReturn(src.rows);
    return result;
  }
  return null;
}, [src]);

  const effectiveView: IncomeCardView = src.asset_type === "retirement-savings" ? (annualizedReturn ? "performance" : "income") : "income";

  return (
    <DashboardCard 
      title={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          {/* Left side: icon, label, chip */}
          <Box display="flex" alignItems="center" gap={1} minWidth={0}>
            {IncomeSourcesIcon[src.asset_type] ?? <IconUser size={20} />}

            <Typography variant="h6" fontWeight={600} noWrap>
              {label}
            </Typography>

            {hasSpouse && (
              <Chip
                label={src.spouse ? "Spouse" : "You"}
                size="small"
                color={src.spouse ? "secondary" : "primary"}
                sx={{ ml: 0.5, height: 20, fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>
      }
      action={
        <Box display="flex" alignItems="center" gap={0.5}>
          {/* View toggle (only for retirement savings) */}
          {src.asset_type === "retirement-savings" && annualizedReturn && (
            <ToggleButtonGroup
              size="small"
              exclusive
              value={view}
              onChange={(_, newView) => {
                if (newView) setView(newView);
              }}
              sx={{
                mr: 0.5,
                "& .MuiToggleButton-root": {
                  px: 1,
                },
              }}
            >
              <ToggleButton value="performance" aria-label="Performance view">
                <IconChartLine size={16} />
              </ToggleButton>
              <ToggleButton value="income" aria-label="Income view">
                <IconCurrencyDollar size={16} />
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          <IconButton
            size="small"
            color="info"
            aria-label="Add Source"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <IconDotsVertical />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => handleEdit(src.id)}>
              <ListItemIcon>
                <IconPencil fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleDelete(src.id)}>
              <ListItemIcon>
                <IconTrash fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      }>
      <Box display="flex" flexDirection="column">
        <Stack spacing={1.5}>
          {/* Body Content */}
          <Stack spacing={2}>
            {/* INCOME VIEW */}
            {effectiveView === "income" && (
              <>
                {amountToShow != null && (
                  <Typography variant="h5" fontWeight={700}>
                    {currencyFormatter(amountToShow)} / year
                  </Typography>
                )}

                {src.firstYear && (
                  <Box width="100%">
                    <LinearProgressWithLabel
                      value={progressPct}
                      label={
                        yearsLeft !== null && yearsLeft > 0
                          ? `${yearsLeft}y until first withdraw (${src.firstYear})`
                          : "Withdrawing now"
                      }
                    />
                  </Box>
                )}
              </>
            )}

            {/* PERFORMANCE VIEW */}
            {effectiveView === "performance" && annualizedReturn && (
              <Stack spacing={0.75}>
                <Typography variant="body1" color="text.secondary">
                  Annualized Return {annualizedReturn!.range && `(${annualizedReturn!.range})`}
                </Typography>

                <Typography 
                  variant="h4" 
                  fontWeight={700}
                  color={Number(annualizedReturn!.value) >= 0 ? "success.main" : "error.main"}
                >
                  {annualizedReturn!.value}%
                </Typography>

                {/*<Typography variant="caption" color="success.main">
                  +1.1% vs S&P 500
                </Typography>*/}
              </Stack>
            )}

            {/* CTA */}
            <Box>
              <Button
                component={Link}
                href={`/income/${src.id}`}
                variant="outlined"
                size="small"
                color="primary"
              >
                View Detail
              </Button>
            </Box>
          </Stack>

        </Stack>
      </Box>
    </DashboardCard>
  );
}
