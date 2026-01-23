"use client";
import { useState } from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import EditRealEstateDialog from "./EditDialogs/EditRealEstateDialog";
import { RealEstateCard } from "./RealEstateCard";
import { AddRealEstateCard } from "./AddRealEstateCard";
import { useMediaQuery, useTheme } from "@mui/material";
import { RealEstatePropertyProjectionRow } from "financial-calcs";
import { AnyProjectionRow } from "@/lib/assets/types";
import { AssetInput } from "@/lib/assets/schema";

interface RealEstateProps {
  primaryUserAttributes: Record<string, any>;
  spouseUserAttributes: Record<string, any> | null;
  hasSpouse: boolean;
  properties: any[] | null;
  projectionTables: Record<string, AnyProjectionRow[]>;
  loading: boolean;
  save: (input: AssetInput & { id?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const RealEstateDetailedList = ({
  primaryUserAttributes,
  spouseUserAttributes,
  hasSpouse,
  properties,
  projectionTables,
  loading,
  save,
  remove,
  refresh,
}: RealEstateProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Edit handlers
  const handleEdit = (id: string) => {
    setEditingPropertyId(id);
    setOpenEditDialog(true);
  };

  const handleAdd = () => {
    setMenuAnchor(null);
    setEditingPropertyId(null);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingPropertyId(null);
    setOpenEditDialog(false);
  };

  const handleSave = async (input: AssetInput & { id?: string }) => {
    await save(input);
    await refresh();
    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this real estate property?")) {
      await remove(id);
    }
  };

  return (
    <>
      <EditRealEstateDialog
        userAttributes={primaryUserAttributes}
        hasSpouse={hasSpouse}
        open={openEditDialog}
        properties={properties}
        propertyId={editingPropertyId}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <Box mt={2}>
        {loading && <Typography>Loading real estate properties…</Typography>}

        {!loading &&  (
          <Grid container spacing={2}>
            <Grid size={{xs: 12, sm: 6, lg: 4 }}>
              <AddRealEstateCard onAdd={handleAdd} />
            </Grid>
            
            {properties && properties.length > 0 &&
              properties.map((property) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={property.id}>
                  <RealEstateCard
                    property={property}
                    hasSpouse={hasSpouse}
                    projectionTable={projectionTables[property.id] as RealEstatePropertyProjectionRow[]}
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

export default RealEstateDetailedList;