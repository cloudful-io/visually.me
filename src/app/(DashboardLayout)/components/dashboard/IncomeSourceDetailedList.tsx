"use client";
import { useState } from "react";
import Link from "next/link";
import { Grid, Stack, Typography, Box, Button, Menu, MenuItem, Tabs, Tab } from "@mui/material";
import { IconCalendar, IconList, IconCoin, IconUser, IconBuildingBank } from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import EditIncomeSourceDialog from "./EditDialogs/EditIncomeSourcesDialog";
import { IncomeCard } from "./IncomeCard";
import { AddIncomeCard } from "./AddIncomeCard";
import { useMediaQuery, useTheme } from "@mui/material";

interface IncomeSourcesProps {
  userAttributes: Record<string, any>;
  sources: any[] | null;
  loading: boolean;
  save: (input: { type: string; data: string; id?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const IncomeSourceDetailedList = ({
  userAttributes,
  sources,
  loading,
  save,
  remove,
  refresh,
}: IncomeSourcesProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [newSourceType, setNewSourceType] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --- TAB STATE ---
  const [tabValue, setTabValue] = useState(0);

  const tabToTypeMap: Record<number, string[] | null> = {
    0: null,
    1: ["fers-pension", "military-pension"],
    2: ["retirement-savings"],
    3: ["social-security"],
  };

  const filteredSources =
    tabToTypeMap[tabValue] === null
      ? sources
      : sources?.filter((s) => tabToTypeMap[tabValue]?.includes(s.type));

  // Edit handlers
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
    if (confirm("Are you sure you want to delete this income / investment?")) {
      await remove(id);
    }
  };

  return (
    <>
      <EditIncomeSourceDialog
        userAttributes={userAttributes}
        open={openEditDialog}
        sources={sources}
        sourceId={editingSourceId}
        defaultType={newSourceType}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <Box mt={2}>
        {loading && <Typography>Loading income and investment…</Typography>}

        {!loading &&  (
          <Grid container spacing={2}>
            <Grid size={{xs: 12, sm: 6, lg: 4 }}>
              <AddIncomeCard onAdd={handleSelectType} />
            </Grid>
            
            {sources && sources.length > 0 &&
              sources.map((src) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={src.id}>
                  <IncomeCard
                    src={src}
                    startYear={userAttributes.startYear}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
          </Grid>
        )}
      </Box>

    </>
  );
};

export default IncomeSourceDetailedList;