"use client";

import React, { useState } from "react";
import { 
  Grid, Stack, Typography, Box, Avatar, IconButton,
  Menu, MenuItem 
} from "@mui/material";
import { IconFilePlus, IconCash, IconEdit, IconTrash } from "@tabler/icons-react";

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useIncomeSources } from "@/lib/incomeSources/hook";

import EditIncomeSourceDialog from "./EditIncomeSourcesDialog";

const IncomeSources = () => {
  const { user } = useSupabaseAuth();
  const { data: sources, loading, save, remove } = useIncomeSources();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  // NEW ----- menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [newSourceType, setNewSourceType] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingSourceId(id);
    setNewSourceType(null);
    setOpenEditDialog(true);
  };

  const handleSelectType = (type: string) => {
    setMenuAnchor(null);
    setNewSourceType(type);
    setEditingSourceId(null);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingSourceId(null);
    setNewSourceType(null);
    setOpenEditDialog(false);
  };

  const handleSave = async (input: { type: string; data: string; id?: string }) => {
    await save(input);
    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this income source?")) {
      await remove(id);
    }
  };

  return (
    <DashboardCard
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconCash />
          Income Sources
        </Box>
      }
      action={
        <>
          <IconButton
            size="small"
            color="primary"
            aria-label="Add Source"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <IconFilePlus />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => handleSelectType("Retirement Savings")}>
              Retirement Savings
            </MenuItem>
            <MenuItem onClick={() => handleSelectType("Social Security")}>
              Social Security Benefits
            </MenuItem>
            <MenuItem onClick={() => handleSelectType("FERS Pension")}>
              FERS Pension
            </MenuItem>
          </Menu>
        </>
      }
    >
      <EditIncomeSourceDialog
        open={openEditDialog}
        sourceId={editingSourceId}
        defaultType={newSourceType} // NEW
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <Box mt={2}>
        {loading && <Typography>Loading income sources…</Typography>}

        {!loading && (!sources || sources.length === 0) && (
          <Typography>No income sources yet. </Typography>
        )}

        {!loading && sources && sources.length > 0 && (
          <Stack spacing={2}>
            {sources.map((src) => (
              <Grid container key={src.id} spacing={1} alignItems="center">
                <Grid size={{ xs: 8 }}>
                  <Typography>
                    <strong>{src.type}</strong>: {src.data}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }} container justifyContent="flex-end" spacing={1}>
                  <Grid>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(src.id!)}>
                      <IconEdit />
                    </IconButton>
                  </Grid>
                  <Grid>
                    <IconButton size="small" color="error" onClick={() => handleDelete(src.id!)}>
                      <IconTrash />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Stack>
        )}
      </Box>
    </DashboardCard>
  );
};

export default IncomeSources;
