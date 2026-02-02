"use client";

import { useState } from "react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { RealEstatePropertyProjectionRow } from "financial-calcs";
import { Box, Button, Chip, Stack, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { IconDotsVertical, IconPencil, IconTrash, IconMapPin, IconFlagFilled, IconHome } from "@tabler/icons-react";
import { currencyFormatter } from "@/lib/formatters/currency";

interface RealEstate {
  id: string;
  spouse: boolean;
  data: string;      
}

interface RealEstateProps {
  property: RealEstate;
  hasSpouse: boolean;
  projectionTable: RealEstatePropertyProjectionRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RealEstateCard({ property, hasSpouse, projectionTable, onEdit, onDelete }: RealEstateProps) {
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
  let address = "";
  let parsed: any = {};
  let monthlyIncome = 0;
  let monthlyExpense = 0;
  let monthlyNetCashFlow = 0;

  try {
    parsed = JSON.parse(property.data);
    label = parsed.label ?? "(unknown)";
    address = parsed.address ?? "";
    

    const currentYear = new Date().getFullYear();
    const currentRow = projectionTable.find(row => row.year === currentYear);

    monthlyIncome = currentRow?.monthlyRentalIncome ?? 0;
    const monthlyMortgage = currentRow?.monthlyMortgage ?? 0;
    const monthlyHOA = currentRow?.monthlyHoaFee ?? 0;
    const monthlyPropertyTax = (currentRow?.annualPropertyTax ?? 0) / 12;
    const monthlyInsurance = (currentRow?.annualInsurance ?? 0) / 12;
    monthlyExpense = monthlyMortgage + monthlyHOA + monthlyPropertyTax + monthlyInsurance;

    monthlyNetCashFlow = monthlyIncome - monthlyExpense;

  } catch {
    label = "(unknown)";
  }  

  return (
    <DashboardCard 
      title={
        <Box 
          display="flex" 
          flexDirection="column" 
          gap={1}
          flex={1}
          minWidth={0}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <IconHome size={20} />
            {/* Label */}
            <Typography variant="h6" fontWeight={600}>
                {label}
            </Typography>
            {/* Show flag if primary home */}
            {parsed.fields.propertyType === 'residence' && (
              <IconFlagFilled color="grey"/>
            )}
            {/* Spouse / Primary Indicator */}
            {hasSpouse && (
              <Chip
                label={property.spouse ? "Spouse" : "You"}
                size="small"
                color={property.spouse ? "secondary" : "primary"}
                sx={{ ml: 0.5, height: 20, fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>
      }
      action={
      <>
        <IconButton
          size="small"
          color="info"
          aria-label="Add Property"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
        >
          <IconDotsVertical />
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleEdit(property.id)}>
            <ListItemIcon>
              <IconPencil fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDelete(property.id)}>
            <ListItemIcon>
              <IconTrash fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </>
    }>
      <Box display="flex" flexDirection="column" justifyContent="flex-start" mt={-2}>
        
        <Stack spacing={0}>

          {/* Body Content */}
          
          <Stack spacing={2}>
          {address && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <IconMapPin size={16} style={{ flexShrink: 0 }} />
              <Typography variant="body2" noWrap>
                {address}
              </Typography>
            </Box>
          )}
            <Box mt={1}>
              <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                {/* Income */}
                <Box flex={1} textAlign="center">
                  <Typography variant="caption" color="text.secondary">
                    Income
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {currencyFormatter(monthlyIncome)}
                  </Typography>
                </Box>

                {/* Minus */}
                <Typography variant="body2" color="text.secondary">
                  −
                </Typography>

                {/* Expenses */}
                <Box flex={1} textAlign="center">
                  <Typography variant="caption" color="text.secondary">
                    Expenses
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {currencyFormatter(monthlyExpense)}
                  </Typography>
                </Box>

                {/* Equals */}
                <Typography variant="body2" color="text.secondary">
                  =
                </Typography>

                {/* Net Cash Flow */}
                <Box flex={1} textAlign="center">
                  <Typography variant="caption" color="text.secondary">
                    Cash Flow (Month)
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color={monthlyNetCashFlow >= 0 ? "success.main" : "error.main"}
                  >
                    {currencyFormatter(monthlyNetCashFlow)}
                  </Typography>
                </Box>
              </Stack>

            </Box>

            <Box>
              <Button
                component={Link}
                href={`/real-estate/${property.id}`}
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
