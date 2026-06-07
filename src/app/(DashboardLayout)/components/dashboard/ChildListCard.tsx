"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { IconPencil, IconTrash, IconPlus } from "@tabler/icons-react";
import { IconBabyCarriage } from '@tabler/icons-react';

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useUserChildren } from "@/lib/userChildren/hook";
import { UserChildRecord } from "@/lib/userChildren/schema";
import EditUserChildDialog from "@/app/(DashboardLayout)/components/dashboard/EditDialogs/EditUserChildDialog";

type ChildListCardProps = {
  refreshKey?: number;
  onChange?: () => void;
};

export default function ChildListCard({ refreshKey = 0, onChange }: ChildListCardProps) {
  const { data: children, loading, refresh, remove } = useUserChildren();
  const [editingChild, setEditingChild] = useState<UserChildRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (refreshKey > 0) {
      refresh();
    }
  }, [refreshKey, refresh]);

  const handleEdit = (child: UserChildRecord) => {
    setEditingChild(child);
    setDialogOpen(true);
  };

  const handleDelete = async (child: UserChildRecord) => {
    if (!confirm(`Delete ${child.label ?? "this child"}?`)) return;

    try {
      await remove(child.id);
      onChange?.();
    } catch (err) {
      console.error("Failed to delete child:", err);
      setErrorMsg("Failed to delete child. Please try again.");
    }
  };

  const handleAdd = () => {
    setEditingChild(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingChild(null);
  };

  const handleDialogSaved = async () => {
    handleDialogClose();
    await refresh();
    onChange?.();
  };

  return (
    <>
      <DashboardCard
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconBabyCarriage />
            Children Profile
          </Box>
        }
        action={
          <IconButton size="small" color="info" onClick={handleAdd}>
            <IconPlus />
          </IconButton>
        }
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : children && children.length > 0 ? (
          <Grid container spacing={2}>
            {children.map((child) => (
              <Grid size={{ xs: 12, sm: 6 }} key={child.id}>
                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {child.label || "Child"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      Born: {child.birthYear ?? "—"}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="caption">
                        <strong>College:</strong> {child.collegeStartYear ?? "—"}–{child.collegeEndYear ?? "—"}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ mt: "auto", justifyContent: "flex-end", pt: 0 }}>
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => handleEdit(child)}
                      title="Edit"
                    >
                      <IconPencil fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(child)}
                      title="Delete"
                    >
                      <IconTrash fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1 }}>
            <Typography variant="body1">No children have been added yet.</Typography>
            <Typography variant="body2" color="text.secondary">
              Use the Add button above to create a child record.
            </Typography>
          </Box>
        )}
      </DashboardCard>

      <EditUserChildDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSaved={handleDialogSaved}
        child={editingChild}
      />

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
      >
        <Alert severity="error" onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
