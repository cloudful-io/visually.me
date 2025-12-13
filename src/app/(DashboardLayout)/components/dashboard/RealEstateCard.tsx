"use client";

import { useState } from "react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Box, Button, Stack, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { IconDotsVertical, IconPencil, IconTrash, IconMapPin } from "@tabler/icons-react";
import LinearProgressWithLabel from "@/app/components/LinearProgressWithLabel";
import { currencyFormatter } from "@/lib/formatters/currency";

interface RealEstate {
  id: string;
  data: string;      
}

interface RealEstateProps {
  property: RealEstate;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RealEstateCard({ property, onEdit, onDelete }: RealEstateProps) {
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

  try {
    parsed = JSON.parse(property.data);
    label = parsed.label ?? "(unknown)";
    address = parsed.address ?? "";
  } catch {
    label = "(unknown)";
  }  

  return (
    <DashboardCard 
      title={
        <Box display="flex" flexDirection="column" gap={1}>
          {/* Icon for the income type */}

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
            <Box>
              <Button
                component={Link}
                href={`/real-estate/${property.id}`}
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
