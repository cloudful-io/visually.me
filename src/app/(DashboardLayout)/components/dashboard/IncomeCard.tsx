"use client";

import { useState } from "react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Box, Button, Stack, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { IconDotsVertical, IconPencil, IconTrash, IconUser } from "@tabler/icons-react";
import LinearProgressWithLabel from "@/app/components/LinearProgressWithLabel";
import { IncomeSourcesIcon } from "./IncomeSourcesIcon";
import { currencyFormatter } from "@/lib/formatters/currency";

interface IncomeSource {
  id: string;
  type: string;
  data: string;      
  firstYear?: number;
  firstAmount?: number;
  currentAmount?: number;
}

interface IncomeCardProps {
  src: IncomeSource;
  birthYear: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function IncomeCard({ src, birthYear, onEdit, onDelete }: IncomeCardProps) {

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

  return (
    <DashboardCard 
      title={
        <Box display="flex" alignItems="center" gap={1}>
          {/* Icon for the income type */}
          {IncomeSourcesIcon[src.type] ?? <IconUser size={20} />}

          {/* Label */}
          <Typography variant="h6" fontWeight={600} noWrap>
              {label}
          </Typography>
        </Box>
      }
      action={
      <>
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
      </>
    }>
      <Box display="flex" flexDirection="column">
        <Stack spacing={1.5}>

          {/* Body Content */}
          <Stack spacing={2}>
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
            <Box>
              <Button
                component={Link}
                href={`/income/${src.id}`}
                variant="outlined"
                size="small"
                color="primary"
              >
                View Details
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </DashboardCard>
  );
}
