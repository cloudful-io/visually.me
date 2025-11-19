"use client";

import { useState } from "react";
import {  Grid, Stack, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { IconFilePlus, IconCash, IconEdit, IconTrash, IconHelp} from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { IncomeSourcesIcon } from "./IncomeSourcesIcon";
import { useIncomeSources } from "@/lib/incomeSources/hook";
import EditIncomeSourceDialog from "./EditDialogs/EditIncomeSourcesDialog";

const IncomeSources = () => {
  const { data: sources, loading, save, remove, refresh } = useIncomeSources();

  let sortedSources;
  if (sources) {
    sortedSources = sources!.slice().sort((a, b) => {
        // Sort alphabetically by type first, then label
        const typeA = a.type.toLowerCase();
        const typeB = b.type.toLowerCase();
        if (typeA !== typeB) return typeA.localeCompare(typeB);

        let labelA = "", labelB = "";
        try { labelA = JSON.parse(a.data).label; } catch {}
        try { labelB = JSON.parse(b.data).label; } catch {}
        return labelA.localeCompare(labelB);
    });
  }

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

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
    await refresh();
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
            <MenuItem onClick={() => handleSelectType("fers-pension")}>
              FERS Pension
            </MenuItem>
            <MenuItem onClick={() => handleSelectType("retirement-savings")}>
              Retirement Savings
            </MenuItem>
            <MenuItem onClick={() => handleSelectType("social-security")}>
              Social Security Benefits
            </MenuItem>
          </Menu>
        </>
      }
    >
      <EditIncomeSourceDialog
        open={openEditDialog}
        sources={sources}   
        sourceId={editingSourceId}
        defaultType={newSourceType}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <Box mt={2}>
        {loading && <Typography>Loading income sources…</Typography>}

        {!loading && (!sortedSources || sortedSources.length === 0) && (
          <Typography>No income sources yet. </Typography>
        )}

        {!loading && sortedSources && sortedSources.length > 0 && (
          <Stack spacing={2}>
           {sortedSources.map((src) => {
              let label = "";
              try {
                label = JSON.parse(src.data).label;
              } catch {
                label = "(unknown)";
              }
              return (
                <Grid
                  container
                  key={src.id}
                  spacing={1}
                  alignItems="center"
                >
                    <Grid size={{ xs: 8 }} container alignItems="center" spacing={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {IncomeSourcesIcon[src.type] || <IconHelp size={20} />}
                          <Typography variant="body1"sx={{ lineHeight: 1 }}>
                            {label}
                          </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 4 }} container justifyContent="flex-end" spacing={1}>
                      <Grid>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(src.id!)}
                        >
                            <IconEdit />
                        </IconButton>
                        </Grid>

                        <Grid>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(src.id!)}
                        >
                            <IconTrash />
                        </IconButton>
                      </Grid>
                    </Grid>
                </Grid>
              );
            })}
          </Stack>
        )}
      </Box>
    </DashboardCard>
  );
};

export default IncomeSources;