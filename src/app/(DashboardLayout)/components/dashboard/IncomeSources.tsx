"use client";

import React, { useState } from "react";
import { Grid, Stack, Typography, Box, Avatar, IconButton } from "@mui/material";
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

  const handleEdit = (id: string) => {
    setEditingSourceId(id);
    setOpenEditDialog(true);
  };

  const handleAdd = () => {
    setEditingSourceId(null);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingSourceId(null);
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
      action={<IconButton size="small" color="primary" aria-label="Add Source" aria-haspopup="dialog"  onClick={handleAdd}><IconFilePlus/></IconButton>}
    >
      <EditIncomeSourceDialog
        open={openEditDialog}
        sourceId={editingSourceId}
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
                <Grid size={{xs:8}}>
                  <Typography>
                    <strong>{src.type}</strong>: {src.data}
                  </Typography>
                </Grid>
                <Grid size={{xs:4}} container justifyContent="flex-end" spacing={1}>
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
