"use client";
import { useState } from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import EditIncomeSourceDialog from "./EditDialogs/EditIncomeSourcesDialog";
import { IncomeCard } from "./IncomeCard";
import { AddIncomeCard } from "./AddIncomeCard";
import { AssetInput } from "@/lib/assets/schema";

interface IncomeSourcesProps {
  primaryUserAttributes: Record<string, any>;
  spouseUserAttributes: Record<string, any> | null;
  hasSpouse: boolean;
  sources: any[] | null;
  loading: boolean;
  save: (input: AssetInput & { id?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const IncomeSourceDetailedList = ({
  primaryUserAttributes,
  spouseUserAttributes,
  hasSpouse,
  sources,
  loading,
  save,
  remove,
  refresh,
}: IncomeSourcesProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  const [newSourceType, setNewSourceType] = useState<string | null>(null);

  // Edit handlers
  const handleEdit = (id: string) => {
    setEditingSourceId(id);
    setNewSourceType(null);
    setOpenEditDialog(true);
  };

  const handleSelectType = (type: string) => {
    setNewSourceType(type);
    setEditingSourceId(null);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingSourceId(null);
    setNewSourceType(null);
    setOpenEditDialog(false);
  };

  const handleSave = async (input: AssetInput & { id?: string }) => {
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
        userAttributes={primaryUserAttributes}
        hasSpouse={hasSpouse}
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
              sources.map((src) => {
                const birthYear =
                  src.spouse && hasSpouse
                    ? spouseUserAttributes?.birthYear
                    : primaryUserAttributes.birthYear;

                return (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={src.id}>
                    <IncomeCard
                      src={src}
                      hasSpouse={hasSpouse}
                      birthYear={birthYear}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </Grid>
                );
            })}
          </Grid>
        )}
      </Box>

    </>
  );
};

export default IncomeSourceDetailedList;