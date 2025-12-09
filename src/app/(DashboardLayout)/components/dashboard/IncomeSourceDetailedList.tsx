"use client";
import { useState } from "react";
import Link from "next/link";
import { Grid, Stack, Typography, Box, Button, Menu, MenuItem, Tabs, Tab } from "@mui/material";
import { IconCalendar, IconList, IconCoin, IconUser, IconBuildingBank } from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import EditIncomeSourceDialog from "./EditDialogs/EditIncomeSourcesDialog";
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
    <DashboardCard>
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

        {!loading && (!sources || sources.length === 0) && (
          <Typography>No income / investment yet.</Typography>
        )}

        {!loading && sources && sources.length > 0 && (
          <>
            {/* --- TABS + ADD BUTTON ROW --- */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2, flexWrap: "wrap" }}
            >
              {/* Tabs */}
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  flexGrow: 1,
                  minHeight: { xs: 38, sm: 48 },
                  "& .MuiTab-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: { xs: "auto", sm: 120 },
                    padding: { xs: "6px 8px", sm: "10px 16px" },
                  },
                }}
              >
                <Tab icon={<IconList size={isMobile ? 20 : 22}/>} iconPosition="start" label={isMobile ? "" : "All"} aria-label="All"/>
                <Tab icon={<IconUser size={isMobile ? 20 : 22}/>} iconPosition="start" label={isMobile ? "" : "Pension"} aria-label="Pension"/>
                <Tab icon={<IconCoin size={isMobile ? 20 : 22}/>} iconPosition="start" label={isMobile ? "" : "Retirement Savings"} aria-label="Retirement Savings"/>
                <Tab icon={<IconBuildingBank size={isMobile ? 20 : 22}/>} iconPosition="start" label={isMobile ? "" : "Social Security"} aria-label="Social Security"/>
              </Tabs>

              {/* Add (+) Button */}
              <Box ml={2}>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  aria-label="Add Source"
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                >+</Button>

                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => setMenuAnchor(null)}
                >
                  <MenuItem onClick={() => handleSelectType("fers-pension")}>
                    FERS Pension
                  </MenuItem>
                  <MenuItem onClick={() => handleSelectType("military-pension")}>
                    Uniformed Service Pension
                  </MenuItem>
                  <MenuItem onClick={() => handleSelectType("retirement-savings")}>
                    Retirement Savings
                  </MenuItem>
                  <MenuItem onClick={() => handleSelectType("social-security")}>
                    Social Security Benefits
                  </MenuItem>
                </Menu>
              </Box>
            </Box>

            {/* --- FILTERED LIST --- */}
            <Stack spacing={2}>
              {filteredSources?.map((src) => {
                let label = "";
                try {
                  label = JSON.parse(src.data).label;
                } catch {
                  label = "(unknown)";
                }
                return (
                  <Grid container key={src.id} spacing={1} alignItems="center">
                    <Grid size={{ xs: 8 }} container alignItems="center" spacing={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Stack
                          direction={{ sm: "column", md: "row" }}
                          spacing={{ sm: 0.5, md: 1 }}
                          sx={{ width: "100%" }}
                        >
                          <Typography
                            component={Link}
                            href={`/income/${src.id}`}
                            color="primary"
                            sx={{
                              textDecoration: "none",
                              cursor: "pointer",
                              "&:hover": { color: "primary.dark" },
                            }}
                          >
                            {label}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                            <IconCalendar size={16} />
                            <Typography variant="caption">Starts {src.firstYear}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 4 }} container justifyContent="flex-end" spacing={1}>
                      <Grid>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(src.id!)}
                        >
                          Edit
                        </Button>
                      </Grid>

                      <Grid>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => handleDelete(src.id!)}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Stack>
          </>
        )}
      </Box>

    </DashboardCard>
  );
};

export default IncomeSourceDetailedList;