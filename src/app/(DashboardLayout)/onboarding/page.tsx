"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { IconChecklist, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import EditIncomeSourceDialog from "../components/dashboard/EditDialogs/EditIncomeSourcesDialog";
import { useIncomeSources } from "@/lib/assets/useIncomeSources";
import { useUserAttributes } from '@/lib/userAttributes/hook';
import { AssetInput } from "@/lib/assets/schema";

export default function IncomeSourceOnboarding() {

  const { data: attrs, loading: attrsLoading, refresh: refreshAttrs } = useUserAttributes();
  const requiredTypes = ["fers-pension", "military-pension", "retirement-savings", "social-security"];
  const [typeStatus, setTypeStatus] = useState<{type: string; exists: boolean}[]>([]);
  const { computedAssets: sources, loading, save, remove, refresh } = useIncomeSources();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [newSourceType, setNewSourceType] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setTypeStatus(
        requiredTypes.map(t => ({
        type: t,
        exists: (sources ?? []).some(s => s.asset_type === t)
        }))
    );
  }, [sources]);

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

  const handleProceed = () => {
    router.push("/dashboard");
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <IconChecklist size={72} style={{ marginBottom: 20 }} />

      <Typography variant="h4" gutterBottom>
        Let’s Set Up Your Income Sources
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, maxWidth: 600 }}>
        Before we can forecast your retirement, please add one of each income source below.
      </Typography>

      <Card sx={{ width: "100%", maxWidth: 600, mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            {typeStatus.map((t) => (
              <Grid key={t.type} size={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {t.exists ? (
                    <IconCircleCheck color="green" size={40} />
                  ) : (
                    <IconCircleX color="red" size={40} />
                  )}
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {formatLabel(t.type)}
                  </Typography>

                  {!t.exists && (
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleSelectType(t.type)}
                    >
                      Add
                    </Button>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <EditIncomeSourceDialog
        userAttributes={attrs || {}}
        open={openEditDialog}
        sources={sources}   
        sourceId={editingSourceId}
        defaultType={newSourceType}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
      {sources != undefined && sources?.length > 0 && (
      <Button variant="outlined" onClick={handleProceed}>
        Proceed to Dashboard
      </Button>
      )}
    </Box>
  );
}

function formatLabel(type: string) {
  switch (type) {
    case "fers-pension": return "Federal Employee Retirement System (FERS) Pension";
    case "military-pension": return "Uniformed Service Pension";
    case "retirement-savings": return "Retirement Savings";
    case "social-security": return "Social Security Benefits";
    default: return type;
  }
}
